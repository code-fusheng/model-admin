<template>
  <div>
    <!--添加表单  -->
    <el-form ref="addForm" :model="modelPlus" label-width="80px" size="mini">
      <el-form-item label="模版名称">
        <el-input v-model="modelPlus.modelPlusName" />
      </el-form-item>
      <el-form-item label="模版图片">
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
import modelplusApi from '@/api/model/modelplus'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      modelPlus: {},
      imageUrl: null, // 上传图片回显
      uploadUrl: process.env.VUE_APP_UPLOAD_URL, // 上传图片路径
      headers: { // 上传文件的请求头
        Authorization: getToken()
      }
    }
  },
  methods: {
    /**
     * 1、父组件可以使用 props 把数据传给子组件。
     * 2、子组件可以使用 $emit 触发父组件的自定义事件
     */
    onSubmit() {
      modelplusApi.save(this.modelPlus).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDialog')
        this.model = {}
        this.$emit('getByPage')
      })
    },
    uploadSuccess(res, file) {
      this.$message.success(res.msg)
      this.imageUrl = res.data
      this.modelPlus.modelPlusImage = res.data
    },
    close() {
      this.$emit('closeAddDialog')
      this.model = {}
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height: 150px;
    display: block;
  }
</style>

