<template>
  <div>
    <!--修改表单  -->
    <el-form ref="form" :model="modelPlus" label-width="80px" size="mini">
      <el-form-item label="模版名称">
        <el-input v-model="modelPlus.modelPlusName" />
      </el-form-item>
      <el-form-item label="模版图片">
        <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="uploadSuccess" :headers="headers">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
import modelplusApi from '@/api/model/modelplus'
import { getToken } from '@/utils/auth'
export default {
  // 父组件将数据传递给子组件
  props: {
    modelPlus: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      imageUrl: this.modelPlus.modelPlusImage, // 上传图片回显
      uploadUrl: process.env.VUE_APP_UPLOAD_URL, // 上传图片路径
      headers: {
        // 上传文件的请求头
        Authorization: getToken()
      }
    }
  },
  watch: {
    // 监听器这里的function不能使用箭头函数替代
    'modelPlus.modelPlusImage': function(newVal, oldVal) {
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
      modelplusApi.update(this.modelPlus).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeUpdateDialog')
        this.$emit('getByPage')
      })
      this.imageUrl = null
    },
    uploadSuccess(res, file) {
      this.$message.success(res.msg)
      this.imageUrl = res.data
      this.modelPlus.modelPlusImage = res.data
    },
    close() {
      this.$emit('closeUpdateDialog')
    }
  }
}
</script>
