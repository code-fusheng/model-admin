<template>
  <div>
    <!--修改表单  -->
    <el-form ref="form" :model="user" label-width="80px" size="mini">
      <el-form-item label="名称">
        <el-input v-model="user.username" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="user.phone" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.mail" />
      </el-form-item>
      <el-form-item label="签名">
        <el-input v-model="user.signature" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :headers="headers"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
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
      headers: { // 上传文件的请求头
        Authorization: getToken()
      }
    }
  },
  watch: { // 监听器这里的function不能使用箭头函数替代
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
