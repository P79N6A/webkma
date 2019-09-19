<template>
  <div class="steptwo-box">
    <el-form ref="form" :model="formData" label-width="100px" size="mini">
      <el-form-item label="推送用户：" class="activity-name">
        <div class="steptwo-cont">
          <div class="steptwo-top">已选中客户 <span>{{formData.labels.length}}</span></div>
          <div class="steplables" v-if="formData.labels.length>0">
            <el-tag class="tags" type="info" closable :disable-transitions="false" @close="handleClose(item)"
              v-for="(item,index) in formData.labels" :key="index">{{item.nickname}}</el-tag>
          </div>
          <div class="conditions">
            <el-select class="select_item" placeholder="全部标签" v-model="parmas.label_id"  v-el-select-loadmore="loadmore">
              <el-option v-for="item in labelsOptions" :key="item.labelId" :label="item.labelName" :value="item.labelId">
              </el-option>
            </el-select>
            <el-select class="select_item" v-model="parmas.from_type" placeholder="全部来源">
              <el-option v-for="item in from_typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-select class="select_item" style="border-radius: 0px" placeholder="全部状态" v-model="parmas.status">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-select class="select_item" style="border-radius: 0px" placeholder="全部级别"  v-model="parmas.level">
              <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div class="search_item">
              <input class="search_input" style="border-radius: 0px" v-model="parmas.keyword" placeholder="请输入关键词搜索" placeholder-color="#cccccc" />
              <el-button class="btn" @click="search()">查询</el-button>
            </div>
          </div>
          <div class="table_box">
            <el-table ref="tablemultipleTable" @selection-change="handleSelectionChange" :data="dataList" style="min-width: 1000px;margin-top:15px;" header-align="center"
              :header-cell-style="getRowClass"   >
              <el-table-column type="selection" width="32"/>
              <el-table-column prop="names" label="昵称/身份" show-overflow-tooltip align="center" min-width="160">
                <template slot-scope="scope">
                  <div class="flex_box">
                    <img :src='scope.row.face?scope.row.face:imgAcitiveUrl' />
                    <div class="tableInfo">
                      <div class="ellipsis">{{scope.row.nickname}}</div>
                      <div>{{scope.row.name==null?'暂无':(scope.row.name + '/' + scope.row.job)}}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="label" label="标签" align="center" min-width="100">
                <template slot-scope="scope">
                  <div class="label_color" v-for="(item,index) in scope.row.label" :key="index">{{item}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="transaction_amount" label="成交金额" sortable align="center" min-width="100">
                <template slot-scope="scope">
                  <div style="color:#FA766B">￥{{scope.row.transaction_amount==null?'0':scope.row.transaction_amount}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="手机" align="center" min-width="100">
              </el-table-column>
              <el-table-column label="客户状态" align="center" min-width="160">
                <template slot-scope="scope">
                  {{scope.row.from_name}}/{{scope.row.statusValue}}/{{scope.row.levelValue}}
                </template>
              </el-table-column>
            </el-table>
            <pagination v-if="dataList.length>0" class="pull-right" :paginationOpt="employeePagination"
              @switchPage="employeePagesFn">
            </pagination>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from "api";
import pagination from "components/ui-pagination";
export default {
  components: {
    pagination
  },
  props: ["formData"],
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(".el-select-dropdown .el-select-dropdown__wrap");
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    }
  },
  data() {
    return {
      imgAcitiveUrl:require('../../assets/images/default-headImg.png'),
      isState:false,
      dataList: [],
      parmas:{
        pageIndex:1,
        pageSize:10,
        keyword:"",
        status:'',
        level:'',
        from_type:'',
        label_id:"",
        have_from_id:1
      },
      labelParmas:{
        pageIndex:1,
        pageSize:10,
        orderBy:'desc',
        search:''
      },
      employeePagination: {
        //人员分派分页
        pageIndex: 1,
        pageSize:10,
        totalCount: 1,
        pageCount: 0
      }, 
      labelsOptions:[
        {
          labelId:'',
          labelName: "客户标签"
      }
      ],
      levelOptions:[
        {
          value:'',
          label: '全部级别'
        },
        {
          value: 1,
          label: '普通'
        },
        {
          value: 2,
          label: '一般'
        },
        {
          value: 3,
          label: '重要'
        }
      ],
      from_typeOptions:[
        {
          value:'',
          label: '全部来源'
        },
        {
          value: 1,
          label: '名片'
        },
        {
          value: 2,
          label: '活动'
        },
        {
          value: 3,
          label: '文章'
        }
      ],
      statusOptions: [
        {
          value:'',
          label: '全部状态'
        },
        {
          value: 1,
          label: '微信潜客'
        },
        {
          value: 2,
          label: '初步沟通'
        },
        {
          value: 3,
          label: '见面拜访'
        },
        {
          value: 4,
          label: '确定意向'
        },
        {
          value: 5,
          label: '正式报价'
        },
        {
          value: 6,
          label: '签约成功'
        }
      ]
    }
  },
  mounted() {
    this.getList()
    this.getLabelList()
  },
  methods: {
    search(){
      this.parmas.pageIndex = 1
      this.getList()
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#fafbff;"
      } else {
        return ""
      }
    },
    handleSelectionChange(row){
      if(this.isState){
        console.log("触发数据变化")
        var self = this;
        // 取消标签
        if(row.length>0){
          // 加入标签
          if(self.formData.labels.length>0){
            let listFind = JSON.parse(JSON.stringify(self.dataList)) 
            row.forEach(datas =>{
              let isTrue = self.formData.labels.find(item => datas.user_id == item.user_id)
              if(!isTrue){
                self.formData.labels.push({
                  user_id:datas.user_id,
                  nickname:datas.nickname
                });
              }
              listFind.forEach((res,index) =>{
                  if(res.user_id == datas.user_id){
                    listFind.splice(index,1)
                  }
              })
            })
            listFind.forEach(closedata=>{
              let findObj = { user_id:closedata.user_id,nickname:closedata.nickname } 
              self.handleClose(findObj)
            })
          }else{
            self.formData.labels = self.formData.labels.concat(row)
          }
        }else{
          self.dataList.forEach(idata=>{
            let conts = self.formData.labels.find(items => items.user_id == idata.user_id)
            if(conts){
              self.handleClose(conts)
            }
          })
        }
      }
    },
    // 客户分页
    employeePagesFn(pageIndex, cb) {
      let self = this;
      self.employeePagination.pageIndex = pageIndex;
      self.parmas.pageIndex = pageIndex
      self.getList(cb);
    },
    // select 下拉获取更多
    loadmore() {
      this.labelParmas.pageIndex++;
      if(this.formData.pageIndex<=this.roleTotal){
        this.getLabelList();
      }
    },
    getLabelList(){
      let self = this
      api.request("getlabelRnakList", self.labelParmas, result => {
        if(result.status==0){
          self.labelsOptions =  self.labelsOptions.concat(result.data.list) 
        }
      })
    },
    getList(cb){
      let self = this
      self.isState = false
      api.request("getMyCustomerList", self.parmas, result => {
        if(result.status==0){
          let listArr =  result.data.list
          listArr.forEach(i => {
            let labels = self.statusOptions.find(item=> i.status == item.value)
            i.statusValue = labels.label
            let level = self.levelOptions.find(items=> i.level == items.value)
            i.levelValue = level.label
          });
          self.dataList = listArr
          self.employeePagination.totalCount = result.data.total
          self.employeePagination.pageCount = Math.ceil(result.data.total/self.parmas.pageSize) 
          let isSelectedArr = []
          self.dataList.forEach((item,index)=>{
            self.formData.labels.find(items =>{
              if(item.user_id==items.user_id){
                isSelectedArr.push(item)
              }
            })
          })
          self.multipleTableTable(isSelectedArr,true)
        }else{
          self.$message.error(result.message);
        }
      })
      !!cb && cb();
    },
    multipleTableTable(data,type){
      console.log(data)
      setTimeout(()=>{
        if (data.length>0) {
          data.forEach(row => {
            this.$refs.tablemultipleTable.toggleRowSelection(row,type);
          });
        }
        this.isState = true 
      },100)
    },
    handleClose(tag) {
      let tasCloseData = this.formData.labels.find(item=> item.user_id == tag.user_id)
      let listCloseData = this.dataList.find(item=> item.user_id == tag.user_id)
      if(tasCloseData){
        this.formData.labels.splice(this.formData.labels.indexOf(tasCloseData), 1);
        this.$refs.tablemultipleTable.toggleRowSelection(listCloseData,false);
      }
    },
    handleInputConfirm(data){
      this.formData.labels.push(data)
    }
  }
}
</script>
<style scoped>
.ellipsis{
  width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.steptwo-box {
  margin-top: 10px;
}
.steptwo-cont {
  border: 1px solid #e3e6eb;
}
.steptwo-top {
  height: 40px;
  text-align: right;
  font-size: 12px;
  padding-right: 17px;
  color: #b1bfcd;
  line-height: 40px;
}
.steptwo-top span {
  color: #f68411;
}
.steplables {
  background: #f7fbfc;
  padding: 10px 6px 14px 6px;
  font-size: 14px;
  color: #8694a2;
  max-height: 180px;
  overflow: auto;
}
.tags {
  background: none;
  border: none;
  color: #9eabb8;
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
.select_item {
  border-radius: 0px !important;
  width: 102px;
  height: 30px;
  margin-right: 10px;
}
.conditions {
  margin: 21px 0px 15px 14px;
  overflow: auto;
}
.search_item {
  display: flex;
  justify-content: space-between;
  width: 260px;
  float: right;
  margin-right: 14px;
}
.search_item .search_input {
  width: 200px;
  height: 30px;
  border: 1px solid #e3e6eb;
  padding-left: 8px;
  line-height: 28px;
}
.search_item .btn {
  background: #00bad0;
  height: 30px;
  width: 60px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  margin-left: -3px;
  z-index: 1;
  color: #ffffff;
  display:flex;
  align-self: center;
  padding: 0 !important;
  justify-content: center;
  line-height: 28px;
}
.table_box {
  padding: 0px 20px;
  overflow: auto;
}

.flex_box {
  display: flex;
  justify-content: flex-start;
  padding: 12px 0px;
  overflow: hidden;
  padding-left: 26px;
}
.flex_box img {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 50%
}
.tableInfo{
  text-align: left;
  line-height: 14px;
  color: #3c4a55;
  display: flex;
  flex-direction: column;
  justify-content: space-around
  
}
.tableInfo div:last-child{
  color: #B1BFCD !important
}
.steptwo-box >>> label {
  font-weight: 400;
}
.steptwo-box >>> .el-input--mini .el-input__inner {
  border-radius: 0;
  background: #ffffff
}
.pull-right {
  margin-top: 19px;
}
::-webkit-input-placeholder { /* WebKit browsers */
  color: #888888;
  font-size: 12px;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #888888;
  font-size: 12px;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #888888;
  font-size: 12px;
}
.label_color{
  color: #B1BFCD !important
}
</style>