<template>
  <div>
    <!-- 搜索栏 -->
    <!--
      1. inline 行内表单模式 默认:false
      2. :model -- v-bind:model="page" 动态绑定数据 此处主要用于绑定参数列表
    -->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="请求状态">
        <el-select v-model="page.params.status" placeholder="请求状态" clearable filterable>
          <el-option label="登录成功" :value="0" />
          <el-option label="登录失败" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="起始日期">
        <el-date-picker
          v-model="page.params.operaTime"
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
      <!-- 表单按钮 -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" sizi="mini" @click="getByPage">查询</el-button>
        <el-button type="success" icon="el-icon-refresh-left" size="mini" @click="refresh">恢复</el-button>
      </el-form-item>
    </el-form>
    <!-- 分割线 -->
    <el-divider />
    <el-button type="danger" icon="el-icon-delete" class="add-button" size="mini" @click="deleteByIds">批量删除</el-button>
    <el-button type="primary" icon="el-icon-download" disabled class="add-button" size="mini" @click="exportAll">全部导出</el-button>

    <!-- 列表 -->
    <!--
      1. :data 绑定数据 分页对象的的list数据
      2. show-overflow-tooltip 超出部分隐藏
     -->
    <el-table
      v-loading="loading"
      :data="page.list"
      border
      fit
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="changeSort"
    >
      <el-table-column
        type="selection"
        align="center"
        width="45"
      />
      <el-table-column prop="operaLogId" fixed="left" label="#" min-width="60" align="center" />
      <el-table-column prop="operaTitle" label="模块标题" align="center" min-width="220" show-overflow-tooltip />
      <el-table-column prop="operaName" label="操作人员" align="center" min-width="150" show-overflow-tooltip />
      <el-table-column prop="operatorType" label="操作类型" align="center" min-width="100" show-overflow-tooltip />
      <el-table-column prop="businessType" label="业务类型" align="center" min-width="100" />
      <el-table-column prop="method" label="方法名称" min-width="150" align="center" show-overflow-tooltip />
      <el-table-column prop="requestMethod" label="请求方式" min-width="120" align="center" show-overflow-tooltip />
      <el-table-column prop="operaUrl" label="请求URL" min-width="200" align="center" show-overflow-tooltip />
      <el-table-column prop="operaIp" label="主机地址" min-width="120" align="center" show-overflow-tooltip />
      <el-table-column prop="operaLocation" label="操作地点" min-width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="operaParam" label="请求参数" min-width="200" align="center" show-overflow-tooltip />
      <el-table-column prop="jsonResult" label="返回参数" min-width="200" align="center" show-overflow-tooltip />
      <el-table-column prop="status" label="请求状态" align="center" min-width="100">
        <!-- scope 为作用域插槽 scope.row 为当前列的对象信息 -->
        <template slot-scope="scope">
          <!-- v-if / v-else 用于条件判断 -->
          <el-tag v-if="scope.row.status === 0" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="errorMsg" label="错误消息" min-width="100" align="center" />
      <el-table-column prop="operaTime" label="操作时间" min-width="230" align="center" sortable="custom" />
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="toDelete(scope.row.loginLogId)">删除</el-button>
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
      :page-sizes="[10,20,50,100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
// 导入api接口定义的方法 接收变量为 xxxApi
import operaLogApi from '@/api/sys/operaLog'
export default {
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
      loginLogTime: {},
      // 定义page对象
      page: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页显示条数
        totalPage: 0, // 总页数
        totalCount: 0, // 总条数
        params: {}, // 查询参数对象
        list: [], // 数据
        sortColumn: 'operaTime', // 排序列
        sortMethod: 'asc' // 排序方式
      },
      loading: true, // 控制是否显示加载效果
      selectLogs: [] // 被选中的日志
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
      this.page.list = []
      operaLogApi.getByPage(this.page).then(res => {
        this.page = res.data
        this.loading = false
        console.log(res)
      })
    },
    // 多选
    handleSelectionChange(val) {
      this.selectLogs = val
    },
    // 根据ids删除
    deleteByIds() {
      // 批量删除
      this.$confirm('删除之后无法恢复，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const loginLogIds = []
        this.selectLogs.forEach(e => {
          loginLogIds.push(e.loginLogId)
        })
        operaLogApi.deleteByIds(loginLogIds).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      })
    },
    // 导出 excel
    exportAll() {
      this.loading = true
      operaLogApi.exportExcel().then(res => {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const elink = document.createElement('a')
        elink.download = '系统日志.xlsx'
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    toDelete(id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        operaLogApi.delete(id).then(res => {
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
    // 恢复搜索框
    refresh() {
      this.page.params.loginLogTime = null
      this.page.currentPage = 1
      this.page.loginStatus = null
      this.$message.success('操作成功: 条件重置！')
      this.getByPage()
    },
    // 条件排序
    changeSort(e) {
      if (e.order) {
        this.page.sortColumn = e.prop
        this.page.sortMethod = e.order
      } else {
        this.page.sortColumn = ''
        this.page.sortMethod = 'asc'
      }
      this.$message.success('操作成功: 条件查询!')
      this.getByPage()
    }
  }
}
</script>
