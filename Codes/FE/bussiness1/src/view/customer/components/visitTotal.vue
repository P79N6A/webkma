<template>
  <div class="visit-box">
      <p class="title">浏览总时长：<span style="margin-right: 10px;">{{bowerData.totalTimeLength || 0}}</span>     浏览总次数：<span> {{bowerData.totalBrowseCount || 0}}</span></p>
      <el-table :data="bowerData.list" border style="width: 100%"  :header-cell-style="{background:'#F7FBFC'}"  @sort-change="sortChangeHandler">
        <el-table-column prop="taskName" label="任务名称">
        </el-table-column>
        <el-table-column prop="browseTime" label="最近访问时间">
        </el-table-column>
        <el-table-column prop="browseTimeLength" sortable label="浏览时长">
        </el-table-column>
        <el-table-column prop="browseCount" sortable label="浏览次数">
        </el-table-column>
      </el-table>
      <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt"
              @switchPage="pagesFn" />
      <div style="width: 100%;height: 300px;margin-top: 50px;">
        <div id="chartmain" style="width:100%;height: 100%;" ref="chartmain" />
      </div>
  </div>
</template>
<script>
import api from 'api';
import pagination from "../../../components/ui-pagination";
import eventBus from '../../../utils/eventBus';
export default {
  name: "customer-detail-visitTotal",
  components: {
      pagination
  },
  props: {
      businessId: '',
      id: ''
  },
  data(){
      return{
          bowerData: {},
          paginationOpt: {
              pageIndex: 1,
              pageSize: 10,
              totalCount: 0,
              pageCount: 0
          },
          sorts: {}, //层级(level)/浏览次数(browseCount)/浏览时长(browseTimeLength),0:升序，1降序
          drawData: []
      }
  },
  watch: {
    "$route"(to, from) {
      var self = this;
      self.myChart = self.$echarts.init(self.$refs.chartmain);
    },
  },
  mounted() {
    var self = this;
    self.myChart = self.$echarts.init(self.$refs.chartmain);
    this.taskBrowseList();
    this.taskBrowseTimespan();
    window.onresize = () => { //监听窗口变化
      self.repaint();
    };
    eventBus.$on('getPageSize',() => {
      self.repaint();
    });    
  },
  methods: {
    //获取用户浏览记录列表
    taskBrowseList(cb) {
        let self = this;
        api.request('taskBrowseList', {
            "businessId": self.businessId,  
            "targetUserId": self.id,  
            "sorts": self.sorts, 
            "pageIndex": self.paginationOpt.pageIndex, 
            "pageSize": self.paginationOpt.pageSize, 
        }, result => {
            if (result.status === 0) {
                self.bowerData = result.data;
                self.bowerData.list.forEach((item) => {
                  item.browseTimeLength = !!item.browseTimeLength ? (item.browseTimeLength < 5 ? '<5秒' : window.times(item.browseTimeLength)) : '';
                })
                self.bowerData.totalTimeLength = !!self.bowerData.totalTimeLength ? window.times(self.bowerData.totalTimeLength) : self.bowerData.totalTimeLength;
                self.paginationOpt.totalCount = result.data.totalCount;
                self.paginationOpt.pageCount = Math.ceil(
                    self.paginationOpt.totalCount / self.paginationOpt.pageSize
                );
            }
            !!cb && cb();
        })
    },
    //排序
    sortChangeHandler(orderBy) {
        let { order, prop } = orderBy;
        if (!!prop) {
            this.sorts[prop] = order === "descending" ? 1 : 0;
            this.taskBrowseList();
        }
    },
    //分页调用方法
    pagesFn(pageIndex, cb) {
        this.paginationOpt.pageIndex = pageIndex;
        this.taskBrowseList(cb);
    },
    //获取时间分布列表数据
    taskBrowseTimespan() {
        let self = this;
        api.request('taskBrowseTimespan', {
            "businessId": self.businessId,  
            "targetUserId": self.id
        }, result => {
            if (result.status === 0) {
              // result.data = [];
              // for (var i=0;i < 24;i++) {
              //   result.data.push({
              //      timespan: i,
              //      value: Math.random()* 20
              //   })
              // }
              self.drawData = result.data;
              self.drawData.length > 0 && self.drawLine(self.drawData);
            }
        })
    },
    repaint() {
      let self = this;
      self.$nextTick(() => {
        $(self.$refs.chartmain).find('div').css('width', '100%');
        $(self.$refs.chartmain).find('[data-zr-dom-id="zr_0"]').css('width', '100%');
        self.myChart.clear();
        self.drawLine(self.drawData);
      });
    },
    drawLine(data) {
      var lineData = []
      data.forEach(item => {
        lineData.push({
          value: [
            item.timespan,
            item.value
          ]
        });
      });
      this.myChart.setOption({
        grid: {left: '30px', right: '0px'},
        title: { text: "时间分布", left: "0px", top: "0px" },
        tooltip: {
            backgroundColor: "rgba(0,0,0,0.5)",
            formatter: function(params, ticket, callback) {
              return [
                `时间: ${params.value[0]}:00`,
                `阅读数: ${params.value[1]}`
              ].join('</br>');
            }
        },
        xAxis: {
          type: "category",
          maxInterval: 1 * 3600 * 24 * 1000,
          splitLine: {
            show: false,
            lineStyle: {
              color: "#f5f1f5"
            }
          }
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#f5f1f5"
            }
          }
        },
        series: [
          {
            name: "",
            smooth: true,
            type: "line",
            symbolSize: 5, //拐点圆的大小
            itemStyle: {
              color: "#4e8fed",
              borderType: "solid",
              borderWidth: 5
            },
            areaStyle: {
              color: "#eaf0ff"
            },
            data: lineData
          }
        ]
      }, true);
    },
  }
}
</script>

<style scoped>
#chartmain canvas {
  width: 100%;
}
.title{
    color: #3C4A55;
    font-size: 12px;
    padding-bottom: 10px;
}
.title span{
    color: #F68411;
}
.visit-box {
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
  margin-top: 30px;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
