<template>
  <div>
    <!-- 更新角色  -->
    <el-form ref="form" :model="role" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="role.roleName" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色备注">
            <el-input v-model="role.remark" placeholder="请输入角色备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色状态" prop="isEnabled">
            <el-radio-group v-model="role.isEnabled">
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
import roleApi from '@/api/manage/role'
export default {
  // 父组件将数据传递给子组件
  props: {
    role: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', tirgger: 'blur' }
        ],
        isEnabled: [
          { required: true, message: '请选择角色状态', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      roleApi.update(this.role).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeUpdateDialog')
        this.$emit('list')
        this.resetForm('form')
      })
    },
    close() {
      this.$emit('closeUpdateDialog')
      this.resetForm('form')
    }
  }
}
</script>
