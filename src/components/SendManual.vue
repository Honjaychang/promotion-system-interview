<template>
  <div>
    <el-card>
      <!-- 手动发送 -->
      <el-row>
        <el-col :span="12">
          <el-button type="primary" size="mini" @click="addDialogVisible = true"
            >添加数据</el-button
          >
          <!-- 数据展示 -->
          <el-table :data="usersInfo" style="width: 100%" border stripe>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="Username" label="用户名"> </el-table-column>
            <el-table-column prop="PhoneNum" label="手机号"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="mini" @click="sendManual()"
            >手动发送</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加数据的对话框 -->
    <el-dialog
      title="添加收信人信息"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <el-form
        :inline="true"
        ref="manualFormRef"
        :model="manualForm"
        :rules="manualFormRules"
      >
        <el-form-item label="用户名" prop="Username">
          <el-input v-model="manualForm.Username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="PhoneNum">
          <el-input v-model="manualForm.PhoneNum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加数据的对话框 -->
    <el-dialog
      title="修改收信人信息"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form
        :inline="true"
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
      >
        <el-form-item label="用户名" prop="Username">
          <el-input v-model="editForm.Username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="PhoneNum">
          <el-input v-model="editForm.PhoneNum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditUserInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      manualForm: {
        PhoneNum: '',
        Username: ''
      },
      addDialogVisible: false,
      usersInfo: [],
      manualFormRules: {
        PhoneNum: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        Username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      editForm: {
        PhoneNum: '',
        Username: ''
      },
      editDialogVisible: false,
      editFormRules: {
        PhoneNum: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        Username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      index: ''
    }
  },

  methods: {
    async sendManual() {
      // const res = await this.$http.post(
      //   '/message/send-manual',
      //   this.usersInfo[0]
      // )
      const res = await this.$http.post('/message/send-manual-arr', {
        ReceiverArr: this.usersInfo
      })
      console.log(res)
      // console.log(this.manualForm)
      // console.log(this.usersInfo)
      if (res.data.code !== 200) {
        return this.$message.error('短信发送失败')
      } else {
        return this.$message.success('短信发送成功')
      }
    },
    saveUserInfo() {
      this.usersInfo.push(this.manualForm)
      // console.log(this.usersInfo)
      this.addDialogVisible = false
      this.$message.success('添加用户信息成功')
    },
    addDialogClose() {
      this.manualForm = {}
      this.addDialogVisible = false
    },
    handleEdit(id, row) {
      this.editDialogVisible = true
      this.editForm = row
      this.index = id
    },
    editDialogClose() {
      this.editForm = {}
      this.editDialogVisible = false
    },
    saveEditUserInfo() {
      this.usersInfo[this.index] = this.editForm
      this.editDialogVisible = false
      this.$message.success('更新用户信息成功')
    },
    async handleDelete(index) {
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
      this.usersInfo.splice(index, 1)
      this.$message.success('删除用户成功')
    }
  }
}
</script>

<style lang="less" scoped>
// .el-button {
//   margin: 10px 0 10px 0;
// }

.el-table {
  margin: 10px 0 10px 0;
}
</style>
