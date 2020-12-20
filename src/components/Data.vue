<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form ref="form" :model="form" size="mini">
            <el-form-item label="请输入要查询的月份">
              <el-col :span="6">
                <el-input v-model="form.Month"></el-input>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" @click="getMonthDetails()"
                  >查询</el-button
                ></el-col
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  data() {
    return {
      form: {
        Month: ''
      },
      nums: []
    }
  },
  methods: {
    async getMonthDetails() {
      if (this.form.Month < 1 || this.form.Month > 12) {
        this.$message.error('请输入合理的月份')
      } else {
        const { data: res } = await this.$http.post('/message/get', this.form)
        if (res.code !== 200) {
          this.$message.console.error(res.message)
        }
        this.nums = res.data
        // console.log(this.nums)
        // console.log(res.data.data)
      }
    },
    async getCurrentMonth() {
      const data = new Date()
      // console.log(data.getMonth() + 1)
      this.form.Month = data.getMonth() + 1
    },
    draw() {
      var myChart = echarts.init(document.getElementById('main'))

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '月短信发送数量'
        },
        tooltip: {},
        legend: {
          data: ['数量']
        },
        xAxis: {
          data: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31
          ]
        },
        yAxis: {},
        series: [
          {
            name: '数量',
            type: 'line',
            data: this.nums
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  },
  watch: {
    nums(val) {
      this.draw()
    }
  },
  created() {
    this.getCurrentMonth()
    this.getMonthDetails()
  },
  // 在dom渲染结束后挂载
  mounted() {
    this.draw()
  }
}
</script>

<style lang="less" scoped></style>
