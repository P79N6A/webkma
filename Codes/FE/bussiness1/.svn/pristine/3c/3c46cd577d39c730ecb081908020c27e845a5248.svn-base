<template>
  <div>
    <div class="table">
      <el-table :header-cell-style="getRowClass" :data="dataNum"  style="width: 100%">
        <el-table-column prop="index" label="序号" align="center" width="180">
        </el-table-column>
        <el-table-column prop="number" label="点赞数" align="center" >{{dataNum}}</el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import api from "api";
import pagination from "components/ui-pagination";
export default {
    components:{
        pagination
    },
    data(){
        return{
            dataNum:[{
              number:0,
              index:1
            }],
            thumbupCont:{
              taskId:this.$route.query.id,
              type:5,
              businessId:localStorage.getItem('businessId')
            },
        }
    },
    mounted(){
      this.getList()
    },
    methods:{
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return "background:#fafbff;"
            } else {
                return ""
            }
        },
        getList(cb){
          let self = this
          api.request("statisticalCont", self.thumbupCont, result => {
          if(result.status==0){
              self.dataNum[0].number =  result.data.dataNum
              self.dataNum[0].index =  1
            }
          })
        },
    }
}
</script>
<style scoped>
.table{
    padding:20px;
}
</style>