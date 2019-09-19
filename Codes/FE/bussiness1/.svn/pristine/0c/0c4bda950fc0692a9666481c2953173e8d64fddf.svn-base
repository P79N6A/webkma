<template>
  <div style="heigth:auto" class="library">
    <div class="header-box">
      <div class="classify">
        <p v-for="(item,index) in activeText" :key="index" :class="active==index?'activeColor':''"
          @click="activeClick(item,index)">{{item.name}}</p>
      </div>
      <div class="select-box">
        <p>共{{totalAll}}条，检索结果 <span>{{dataList.length}}</span> </p>
        <div class="searchbox">
          <input type="text" v-model="params.nameSearch" @keyup.13="getList" placeholder="请输入内容"
            placeholder-color="#b1bfcd" />
          <i class="el-icon-search" @click="getList"></i>
        </div>
      </div>
    </div>
    <div v-if="dataList">
      <div class="H5-content" v-if="active==0">
        <div class="list" v-for="(item,index) in dataList" :key="index" @click="clickState?radioClick(item,index):''">
          <div class="h5acitve" v-if="radioIndex==item.id">
            <img :src="imgAcitiveUrl" />
          </div>
          <div class="img-box">
            <img :src="item.cover?item.cover:defaultCover" alt=""></div>
          <div class="H5name">{{item.name}}</div>
        </div>
      </div>
      <div class="library-content" v-else>
        <div class="list" v-for="(item,index) in dataList" :key="index" @click="clickState?radioClick(item,index):''">
          <div :class="radioIndex==item.id?'iconfont icon-radio-checkded':'iconfont icon-radio'" id="radio-box"></div>
          <div class="imgbox">
            <img :src="item.cover?item.cover:defaultCover" alt="">
          </div>
          <div class="des">
            <p class="textdes">{{item.name}}</p>
            <p>{{item.operator}} {{item.operatorDate}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="nullData" v-if="dataList=='' && isLoding==true">暂无数据</div>
    <div class="nullData" v-else-if="dataList=='' && isLoding==false">加载中</div>
  </div>
</template>

<script>
import api from "api"
export default {
  data() {
    return {
      isLoding: false,
      imgAcitiveUrl: require('../assets/images/cash-recharge-icon.png'),
      defaultCover: require('../assets/images/cover-empty.jpg'),
      activeText: [
        {
          name: "H5",
          lable: 1
        },
        {
          name: "文章",
          lable: 2
        }
      ],
      dataList: [],
      active: this.$route.query.m_type == 3 ? 1 : 0,
      totalAll: '',
      clickState: this.$route.query.m_type ? false : true,
      radioIndex: -1,
      params: {
        businessId: localStorage.getItem('businessId'),
        nameSearch: '',
        pageIndex: 1,
        pageSize: 1000,
        manuscriptType: this.$route.query.m_type == 3 ? 3 : 1,// 红包裂变修改时需要获取当前这个活动是还 1--H5/3--文章 
        manuscriptStatus: this.$route.query.indexType == 'redPacket' ? "1,2" : 2,//红包裂变需要获取进行中和未开始的 //1未开始,2进行中,3已结束,4暂停中
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    activeClick(item, index) {
      this.active = index
      this.isLoding = false;
      this.params.manuscriptType = index == 1 ? 3 : 1
      this.dataList = []
      this.params.nameSearch = ''
      this.getList()
    },
    radioClick(item, index) {
      if (this.$route.query.indexType == 'redPacket') {
        if (item.is_effective == true) {
          this.radioIndex = item.id;
          this.$emit('getmanuscript', item)
        } else {
          this.$message.error("该活动已创建红包裂变");
        }
      } else {
        this.radioIndex = item.id;
        this.$emit('getmanuscript', item)
      }
    },
    upKey(ev) {
      console.log(ev)
    },
    getList() {
      let self = this
      api.request("getManuscriptListOfRelease", self.params, result => {
        this.isLoding = true;
        if (result.status == 0) {
          let arrList = result.data.list
          if (self.params.nameSearch == '') {
            this.totalAll = result.data.total
          }
          arrList.forEach(item => { 
            let time = new Date(item.operatorDate);
            var times = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
            item.operatorDate = times
          });
          self.dataList = result.data.list;
          for (var i = 0; i < self.dataList.length; i++) {
            if (self.dataList[i].id == self.$route.query.m_id) {
              this.radioIndex = self.$route.query.m_id
            }
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.library {
  border: 1px solid #e3e6eb;
}
#radio-box {
  line-height: 64px;
  margin-right: 17px;
  cursor: pointer;
}
.library-content .icon-checkbox {
  color: #e3e6eb;
}
.nullData {
  text-align: center;
  font-size: 16px;
  color: #3c4a55;
  min-height: 400px;
  line-height: 400px;
}
.library-content .icon-checkbox-checked {
  color: #7fdce7;
}
::-webkit-scrollbar {
  width: 7px; /*对垂直流动条有效*/
  height: 7px; /*对水平流动条有效*/
}
/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  background-color: #ffffff;
  border-radius: 3px;
  border: 1px solid #f1f3fc;
}
/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #9eabb8;
}
.H5-content {
  width: 100%;
  margin: 0 auto;
  max-height: 400px;
  overflow-x: hidden;
  padding: 30px 40px 0px 40px;
}
.H5-content .list .img-box {
  width: 100%;
  height: 167px;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.H5-content .list .img-box img {
  width: 100%;
  object-fit: scale-down;
}
.H5-content .list .H5name {
  height: 33px;
  line-height: 33px;
  width: 95%;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.H5-content .list {
  width: 107px;
  float: left;
  height: 200px;
  margin-right: 1.66%;
  overflow: hidden;
  border: 1px solid#dedede;
  margin-bottom: 25px;
  cursor: pointer;
  position: relative;
}
.H5-content .list :nth-of-type(6n) {
  margin-right: 0;
}
.h5acitve {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #24d0c6;
}
.h5acitve img {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 171px;
  left: 77px;
  right: 2px;
  bottom: 2px;
}
.library-content {
  width: calc(100% - 20px);
  margin-top: 10px;
  max-height: 400px;
  overflow-x: hidden;
  margin-left: 20px;
}
.library-content .list {
  height: 65px;
  margin-bottom: 35px;
  display: flex;
}
.des {
  width: calc(100% - 230px);
  padding-bottom: 20px;
}
.library-content .list .des p {
  height: 20px;
  line-height: 20px;
  margin-left: 20px;
}
.textdes {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 95%;
}
.library-content .list .des p:nth-of-type(1) {
  font-size: 14px;
  color: rgba(60, 74, 85, 1);
  margin-top: 7px;
}
.library-content .list .des p:nth-of-type(2) {
  font-size: 12px;
  color: rgba(172, 172, 172, 1);
  margin-top: 17px;
}
.library-content .list .imgbox {
  width: 151px;
  height: 64px;
  overflow: hidden;
}
.library-content .list .imgbox img {
  width: 100%;
  object-fit: scale-down;
}
.activeColor {
  background: rgba(255, 255, 255, 1);
  color: #3c4a55;
  border-top: 2px solid #00bad0;
}
.header-box {
  height: 40px;
  background: #f1f3fc;
  display: flex;
  line-height: 40px;
  justify-content: space-between;
}
.header-box .select-box {
  display: flex;
}
.header-box .select-box >>> .el-input__inner {
  border-radius: 15px;
}
.header-box .select-box p {
  margin-right: 6px;
  color: #b1bfcd;
  border-top: 1px solid #f1f3fc;
}
.header-box .select-box p span {
  margin-right: 6px;
  color: #f68411;
}
.searchbox {
  background: #ffffff;
  width: 214px;
  border-radius: 15px;
  height: 30px;
  margin-top: 5px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #e3e6eb;
}
.searchbox input {
  width: 190px;
  height: 28px;
  border-radius: 15px;
  padding: 0px 10px;
  line-height: 28px;
}
.header-box .classify {
  display: flex;
  padding-left: 20px;
}
.classify > p {
  cursor: pointer;
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 14px;
  color: rgba(60, 74, 85, 1);
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #888888;
  font-size: 12px;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #888888;
  font-size: 12px;
}

:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #888888;
  font-size: 12px;
}
.el-icon-search {
  cursor: pointer;
}
.icon-radio {
  color: #e3e6eb !important;
}
.icon-radio-checkded {
  color: #24d0c6 !important;
}
</style>
