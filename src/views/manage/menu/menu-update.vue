<template>
  <div>
    <!--修改表单  -->
    <el-form ref="form" :model="menu" label-width="80px" size="mini">
      <el-form-item label="权限id">
        <el-input v-model="menu.menuId" disabled="" />
      </el-form-item>
      <el-form-item label="权限名称">
        <el-input v-model="menu.name" />
      </el-form-item>
      <el-form-item label="权限标识">
        <el-input v-model="menu.permission" />
      </el-form-item>
      <el-form-item label="权限级别">
        <el-select v-model="menu.level" placeholder="level" clearable filterable>
          <el-option label="一级" :value="1" />
          <el-option label="二级" :value="2" />
          <el-option label="三级" :value="3" />
        </el-select>
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
  // 父组件将数据传递给子组件
  props: {
    menu: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // 修改
    /**
     * 1、父组件可以使用 props 把数据传给子组件。
     * 2、子组件可以使用 $emit 触发父组件的自定义事件
     */
    onSubmit() {
      menuApi.update(this.menu).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeUpdateDialog')
        this.$emit('getByPage')
      })
    },
    close() {
      this.$emit('closeUpdateDialog')
    }
  }
}
</script>
