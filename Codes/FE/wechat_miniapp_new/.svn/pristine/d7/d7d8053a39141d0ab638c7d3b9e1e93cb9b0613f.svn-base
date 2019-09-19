import * as echarts from '../../vendor/ec-canvas/echarts';

/**
 * 流量统计雷达图
 * data: Array<Number> Length:4
 */
module.exports = (data) => {
  return {
    onInit: function(canvas, width, height) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      var option = {
        backgroundColor: "#ffffff",
        tooltip: {
          formatter: function(params, ticket, callback) {
            return [
              `● 曝光: ${params.value[0]}%`,
              `● 访客: ${params.value[1]}%`,
              `● 咨询: ${params.value[2]}%`,
              `● 成交: ${params.value[3]}%`,
            ].join("\n");
          }
        },
        radar: {
          indicator: [{
              name: '曝光',
              max: 100
            },
            {
              name: '访客',
              max: 100
            },
            {
              name: '咨询',
              max: 100
            },
            {
              name: '成交',
              max: 100
            }
          ]
        },
        color: ["#F68411"],
        series: [{
          type: 'radar',
          name: '统计',
          data: [{
            value: data
          }],
          lineStyle: {
            normal: {
              width: 2,
              opacity: 0.3
            }
          },
          areaStyle: {
            normal: {
              opacity: 0.3
            }
          }
        }]
      };
      chart.setOption(option);
      return chart;
    }
  }
}