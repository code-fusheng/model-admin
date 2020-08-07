<template>
  <!-- 加载 -->
  <div v-loading="loading">
    <!-- 搜索栏 模糊查询-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="分类名称">
        <el-input v-model="page.params.categoryName" placeholder="categoryName" clearable />
      </el-form-item>
      <el-form-item label="分类级别">
        <el-select v-model="page.params.level" placeholder="请求状态" clearable filterable>
          <el-option label="一级" :value="1" />
          <el-option label="二级" :value="2" />
          <el-option label="三级" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="起始日期">
        <el-date-picker
          v-model="page.params.categoryTime"
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
        <el-button type="primary" icon="el-icon-search" sizi="mini" @click="search">查询</el-button>
        <el-button type="success" icon="el-icon-refresh-left" size="mini" @click="refresh">恢复</el-button>
      </el-form-item>
    </el-form>
    <!-- 分割线 -->
    <el-divider />
    <el-button type="primary" icon="el-icon-plus" class="add-button" size="mini" @click="openAddDialog">添加</el-button>
    <!-- 列表 -->
    <!--
      1. :data v-bind:model="page.list" 绑定数据 分页对象的的list数据
      2. show-overflow-tooltip 超出部分隐藏
      3. @selection-change="handleSelectionChange" selection-change	当选择项发生变化时会触发该事件
      4. @sort-change="changeSort" sort-change 事件回中可以获取当前排序的字段名[prop]和排序顺序[order]
     -->
    <el-table
      :data="page.list"
      border
      fit
      style="width: 100%"
      @sort-change="changeSort"
    >
      <el-table-column type="index" fixed="left" label="#" min-width="60" align="center" />
      <el-table-column prop="categoryName" label="模版名称" min-width="150" align="center" sortable="custom" />
      <el-table-column prop="categoryImage" label="分类图片" align="center" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100%;height: 50px"
            :src="scope.row.categoryImage"
            :preview-src-list="[scope.row.categoryImage]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="articleCount" label="文章数" width="100" align="center" sortable="custom" />
      <el-table-column prop="level" label="级别" min-width="120" align="center" sortable="custom" />
      <el-table-column prop="pid" label="父级id" width="100" align="center" sortable="custom" />
      <el-table-column prop="createdTime" label="创建时间" min-width="220" align="center" sortable="custom" />
      <el-table-column prop="updateTime" label="更新时间" min-width="220" align="center" sortable="custom" />
      <el-table-column prop="enable" label="状态" min-width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled === 1">启用</el-tag>
          <el-tag v-else type="info">弃用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="400" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="toUpdate(scope.row.categoryId)">修改</el-button>
          <el-button size="mini" type="info" icon="el-icon-view" @click="toRead(scope.row.categoryId)">查看</el-button>
          <el-button v-if="scope.row.isEnabled === 0" icon="el-icon-check" size="mini" type="success" @click="toEnable(scope.row.categoryId)">启用</el-button>
          <el-button v-if="scope.row.isEnabled === 1" icon="el-icon-close" size="mini" type="warning" @click="toDisable(scope.row.categoryId)">弃用</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="toDelete(scope.row.categoryId)">删除</el-button>
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
      :page-sizes="[5,10,20,50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加弹窗 -->
    <el-dialog title="添加" :visible.sync="addDialog">
      <category-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>
    <!--
      修改弹窗
      :model="model" 用于传递参数对象
    -->
    <el-dialog title="修改" :visible.sync="updateDialog">
      <category-update :category="category" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>

  </div>
</template>

<script>
// 导入api接口定义的方法 接收变量为 categoryApi
import categoryApi from '@/api/article/category'
// 导入组件
import CategoryAdd from './category-add'
import CategoryUpdate from './category-update'
export default {
  //  定义添加的组件 子组件/私有组件
  components: {
    CategoryAdd,
    CategoryUpdate
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      categoryTime: {},
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
      category: {
        categoryId: '',
        categoryName: '',
        categoryImage: null
      },
      loading: true, // 控制是否显示加载效果
      selectcategorys: [], // 被选中的模版列
      addDialog: false, // 控制添加弹窗显示
      updateDialog: false // 控制修改弹窗显示
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
      categoryApi.getByPage(this.page).then(res => {
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
    // 操作部分相关方法
    // 修改
    toUpdate(val) {
      categoryApi.get(val).then(res => {
        this.category = res.data
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
      }).then(() => {
        categoryApi.enable(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
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
      }).then(() => {
        categoryApi.disable(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
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
      }).then(() => {
        categoryApi.delete(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 条件搜索
    search() {
      this.page.currentPage = 1
      this.getByPage(this.page)
    },
    // 恢复搜索框
    refresh() {
      this.page.currentPage = 1
      this.page.params.categoryName = null
      this.page.params.categoryTime = null
      this.$message.success('操作成功: 条件重置！')
      this.getByPage()
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
