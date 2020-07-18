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
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 栅格组件 一行24个 -->
          <el-row v-for="(item1, i1) in scope.row.menuList" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']">
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.name }}</el-tag>
              <i class="el-icon-caret-right" />
            </el-col>
            <!-- 渲染二,三级级权限 -->
            <el-col :span="19">
              <!-- 通过for循环嵌套渲染二级权限 -->
              <el-row v-for="(item2, i2) in item1.childList" :key="item2.id" :class="[i2 === 0 ? '':'bdtop', 'vcenter']">
                <el-col :span="6">
                  <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.name }}</el-tag>
                  <i class="el-icon-caret-right" />
                </el-col>
                <el-col :span="18">
                  <el-tag v-for="(item3) in item2.childList" :key="item3.id" type="warning" closable @close="removeRightById(scope.row, item3.id)">
                    {{ item3.name }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" min-width="100" label="角色名称" align="center" />
      <el-table-column prop="createdTime" label="创建时间" min-width="220" align="center" sortable="custom" />
      <el-table-column prop="updateTime" label="更新时间" min-width="220" align="center" sortable="custom" />
      <el-table-column prop="enable" label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled === 1">启用</el-tag>
          <el-tag v-else type="info">弃用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="500" align="center">
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
    },
    removeRightById() {}
  }
}
</script>

<style scoped>

    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eeeeee ;
    }

    .bdbottom{
        border-bottom: 1px solid #eeeeee;
    }

    .vcenter{
        display: flex;
        align-items: center;
    }

</style>
