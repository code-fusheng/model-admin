<template>
  <div>
    <!-- 搜索栏 模糊查询-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="用户名">
        <el-input v-model="page.params.username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="用户性别">
        <el-select v-model="page.params.sex" placeholder="评论状态" clearable filterable>
          <el-option label="私密" :value="0" />
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态">
        <el-select v-model="page.params.isEnabled" placeholder="评论状态" clearable filterable>
          <el-option label="启用" :value="1" />
          <el-option label="弃用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="起始日期">
        <el-date-picker
          v-model="page.params.userTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" sizi="mini" @click="getByPage">查询</el-button>
        <el-button type="success" icon="el-icon-refresh-left" size="mini" @click="refresh">恢复</el-button>
      </el-form-item>
    </el-form>
    <!-- 分割线 -->
    <el-divider />
    <el-button type="primary" icon="el-icon-plus" class="add-button" size="mini" @click="openAddDialog">添加</el-button>
    <el-button type="danger" icon="el-icon-delete" class="add-button" size="mini" @click="deleteByIds">批量删除</el-button>
    <el-button type="warning" icon="el-icon-refresh-left" class="add-button" size="mini">重置密码</el-button>
    <!-- 列表 -->
    <!--
      1. :data v-bind:model="page.list" 绑定数据 分页对象的的list数据
      2. show-overflow-tooltip 超出部分隐藏
      3. @selection-change="handleSelectionChange" selection-change	当选择项发生变化时会触发该事件
      4. @sort-change="changeSort" sort-change 事件回中可以获取当前排序的字段名[prop]和排序顺序[order]
     -->
    <el-table v-loading="loading" :data="page.list" border fit style="width: 100%" @sort-change="changeSort">
      <el-table-column type="selection" align="center" width="45" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="真实姓名">
              <span>{{ props.row.realname }}</span>
            </el-form-item>
            <el-form-item label="签名">
              <span>{{ props.row.signature }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" align="center" />
      <el-table-column prop="username" label="用户名(账号)" min-width="150" align="center" />
      <el-table-column prop="phone" label="电话" min-width="160" align="center" />
      <el-table-column prop="mail" label="邮箱" min-width="200" align="center" />
      <el-table-column prop="sex" label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex === 0" type="info">私密</el-tag>
          <el-tag v-if="scope.row.sex === 1">男</el-tag>
          <el-tag v-if="scope.row.sex === 2" type="danger">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="header" label="头像" align="center" width="60">
        <template slot-scope="scope">
          <el-image style="width: 100%;height: 40px" :src="scope.row.header" :preview-src-list="[scope.row.header]" />
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" min-width="220" align="center" sortable="custom" />
      <el-table-column prop="updateTime" label="更新时间" min-width="220" align="center" sortable="custom" />
      <el-table-column prop="enable" label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled === 1">启用</el-tag>
          <el-tag v-else type="info">弃用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.userId != 1" type="success" icon="el-icon-thumb" size="mini" @click="handleSelectRole(scope.row)">分配角色</el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="toUpdate(scope.row.userId)">修改</el-button>
          <el-button v-if="scope.row.isEnabled === 0" icon="el-icon-check" size="mini" type="success" @click="toEnable(scope.row.userId)">启用</el-button>
          <el-button v-if="scope.row.isEnabled === 1 && scope.row.userId != 1" icon="el-icon-close" size="mini" type="warning" @click="toDisable(scope.row.userId)">弃用</el-button>
          <el-button v-if="scope.row.userId != 1" size="mini" type="danger" icon="el-icon-delete" @click="toDelete(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--
      分页组件-最完整版
      class : 分页组件
      current-page : 当前页 此处为动态绑定page对象的currentPage属性
      page-sizes : 每页显示个数选择器的选项设置
      page-size : 每页大小
      layout : 组件布局
      total : 总条目数 此处动态绑定page对象的totalCount属性
      @size-change="handleSizeChange"  pageSize 改变时会触发  参数:每页条数
      @current-change="handleCurrentChange" currentPage 改变时会触发 参数:当前页
     -->
    <el-pagination
      align="center"
      class="pagination"
      :current-page="page.currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 分配角色的弹出层开始 -->
    <el-dialog title="分配角色" :visible.sync="selectRoleOpen" width="900px" center append-to-body>
      <el-table ref="roleListTable" border :data="roleTableList" @selection-change="handleRoleTableSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色ID" align="center" prop="roleId" />
        <el-table-column label="角色名称" align="center" prop="roleName" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="创建时间" align="center" prop="createdTime" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveUserRoleSubmit">确 定</el-button>
        <el-button @click="cancelUserRole">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的弹出层结束 -->

    <!-- 添加弹窗 -->
    <el-dialog title="添加用户" :visible.sync="addDialog" width="800px" center>
      <user-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>
    <!--
      修改弹窗
      :model="model" 用于传递参数对象
    -->
    <el-dialog title="修改用户" :visible.sync="updateDialog" width="800px" center>
      <user-update :user="user" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>
  </div>
</template>

<script>
// 导入api接口定义的方法 接收变量为 userApi
import userApi from '@/api/manage/user'
import roleApi from '@/api/manage/role'
// 导入组件
import UserAdd from './user-add'
import UserUpdate from './user-update'
export default {
  //  定义添加的组件 子组件/私有组件
  components: {
    UserAdd,
    UserUpdate
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      userTime: {},
      // 定义page对象
      page: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页显示条数
        totalPage: 0, // 总页数
        totalCount: 0, // 总条数
        params: {}, // 查询参数对象
        list: [], // 数据
        sortColumn: 'createdTime', // 排序列
        sortMethod: 'asc' // 排序方式
      },
      user: {
        userId: '',
        username: '',
        header: null
      },
      loading: true, // 控制是否显示加载效果
      selectusers: [], // 被选中的模版列
      addDialog: false, // 控制添加弹窗显示
      updateDialog: false, // 控制修改弹窗显示
      // 是否显示分配权限的弹出层
      selectRoleOpen: false,
      // roleIds 分配角色列表选择状态
      roleIds: [],
      // 角色数据
      roleTableList: [],
      // 当前选中的用户
      currentUserId: undefined
    }
  },
  // 初始化函数
  created() {
    this.getByPage()
  },
  // 定义方法
  methods: {
    // 每页大小改变 参数 value 为每页大小(pageSize)
    handleSizeChange(val) {
      this.page.pageSize = val
      // 重新请求,刷新页面
      this.getByPage()
    },
    // 当前页跳转 参数 value 当前页(currentPage)
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getByPage()
    },
    // 分页方法 调用封装的方法 getByPage()
    getByPage() {
      userApi.getByPage(this.page).then(res => {
        this.page = res.data
        this.loading = false
        console.log(res)
      })
    },
    // 条件排序 e 和 val 都行
    changeSort(e) {
      if (e.order) {
        this.page.sortColumn = e.prop
        this.page.sortMethod = e.order
      } else {
        this.page.sortColumn = ''
        this.page.sortMethod = 'asc'
      }
      this.$message.success('操作成功: 条件排序！')
      this.getByPage()
    },
    // 多选参数
    handleSelectionChange(val) {
      this.selectusers = val
    },
    deleteByIds() {
      // 批量删除
      this.$confirm('删除之后无法恢复，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          const ids = []
          this.selectusers.forEach(e => {
            ids.push(e.modelId)
          })
          userApi.deleteByIds(ids).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 操作部分相关方法
    // 修改
    toUpdate(id) {
      userApi.get(id).then(res => {
        this.user = res.data
        this.updateDialog = true
      })
    },
    // 查看
    toRead() {
      this.$message.success('QAQ')
    },
    // 启用
    toEnable(id) {
      this.$confirm('是否启用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userApi.enable(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
    },
    // 弃用
    toDisable(id) {
      this.$confirm('是否弃用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userApi.disable(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消弃用'
          })
        })
    },
    // 删除
    toDelete(id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userApi.delete(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 恢复搜索框
    refresh() {
      this.page.currentPage = 1
      this.page.params.username = null
      this.page.params.userTime = null
      this.$message.success('操作成功: 条件重置！')
      this.getByPage()
    },
    // 打开分配角色的弹出层
    handleSelectRole(row) {
      this.selectRoleOpen = true
      this.currentUserId = row.userId || this.ids[0]
      const tx = this
      roleApi.selectAllRole().then(res => {
        tx.roleTableList = res.data
        this.$nextTick(() => {
          // 根据当前用户查找之前拥有的角色IDS
          roleApi.getRoleIdsByUserId(tx.currentUserId).then(res2 => {
            res2.data.filter(r1 => {
              tx.roleTableList.filter(r2 => {
                if (r1 === r2.roleId) {
                  // 选中表格checkbox
                  tx.$refs.roleListTable.toggleRowSelection(r2, true)
                }
              })
            })
          })
        })
      })
    },
    cancelUserRole() {
      this.selectRoleOpen = false
    },
    // 数据表格的多选择框选择时触发
    handleRoleTableSelectionChange(selection) {
      this.roleIds = selection.map(item => item.roleId)
    },
    // 保存用户和角色之间的关系
    handleSaveUserRoleSubmit() {
      roleApi
        .saveUserRole(this.currentUserId, this.roleIds)
        .then(res => {
          this.msgSuccess('分配成功')
        })
        .catch(function() {
          this.msgError('分配失败')
        })
    },
    // 模块功能组件
    openAddDialog() {
      // 打开添加弹窗
      this.addDialog = true
    },
    closeAddDialog() {
      // 关闭添加弹窗
      this.addDialog = false
    },
    closeUpdateDialog() {
      // 关闭修改弹窗
      this.updateDialog = false
    }
  }
}
</script>

<style scoped>
.demo-form-inline {
  padding-top: 10px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
