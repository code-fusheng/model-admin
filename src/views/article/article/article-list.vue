<template>
  <!-- 加载 -->
  <div>
    <!-- 搜索栏 模糊查询-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="文章标题">
        <el-input v-model="page.params.articleTitle" placeholder="文章标题" clearable />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="page.params.articleCategory" placeholder="分类" clearable filterable>
          <el-option v-for="item in categoryList" :key="item.categoryName" :label="item.categoryName" :value="item.categoryId" />
        </el-select>
      </el-form-item>
      <el-form-item label="起始日期">
        <el-date-picker
          v-model="page.params.articleTime"
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
    <el-table v-loading="loading" :data="page.list" border style="width: 100%" @sort-change="changeSort">
      <el-table-column type="index" fixed="left" label="#" min-width="60" align="center" />
      <el-table-column prop="articleTitle" align="center" label="标题" width="200" show-overflow-tooltip />
      <el-table-column prop="categoryName" label="分类" min-width="120" align="center" />
      <el-table-column prop="authorName" label="作者" min-width="120" align="center" />
      <el-table-column prop="articleImage" label="图片" width="120" align="center">
        <template slot-scope="scope">
          <el-image style="width: 100%;height: 50px" :src="scope.row.articleImage" :preview-src-list="[scope.row.articleImage]" />
        </template>
      </el-table-column>
      <el-table-column prop="goodCount" label="点赞数" width="100" sortable="custom" align="center" />
      <el-table-column prop="readCount" label="阅读数" width="100" sortable="custom" align="center" />
      <el-table-column prop="collectionCount" label="收藏数" width="100" sortable="custom" align="center" />
      <el-table-column prop="commentCount" label="评论数" width="100" sortable="custom" align="center" />
      <el-table-column prop="articleSource" label="文章来源" min-width="130" align="center" />
      <el-table-column prop="editModel" label="编辑模式" min-width="130" align="center" />
      <el-table-column prop="createdTime" label="创建时间" min-width="220" sortable="custom" align="center" />
      <el-table-column prop="updateTime" label="修改时间" min-width="220" sortable="custom" align="center" />
      <el-table-column prop="enable" label="状态" min-width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled === 1">启用</el-tag>
          <el-tag v-else type="info">弃用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="toUpdate(scope.row.articleId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="primary" icon="el-icon-view" @click="toRead(scope.row.articleId)">查看</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="scope.row.isEnabled === 0" icon="el-icon-check" size="mini" type="success" @click="toEnable(scope.row.articleId)">启用</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="scope.row.isEnabled === 1" icon="el-icon-close" size="mini" type="warning" @click="toDisable(scope.row.articleId)">弃用</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="toDelete(scope.row.articleId)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <!-- 添加弹窗 -->
    <el-dialog title="添加" :visible.sync="addDialog" width="80%">
      <article-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>
    <!--
      修改弹窗
      :article="article" 用于传递参数对象
    -->
    <el-dialog title="修改" :visible.sync="updateDialog" width="80%">
      <article-update :article="article" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>
    <!-- 阅读弹窗 -->
    <el-dialog title="文章内容" :visible.sync="readDialog" width="80%">
      <div v-html="article.articleContent"></div>
    </el-dialog>
  </div>
</template>

<script>
// 导入api接口定义的方法 接收变量为 articleApi
import articleApi from '@/api/article/article'
// 导入组件
import articleAdd from './article-add'
import articleUpdate from './article-update'
export default {
  //  定义添加的组件 子组件/私有组件
  components: {
    articleAdd,
    articleUpdate
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
      articleTime: {},
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
      article: {
        articleId: '',
        articleTitle: '',
        articleImage: null,
        articleContent: null,
        articleType: null,
        articleSource: null
      },
      categoryList: this.$store.getters.categoryList,
      loading: true, // 控制是否显示加载效果
      addDialog: false, // 控制添加弹窗显示
      updateDialog: false, // 控制修改弹窗显示
      readDialog: false // 控制阅读弹窗显示
    }
  },
  // 初始化函数
  created() {
    this.getByPage()
    setTimeout(() => {
      this.categoryList = this.$store.getters.categoryList
    }, 500)
  },
  // 定义方法
  methods: {
    // 条件搜索
    search() {
      this.page.currentPage = 1
      this.getByPage(this.page)
    },
    // 恢复搜索框
    refresh() {
      this.page.params.articleTime = null
      this.page.currentPage = 1
      this.page.params.articleTitle = null
      this.page.params.articleCategory = null
      this.$message.success('操作成功: 条件重置！')
      this.getByPage()
    },
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
      articleApi.getByPage(this.page).then(res => {
        console.log(res)
        this.page = res.data
        this.loading = false
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
    toUpdate(id) {
      articleApi.get(id).then(res => {
        this.article = res.data
        this.updateDialog = true
      })
    },
    // 查看 后台还是只提供查看操作，阅读的话给前台用
    toRead(id) {
      articleApi.get(id).then(res => {
        this.article = res.data
        this.readDialog = true
      })
    },
    // 启用
    toEnable(id) {
      this.$confirm('是否启用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          articleApi.enable(id).then(res => {
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
          articleApi.disable(id).then(res => {
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
          articleApi.delete(id).then(res => {
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
