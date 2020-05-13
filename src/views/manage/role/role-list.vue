<template>
  <!-- 加载 -->
  <div v-loading="loading">
    <el-table
      :data="rolelist"
      border
      fit
      style="width: 100%"
    >
      <!-- 展开列 -->
      <el-table-column type="expand" />
      <el-table-column prop="roleName" label="角色名称" width="150" align="center" />
      <el-table-column prop="createdTime" label="创建时间" width="200" align="center" sortable="custom" />
      <el-table-column prop="updateTime" label="更新时间" width="200" align="center" sortable="custom" />
      <el-table-column prop="enable" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled === 1">启用</el-tag>
          <el-tag v-else type="info">弃用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit">修改</el-button>
          <el-button size="mini" type="info" icon="el-icon-view">查看</el-button>
          <el-button v-if="scope.row.isEnabled === 0" icon="el-icon-check" size="mini" type="success">启用</el-button>
          <el-button v-if="scope.row.isEnabled === 1" icon="el-icon-close" size="mini" type="warning">弃用</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import roleApi from '@/api/manage/role'
export default {
  data() {
    return {
      loading: true, // 控制是否显示加载效果
      rolelist: []
    }
  },
  // 初始化函数
  created() {
    this.list()
  },
  // 定义方法
  methods: {
    // 分页方法 调用封装的方法 getByPage()
    list() {
      roleApi.list().then(res => {
        this.rolelist = res.data
        this.loading = false
        console.log(res)
      })
    }
  }
}
</script>
