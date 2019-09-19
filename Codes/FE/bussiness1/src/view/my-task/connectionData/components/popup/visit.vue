<template>
  <div class="visit-box">
    <div style="overflow: hidden;">
      <el-table :data="tableData" border style="width: 100%" :header-cell-style="{background:'#F7FBFC'}">
        <el-table-column prop="name" label="活动名" align="center" min-width="200">
        </el-table-column>
        <el-table-column prop="browseTime" label="最近访问时间" align="center">
        </el-table-column>
        <el-table-column prop="browseTimeLength" label="浏览时长" align="center">
        </el-table-column>
        <el-table-column prop="browseCount" label="浏览次数" align="center">
        </el-table-column>
      </el-table>
      <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt"
        @switchPage="employeePagesFn" />
    </div>
    <div id="chartmain" style="width:100%; height:280px;" ref="chartmain" />
  </div>
</template>
<script>
import api from 'api';
import pagination from "../../../../../components/ui-pagination";
import eventBus from '../../../../../utils/eventBus';
export default {
  components: {
    pagination
  },
  props: {
    IDList: {
      type: Object,
      default: () => {
        return {
          merchantId: 0,
          taskId: 0,
          rootUserId: 0,
          userId: 0,
        }
      }
    },
  },
  data() {
    return {
      drawData: [],
      tableData: [],
      paginationOpt: {
        pageIndex: 1,
        pageSize: 5,
        totalCount: 0,
        pageCount: 0
      },
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
    self.dataList()
    self.myChart = self.$echarts.init(self.$refs.chartmain);
    self.timeList()
    window.onresize = () => { //监听窗口变化
      self.repaint();
    };
    eventBus.$on('getPageSize', () => {
      self.repaint();
    });
  },
  methods: {
    repaint() {
      let self = this;
      self.$nextTick(() => {
        $(self.$refs.chartmain).find('div').css('width', '100%');
        $(self.$refs.chartmain).find('[data-zr-dom-id="zr_0"]').css('width', '100%');
        self.myChart.clear();
        // self.drawLine(self.drawData);
      });
    },
    dataList(cb) {
      var self = this
      let data_ = {
        "businessId": localStorage.getItem('businessId'),
        "pageIndex": self.paginationOpt.pageIndex,
        "pageSize": self.paginationOpt.pageSize,
        "sorts": {},
        "taskId": self.$route.query.id,
        "targetUserId": self.IDList.userId,
        "rootUserId": self.IDList.rootUserId
      }
      api.request('taskBrowseList', data_, result => {
        for (var i = 0; i < result.data.list.length; i++) {
          if (result.data.list[i].browseTimeLength < 5) {
            result.data.list[i].browseTimeLength = "<5秒";
          } else {
            result.data.list[i].browseTimeLength = window.times(
              result.data.list[i].browseTimeLength
            );
          }
          result.data.list[i].name = this.$route.query.myTitle
        }
        self.tableData = result.data.list;
        self.paginationOpt.totalCount = result.data.totalCount;
        self.paginationOpt.pageCount = Math.ceil(
          self.paginationOpt.totalCount / self.paginationOpt.pageSize
        );
        !!cb && cb();
      })
    },
    timeList() {
      var self = this;
      api.request('taskBrowseTimespan', {
        "businessId": localStorage.getItem('businessId'),
        "taskId": self.$route.query.id,
        "targetUserId": self.IDList.userId,
        "rootUserId": self.IDList.rootUserId
      }, result => {
        self.drawData = result.data;
        self.drawData.length > 0 && self.drawLine(self.drawData);
      })
    },
    //分页
    employeePagesFn(pageIndex, cb) {
      let self = this;
      self.paginationOpt.pageIndex = pageIndex;
      self.dataList(cb);
    },
    drawLine(val) {
      var lineData = []
      val.forEach(item => {
        lineData.push({
          value: [
            item.timespan + ':00',
            item.value
          ]
        });
      });
      this.myChart.setOption({
        grid: { left: '30px', right: '0px' },
        title: { text: "时间分布", left: "0px", top: "0px" },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.5)",
          formatter: function (params, ticket, callback) {
            return [
              `时间: ${params.value[0]}`,
              `阅读数: ${params.value[1]}`
            ].join('</br>');
          }
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 360,
            rich: {}
          },
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
.visit-box {
  margin: 0 auto;
  width: 95%;
  margin-top: 30px;
}
</style>
