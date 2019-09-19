<template>
  <div class="custom-info-container">
    <div class="custom-row" v-for="(item, index) in cusInfoList" :key="index">
      <span class="custom-label">{{ item.label }}</span>
      <span class="custom-value">{{ item.value }}</span>
    </div>
  </div>
</template>

<script>
import api from "api";

export default {
  name: 'customer-info',
  props: {
    id: {
      type: [Number, String],
      default: 12
    },
  },
  data() {
    return {
      cusInfoList: [
        {
          key: 'name',
          label: '姓名:',
          value: ''
        },
        {
          key: 'nickname',
          label: '昵称:',
          value: ''
        },
        {
          key: 'phone',
          label: '手机:',
          value: ''
        },
        {
          key: 'transaction_amount',
          label: '成交:',
          value: 0
        },
        {
          key: 'sex',
          label: '性别:',
          value: ''
        },
        {
          key: 'company',
          label: '公司:',
          value: ''
        },
        {
          key: 'job',
          label: '职业:',
          value: ''
        },
        {
          key: 'birthday',
          label: '生日:',
          value: ''
        },
        {
          key: 'from_name',
          label: '来源:',
          value: ''
        },
        {
          key: 'level',
          label: '级别:',
          value: ''
        },
        {
          key: 'status',
          label: '状态:',
          value: ''
        },
        {
          key: 'b',
          label: '地区:',
          value: ''
        },
        {
          key: 'area',
          label: '地址:',
          value: ''
        }
      ],
      formatObj: {
        sex: ['未知', '男', '女'],
        //   级别 1--普通、2--一般、3--重要
        level: ['无', '普通客户', '一般客户', '重要客户'],
        //  状态 1--微信潜客、2--初步沟通、3--见面拜访、4--确定意向、5--正式报价、6--签约成功（默认为微信潜客）
        status: ['无', '微信潜客', '初步沟通', '见面拜访', '确定意向', '正式报价', '签约成功']
      }
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      api.request('getComsuterInfo', {
        id: Number(this.id)
      }, result => {
        if (result.status === 0) {
          this.cusInfoList.forEach(ele => {
            if (!!result.data[ele.key] || result.data[ele.key] === 0 ) {
              if (ele.key === 'sex' || ele.key === 'level' || ele.key === 'status') {
                ele.value = this.formatObj[ele.key][result.data[ele.key]]
              } else {
                ele.value = result.data[ele.key]
              }
            }
            if(ele.key == 'b'){
              ele.value = result.data.province + (!!result.data.city ? '-' + result.data.city : '') + (!!result.data.region ? '-' + result.data.region : '');
            }
          })
        } else {
          this.$message({
            type: 'warining',
            message: result.message
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.custom-info-container {
  width: 100%;
}
.custom-row {
  width: 100%;
  font-size: 12px;
  margin-bottom: 16px;
}
.custom-label {
  color: #b1bfcd;
  margin-right: 5px;
}
.custom-label:last-child {
  margin-bottom: 0;
}
.custom-value {
  color: #3c4a55;
}
</style>
