<template>
  <div>
    <!--修改表单  -->
    <el-form ref="form" :model="category" label-width="80px" size="mini">
      <el-form-item label="名称" style="width: 50%">
        <el-input v-model="category.categoryName" />
      </el-form-item>
      <el-form-item label="级别">
        <el-select v-model="category.level" placeholder="一/二/三级" clearable filterable>
          <el-option label="一级" :value="1" />
          <el-option label="二级" :value="2" />
          <el-option label="三级" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="父级">
        <el-select v-model="category.pid" placeholder="父级分类" clearable filterable>
          <el-option
            :key="category.pid"
            :value="category.pid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面">
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
import categoryApi from '@/api/article/category'
import { getToken } from '@/utils/auth'
export default {
  // 父组件将数据传递给子组件
  props: {
    category: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      imageUrl: this.category.categoryImage, // 上传图片回显
      uploadUrl: process.env.VUE_APP_UPLOAD_URL, // 上传图片路径
      headers: { // 上传文件的请求头
        Authorization: getToken()
      }
    }
  },
  watch: { // 监听器这里的function不能使用箭头函数替代
    'category.categoryImage': function(newVal, oldVal) {
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
      categoryApi.update(this.category).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeUpdateDialog')
        this.$emit('getByPage').then(
          this.imageUrl = null
        )
      })
    },
    uploadSuccess(res, file) {
      this.$message.success(res.msg)
      this.imageUrl = res.data
      this.category.categoryImage = res.data
    },
    close() {
      this.$emit('closeUpdateDialog')
    }
  }
}
</script>
