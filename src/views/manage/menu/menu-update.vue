<template>
  <div>
    <!--修改表单  -->
    <el-form ref="form" :model="menu" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="上级菜单" prop="name">
            <treeselect
              v-model="menu.pid"
              :options="menuOptions"
              :show-count="true"
              :normalizer="normalizer"
              placeholder="请选择上级菜单"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="父级权限" prop="pid">
            <el-input v-model="menu.pid" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限Id" prop="menuId">
            <el-input v-model="menu.menuId" disabled="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="menu.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限级别" prop="level">
            <el-select v-model="menu.level" placeholder="level">
              <el-option label="一级" :value="1" />
              <el-option label="二级" :value="2" />
              <el-option label="三级" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="menu.permission" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限状态" prop="isEnabled">
            <el-radio-group v-model="menu.isEnabled">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">弃用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="5">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import menuApi from '@/api/manage/menu'
export default {
  components: {
    Treeselect
  },
  // 父组件将数据传递给子组件
  props: {
    menu: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 菜单树的数据
      menuOptions: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', tirgger: 'blur' }
        ],
        permission: [
          { required: true, message: '权限标识不能为空', tirgger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择权限级别' }
        ],
        isEnabled: [
          { required: true, message: '请选择权限状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getMenuTree()
  },
  methods: {
    // 修改
    /**
     * 1、父组件可以使用 props 把数据传给子组件。
     * 2、子组件可以使用 $emit 触发父组件的自定义事件
     */
    // 查询菜单下拉树的数据
    getMenuTree() {
      menuApi.getMenuTree().then(res => {
        this.menuOptions = []
        const menu = { menuId: 0, name: '主类目', children: [] }
        menu.children = this.handleTree(res.data, 'menuId')
        this.menuOptions.push(menu)
      })
    },
    // 自定义键名
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.menuId,
        label: node.name,
        children: node.children
      }
    },
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
