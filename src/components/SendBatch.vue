<template>
  <div>
    <el-card>
      <el-button type="primary" size="mini" @click="addReceiver"
        >添加用户</el-button
      >
      <el-button type="danger" size="mini" @click="deleteAllReceiver"
        >一键清空所有用户</el-button
      >
      <el-row>
        <el-col>
          <!-- 数据展示 -->
          <el-table
            :data="
              receivers === null
                ? receivers
                : receivers.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                  )
            "
            style="width: 100%"
            border
            stripe
          >
            <el-table-column label="序号" width="80px">
              <template slot-scope="scope">
                <span
                  >{{ scope.$index + (currentPage - 1) * pageSize + 1 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="phone_num" label="手机号"> </el-table-column>
            <el-table-column prop="company" label="公司"> </el-table-column>
            <el-table-column prop="last_send" label="短信上次发送时间">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.cid)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页功能 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="receivers === null ? 0 : receivers.length"
          >
          </el-pagination>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="批量发送" name="batch">
              <div>
                当前账户短信余额：<span style="color:#569ef8">{{
                  balance
                }}</span>
                条<br />
                请输入天数，避免在这段时间内重复发送
                <el-input
                  style="width:5%;margin:0 5px 0 5px"
                  size="mini"
                  v-model="form.AvoidTime"
                ></el-input>
                <el-button size="mini" type="primary" @click="sendBatch()"
                  >批量发送</el-button
                >
              </div>
            </el-collapse-item>
            <el-collapse-item title="单个用户测试" name="test">
              <div>
                请输入要测试的手机号，避免给您造成不必要的损失
                <el-input
                  style="width:8%;margin:0 5px 0 5px"
                  size="mini"
                  v-model="sinUsersInfo.phone_num"
                ></el-input>
                <el-button type="primary" size="mini" @click="sendManual()"
                  >单个测试发送</el-button
                >
              </div>
            </el-collapse-item>
            <el-collapse-item title="短信模版效果展示" name="display">
              <el-input
                v-model="disMessage"
                type="textarea"
                :rows="3"
              ></el-input>
            </el-collapse-item>
            <el-collapse-item title="短信模版可修改的内容" name="edit">
              <el-input
                v-model="postMessage.content"
                type="textarea"
              ></el-input>
              <div style="margin-top:10px">
                <span style="color:#e57470"
                  >注意事项：更新短信模板后需要等待一段时间，短信平台将对内容进行审核，之后您将可以正常发送短信</span
                ><br />
                当前短信模版审核状态：
                <span v-if="status === '2'" style="color:#67C23A"
                  >审核通过</span
                >
                <span v-else style="color:#e57470">正在审核</span>
              </div>
              <el-button
                class="special"
                type="primary"
                size="mini"
                @click="updateMessage"
                >更新短信模版</el-button
              >
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加数据的对话框 -->
    <el-dialog
      title="添加收信人信息"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClose"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone_num">
          <el-input v-model="addForm.phone_num"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="addForm.company"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改数据的对话框 -->
    <el-dialog
      title="修改收信人信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone_num">
          <el-input v-model="editForm.phone_num"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="editForm.company"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      receivers: [],
      // rLength: '',
      form: {
        AvoidTime: '15'
      },
      sinUsersInfo: {
        phone_num: '',
        username: '老板'
      },
      addDialogVisible: false,
      addForm: { cid: '', username: '', phone_num: '', company: '' },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        phone_num: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        cid: '',
        username: '',
        phone_num: '',
        company: ''
      },
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        phone_num: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ]
      },
      // 短信展示
      disMessage: '',
      // message: '',
      postMessage: {
        content: ''
      },
      deleteId: {
        cid: ''
      },
      activeNames: ['batch', 'test', 'display', 'edit'],
      // 分页
      currentPage: 1,
      pageSize: 10,
      balance: 0,
      status: 0
    }
  },
  // mounted() {
  //   this.getReceiverList()
  // },
  created() {
    this.getDisMessage()
    this.getMessage()
    this.getBalance()
    this.getTemStatus()
    this.getReceiverList()
  },
  methods: {
    // 获取客户信息
    async getReceiverList() {
      const { data: res } = await this.$http.get('/receiver/get')
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.receivers = res.data
      // console.log(this.receivers)
    },
    async getBalance() {
      const { data: res } = await this.$http.get('/message/balance/get')
      // if (res.code !== 200) {
      //   return this.$message.error(res.message)
      // }
      // this.balance = res.data.balance
      console.log(res)
    },
    async getTemStatus() {
      const { data: res } = await this.$http.get('/template/status/get')
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.status = res.data.status
      // console.log(res)
      // console.log('get', this.status)
    },
    async getDisMessage() {
      const { data: res } = await this.$http.get('/template/example/get')
      this.disMessage = res.data
      // console.log(res)
    },
    async getMessage() {
      const { data: res } = await this.$http.get('/template/get')
      // this.message = res.data
      this.postMessage.content = res.data
      // console.log(res)
    },
    async updateMessage() {
      const { data: res } = await this.$http.post(
        'template/update',
        this.postMessage
      )
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
      this.getDisMessage()
      this.getMessage()
      this.getTemStatus()
      setTimeout(() => {
        this.getTemStatus()
      }, 10000)

      // console.log(res)
    },
    // 添加用户功能
    addReceiver() {
      this.addDialogVisible = true
    },
    addDialogClose() {
      this.addForm = {}
      this.addDialogVisible = false
    },
    async saveAddUserInfo() {
      const { data: res } = await this.$http.post('/receiver/add', this.addForm)
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success('添加用户成功')
      this.addDialogVisible = false
      this.getReceiverList()
    },
    // 单个
    async sendManual() {
      const { data: res } = await this.$http.post(
        '/message/send-manual',
        this.sinUsersInfo
      )
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success('短信发送成功')
      this.getBalance()
    },
    // 批量发送代码
    async sendBatch() {
      if (this.form.AvoidTime < 0) {
        this.$message.warning('请输入合理的天数')
      } else {
        const { data: res } = await this.$http.post('/message/send', this.form)
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.$message.success('批量发送成功')
        this.getBalance()
      }
    },
    // 编辑用户功能
    handleEdit(row) {
      this.editDialogVisible = true
      this.editForm = row
    },
    editDialogClose() {
      this.editForm = {}
      this.editDialogVisible = false
    },
    async saveEditUserInfo() {
      const { data: res } = await this.$http.post(
        '/receiver/update',
        this.editForm
      )
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success('修改用户信息成功')
      this.editDialogVisible = false
      // console.log(res)
    },
    // 删除用户
    async handleDelete(cid) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.deleteId.cid = cid
      const { data: res } = await this.$http.post(
        '/receiver/delete',
        this.deleteId
      )
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success('删除用户成功')
      this.getReceiverList()
    },
    // 分页功能
    handleSizeChange(newSize) {
      this.pageSize = newSize
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },
    async deleteAllReceiver() {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('/receiver/delete-all')
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.getReceiverList()
      this.$message.success('所有用户已被成功删除')
    }
  },
  watch: {
    status(val) {
      this.status = val
      // console.log('watch', val)
      // this.getTemStatus()
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 20px 0 20px 0;
}
.el-collapse,
.el-pagination {
  margin-bottom: 20px;
}
.special {
  margin-top: 20px;
}
</style>
