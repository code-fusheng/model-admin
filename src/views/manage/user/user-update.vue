<template>
  <div>
    <!--修改表单  -->
    <el-form ref="form" :model="user" label-width="80px" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="user.username" placeholder="请输入用户名称（账号）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="user.password" type="password" placeholder="请输入用户密码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户性别" prop="sex">
            <el-radio-group v-model="user.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
              <el-radio :label="0">私密</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户状态" prop="isEnabled">
            <el-radio-group v-model="user.isEnabled">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">弃用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="realname">
            <el-input v-model="user.realname" placeholder="请输入真实姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="user.phone" placeholder="请输入手机号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="user.mail" placeholder="请输入邮箱地址" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址" prop="address">
            <el-input v-model="user.address" type="textarea" placeholder="请输入地址" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户签名" prop="signature">
            <el-input v-model="user.signature" type="textarea" placeholder="请输入签名" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户描述" prop="description">
            <el-input v-model="user.description" type="textarea" placeholder="请输入描述" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="uploadSuccess" :headers="headers">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="7">
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
import userApi from '@/api/manage/user'
import { getToken } from '@/utils/auth'
export default {
  // 父组件将数据传递给子组件
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      imageUrl: this.user.header, // 上传图片回显
      uploadUrl: process.env.VUE_APP_UPLOAD_URL, // 上传图片路径
      headers: {
        // 上传文件的请求头
        Authorization: getToken()
      },
      // 表单校验
      rules: {
        username: [{ required: true, message: '用户名称不能为空', tirgger: 'blur' }],
        password: [{ required: true, message: '用户密码不能为空', tirgger: 'blur' }],
        phone: [{ required: true, message: '手机号码不能为空', tirgger: 'blur' }],
        sex: [{ required: true, message: '请选择用户性别', trigger: 'change' }],
        isEnabled: [{ required: true, message: '请选择用户状态', trigger: 'change' }]
      }
    }
  },
  watch: {
    // 监听器这里的function不能使用箭头函数替代
    'user.header': function(newVal, oldVal) {
      this.imageUrl = newVal
    }
  },
  methods: {
    // 修改
    /**
     * 1、父组件可以使用 props 把数据传给子组件。
     * 2、子组件可以使用 $emit 触发父组件的自定义事件
     */
    onSubmit() {
      userApi.update(this.user).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeUpdateDialog')
        this.$emit('getByPage')
      })
      this.imageUrl = null
    },
    uploadSuccess(res, file) {
      this.$message.success(res.msg)
      this.imageUrl = res.data
      this.user.header = res.data
    },
    close() {
      this.$emit('closeUpdateDialog')
    }
  }
}
</script>
