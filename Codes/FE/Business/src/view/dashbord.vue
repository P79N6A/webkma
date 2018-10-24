<template>
    <div class="page-right-box">
        <div class="section">
            <div class="section-title">访问趋势</div>
            <div class="section-body">
               <div id="accessTrend" ref="accessTrend"></div>
            </div>
        </div>
        <div  class="section" style="margin-right: 0;">
             <div class="section-title">访客趋势</div>
              <div class="section-body">
                  <div id="visitorTrend" ref="visitorTrend"></div>
              </div>
        </div>
        <div class="pull-left section1">
             <div class="pull-left section-title">营销活动数据</div>
             <div class="pull-right more" @click="clickMore('marketing')">更多&gt;</div>
             <div class="table-outBorder">
                <el-table :data="marketingCampaign" tooltip-effect="dark" style="width: 100%" row-key="id" class="table"  header-row-class-name="table-header" header-cell-class-name="table-header">
                  <el-table-column label=""  width="20"></el-table-column>
                  <el-table-column label="活动名称"  width="260" prop="name" show-overflow-tooltip align='left'></el-table-column>
                  <el-table-column label="累计推广分享数"  width="126" prop="totalShare" show-overflow-tooltip align='center'></el-table-column>
                  <el-table-column label="累计推广访客数"  width="126" prop="totalVisitor" show-overflow-tooltip align='center'></el-table-column>
                  <el-table-column label="累计推广浏览数"  width="146" prop="totalAccess" show-overflow-tooltip align='center'></el-table-column>
                </el-table>
             </div>
        </div>
        <div  class="pull-left section2">
            <div class="pull-left section-title">员工推广数据</div>
            <div class="pull-right more" @click="clickMore('employee')">更多&gt;</div>
            <div class='table-outBorder'>
              <div class="item" v-for="item in employeeList" :key="item.id" v-if="employeeList.length>0">
                <div class="pull-left imageCenter"><img :src="item.userFace" alt=""></div>
                <div class="pull-left">
                  <div class="name" v-text="item.name"></div>
                  <div>
                    <span class="scanItem"><i class="iconfont icon-marketing-xtension"></i><span v-text="item.totalShare"></span></span>
                    <span class="scanItem"><i class="iconfont icon-customer-management"></i><span v-text="item.totalVisitor"></span></span>
                    <span class="scanItem"><i class="iconfont icon-liulan"></i><span v-text="item.totalAccess"></span></span>
                  </div>
                </div>
              </div>
              <div v-if="employeeList.length==0" class="noData">暂无数据</div>
            </div>
        </div>
    </div>
</template>

<script>
import pagination from "components/ui-pagination";
import api from "api";
import echarts from "bdcharts";
import defaultHead from '../assets/images/default-headImg.png';
export default {
  components: {
    pagination,
    api,
    echarts,
    defaultHead
  },
  name: "dashbord",
  data: function() {
    return {
      marketingCampaign:[],
      employeeList:[],
      businessId:''
    };
  },
  mounted() {
    var self = this;
    self.businessId=localStorage.businessId;
    self.accessTrend = echarts.init(self.$refs.accessTrend);
    self.visitorTrend = echarts.init(self.$refs.visitorTrend);
    self.aggsTime();
    self.getManuscriptListOfRelease({pageIndex:1,pageSize:9,businessId:self.businessId});
    self.getEmployeeList({pageIndex:1,pageSize:6,state:0})
  },
  methods: {
    clickMore(action){
      if(action=='employee'){
          this.$router.push({
                path: '/employee-management'
            });
      }else{
        this.$router.push({
                path: '/marketing-campaign'
            });

      }
    },
    arrayMax(arrayName) {//返回数组的最大值
      var max = arrayName[0];
      for (let i = 0; i < arrayName.length; i++) {
        max = arrayName[i] > max ? arrayName[i] : max;
      }
      return max;
    },
    getManuscriptListOfRelease(obj){//获取已发布稿件列表
      var self=this;
       api.request("getManuscriptListOfRelease", obj, result => {
          if(result.status==0){
            self.marketingCampaign=result.data.list;
          }
       })
    },
    //获取员工列表
    getEmployeeList(obj){
      var self=this;
      api.request("getEmployeeList", obj, result => {
          if(result.status==0){
            $.each(result.data.list, (index, item) => {
                      item.userFace=item.userFace||defaultHead;
                  })
            self.employeeList=result.data.list;
          }
       })
    },
    aggsTime() {// 获取统计数据
      var self = this;
      var option = {
        color: ["#3898ec"],
        grid: {
          containLabel: true,
          left: 30,
          right:64,
          bottom:20,
          top:46
        },
        tooltip: {
              trigger: "axis",
              textStyle :{
                fontSize:12,
              }
        },
        xAxis: {
          name: "月/日",
          nameTextStyle:{
            color:'#63717b'
          },
          nameGap: 10,
          position: "bottom",
          type: "category",
          boundaryGap: false,
          data: [],
          axisTick: {
            interval: 0,
            lineStyle:{
              color:'#63717b'
            }
          },
          axisLabel: {
            color:'#63717b',
            fontSize: 12,
            interval: 0
          },
          axisLabel: {
            interval: 0
          },
        },
        yAxis: {
          nameTextStyle:{
            color:'#63717b'
          },
          nameGap: 10,
          type: "value",
          min: 0,
          splitNumber: 5,
          axisLabel: {
            color:'#63717b',
            fontSize: 12,
            interval: 0
          },
          axisTick: {
            interval: 0,
            lineStyle:{
              color:'#63717b'
            }
          }
        },
        series: [
          {
            type: "line",
            data: [],
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(56, 152, 236,.4)"
                  },
                  {
                    offset: 1,
                    color: "rgba(56, 152, 236,.4)"
                  }
                ])
              }
            }
          }
        ]
      };
      api.request("aggsTime", {as_belong_id:self.businessId}, result => {
        if (result.status == 0) {
          var dateList = [];
          var visitorData=[];
          var accessData=[];
          var year='';
          result.data.group.forEach((element, index) => {
              for (let i in element) {
                if (i != "count" && i != "key") {
                  if (element.key == "scan_visitor") {
                      var dateArray=i.split('-')
                        dateList.push(dateArray[1]+'/'+dateArray[2]);
                        visitorData.push(element[i]);
                        year=dateArray[0];
                  }else if(element.key == "scan_access"){
                      accessData.push(element[i]);
                  }
                }   
            }
          });
          option.xAxis.data=dateList.reverse();
          var accessMax=self.arrayMax(accessData);
          option.yAxis.max=function (value) {
              accessMax = accessMax != 0 ? accessMax :5;
                for (let i = 0; i < 10; i++) {
                  if ((accessMax + i) % 5 == 0) {
                    return accessMax+ i;
                  }
                }
          }
          option.yAxis.name= "访问数(PV)";
          option.series[0].data=accessData.reverse();
          option.series[0].name= "访问数(PV)";
          option.tooltip.formatter=function (params) {
            return year+'-'+params[0].axisValue.replace('/','-')+'<br>'+params[0].marker+'访问数(PV): ' + params[0].data
          }
          self.accessTrend.setOption(option);
         //   访客趋势
          var visitorMax=self.arrayMax(visitorData);
          option.yAxis.max=function (value) {
              visitorMax = visitorMax != 0 ? visitorMax :5;
                for (let i = 0; i < 10; i++) {
                  if ((visitorMax + i) % 5 == 0) {
                    return visitorMax+ i;
                  }
                }
          }
           option.yAxis.name= "访客数(UV)";
           option.series[0].name= "访客数(UV)";
           option.series[0].data=visitorData.reverse();
           option.tooltip.formatter=function (params) {
            return year+'-'+params[0].axisValue.replace('/','-')+'<br>'+params[0].marker+'访客数(UV): ' + params[0].data
          }
          self.visitorTrend.setOption(option);
          
        }
      });
    }
  }
};
</script>
<style scoped>
.page-right-box {
   color: #63717b;
   font-size: 14px;
  padding: 30px 40px 30px 40px;
}
.page-right-box .section {
  float: left;
  width: 560px;
  margin-right: 40px;
}
.page-right-box .section1{
  margin-right: 40px;
  margin-top:20px;
}
.page-right-box .section2{
  width: 442px;
  margin-top:20px;
}
.page-right-box .section-title {
  color: #3c4a55;
  font-size: 16px;
  line-height: 1;
  margin-bottom: 20px;
}
.page-right-box .section-body {
  height: 300px;
  margin-bottom: 20px;
}
.page-right-box .section>.section-body{
 background:#f7fbfc;
}
#accessTrend,#visitorTrend{
    width: 100%;
    height: 100%;
}

.page-right-box .table-outBorder{
  clear: both;
  border:1px solid #e3e3e3;
}
.page-right-box .section1 .table-outBorder{
  width:100%;
  border:none;
}
.page-right-box .section2 .table-outBorder{
  padding-top:10px;
  padding-bottom:10px;
  height: 425px;
  overflow: hidden;
}
.page-right-box  .more{
  color:#2578c0;
  cursor: pointer;
}
.page-right-box .table-outBorder .item{
  font-size: 12px;
  padding-top:15px;
  padding-bottom:14px;
  padding-left:40px;
  overflow: hidden;
}
.page-right-box .table-outBorder  .imageCenter{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right:15px;
}
.page-right-box .table-outBorder  .imageCenter>img{
  width: 100%;
  height: 100%;
}
.page-right-box .table-outBorder  .name{
  width: 230px;
  height: 14px;
  line-height: 14px;
  margin-bottom:5px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.page-right-box .table-outBorder  .scanItem{
  color:#9eabb8;
  margin-right:10px;
  line-height: 14px;
  height: 14px;
}
.page-right-box .table-outBorder .scanItem .iconfont{
  font-size: 12px;
  margin-right:5px;
}
.page-right-box .table-outBorder .noData{
  text-align: center;
  line-height:3;
}
</style>

