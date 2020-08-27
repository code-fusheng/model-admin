<template>
  <div>
    <!--添加表单  -->
    <el-form ref="addForm" :model="menu" label-width="80px" size="mini">
      <el-form-item label="权限id">
        <el-input v-model="menu.menuId" />
      </el-form-item>
      <el-form-item label="权限名称">
        <el-input v-model="menu.name" />
      </el-form-item>
      <el-form-item label="权限标识">
        <el-input v-model="menu.permission" />
      </el-form-item>
      <el-form-item label="权限级别">
        <el-input v-model="menu.level" />
      </el-form-item>
      <el-form-item label="父级id">
        <el-input v-model="menu.pid" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import menuApi from '@/api/manage/menu'
export default {
  data() {
    return {
      menu: {}
    }
  },
  methods: {
    // 添加 确认
    /**
     * 1、父组件可以使用 props 把数据传给子组件。
     * 2、子组件可以使用 $emit 触发父组件的自定义事件
     */
    onSubmit() {
      menuApi.save(this.menu).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDialog')
        this.menu = {}
        this.$emit('getByPage')
      })
    },
    close() {
      this.$emit('closeAddDialog')
      this.menu = {}
    }
  }
}
</script>
