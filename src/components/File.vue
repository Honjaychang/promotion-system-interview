<template>
  <div>
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="Excel格式展示" name="1">
          <div>
            为了更好的展示Excel中客户信息，请严格按照下图存放数据（下方已框处！<br />
            您也可以在此处下载模版使用：<a
              href="./static/Excel模板.xlsx"
              download="Excel模板.xlsx"
              >下载模板</a
            >
          </div>
          <el-image
            style="width: 50%; height: 50%"
            :src="url"
            :fit="fit"
          ></el-image>
        </el-collapse-item>
      </el-collapse>
      <el-upload
        drag
        :limit="limitNum"
        :auto-upload="false"
        accept=".xlsx"
        :action="UploadUrl()"
        :before-upload="beforeUploadFile"
        :on-change="fileChange"
        :on-exceed="exceedFile"
        :on-success="handleSuccess"
        :on-error="handleError"
        :file-list="fileList"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传xlsx文件，且不超过10M
        </div>
      </el-upload>
      <br />
      <el-button size="small" type="primary" @click="uploadFile"
        >立即上传</el-button
      >
      <el-button size="small">取消</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['1'],
      fit: 'contain',
      url: './static/demo.jpg',
      // url: 'https://cdn.jsdelivr.net/gh/honjaychang/icopicture/misc/demo.jpg',
      limitNum: 1, // 上传excell时，同时允许上传的最大数
      fileList: [] // excel文件列表
    }
  },
  methods: {
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.warning(
        `只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length +
          fileList.length} 个`
      )
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      // console.log(file.raw)
      this.fileList.push(file.raw)
      // console.log(this.fileList)
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      // console.log('before upload')
      // console.log(file)
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const size = file.size / 1024 / 1024
      if (extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx的文件')
      }
      if (size > 10) {
        this.$message.warning('文件大小不得超过10M')
      }
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success('文件上传成功')
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error('文件上传失败')
    },
    UploadUrl: function() {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return ''
    },
    async uploadFile() {
      if (this.fileList.length === 0) {
        return this.$message.warning('请上传文件')
      }
      const form = new FormData()
      form.append('ExcelFile', this.fileList[0])
      // console.log(form)
      const { data: res } = await this.$http.post('/excel/add', form)
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
      // form.delete('ExcelFile')

      // this.$http({
      //   method: 'post',
      //   url: '/excel/add',
      //   headers: {
      //     'Content-type': 'multipart/form-data'
      //   },
      //   data: form
      // }).then(
      //   res => {
      //     // console.log(res)
      //     this.$message.success('success')
      //   },
      //   err => {
      //     this.$message.error('error')
      //   }
      // )
    }
  }
}
</script>

<style scoped>
.el-collapse {
  margin-bottom: 10px;
}
</style>
