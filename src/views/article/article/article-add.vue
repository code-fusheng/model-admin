<template>
  <div class="write-article-container">
    <!--添加表单  -->
    <el-form ref="addForm" :model="article" label-width="40px" size="mini">
      <el-form-item label="标题" style="width: 50%">
        <el-input v-model="article.articleTitle" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="article.articleCategory" placeholder="分类" clearable filterable>
          <el-option v-for="category in categoryList" :key="category.categoryId" :label="category.categoryName" :value="category.categoryId" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面">
        <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="uploadSuccess" :headers="headers">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="article.articleDesc" type="textarea" />
      </el-form-item>
      <el-form-item label="内容">
        <tinymce v-model="article.articleContent" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import articleApi from '@/api/article/article'
// 导入富文本公共组件
import Tinymce from '@/components/Tinymce/index'
import { getToken } from '@/utils/auth'
export default {
  // 注册组件
  components: {
    Tinymce
  },
  data() {
    return {
      article: {},
      imageUrl: null, // 上传图片回显
      uploadUrl: process.env.VUE_APP_UPLOAD_URL, // 上传图片路径
      headers: {
        // 上传文件的请求头
        Authorization: getToken()
      },
      categoryList: this.$store.getters.categoryList
    }
  },
  methods: {
    // 添加 确认
    /**
     * 1、父组件可以使用 props 把数据传给子组件。
     * 2、子组件可以使用 $emit 触发父组件的自定义事件
     */
    onSubmit() {
      articleApi.save(this.article).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDialog')
        this.$emit('getByPage')
        this.article = {}
        this.imageUrl = null
        this.article.articleContent = null
      })
    },
    uploadSuccess(res, file) {
      this.$message.success(res.msg)
      this.imageUrl = res.data
      this.article.articleImage = res.data
    },
    close() {
      this.$emit('closeAddDialog')
      this.article = {}
      this.imageUrl = null
      this.article.articleContent = null
    }
  }
}
</script>

<style>
.write-article-container {
  /* padding: 20px; */
  width: 100%;
  min-height: 800px;
  /* border: 1px solid #9c9ea8; */
  background-color: white;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
