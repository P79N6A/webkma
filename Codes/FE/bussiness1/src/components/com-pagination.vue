<template>
  <nav>
    <ul class="pagination pagination-rounded">
      <li :class="pagination.pageIndex == 1 ? 'disabled' : ''" @click="jumpPage(1)">
        <a href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li :class="pagination.pageIndex == item ? 'active' : ''" v-for="item in pagination.pageCount" :key="item" @click="jumpPage(item)">
        <a>{{item}}</a>
      </li>
      <li :class="pagination.pageIndex == pagination.pageCount ? 'disabled' : ''" @click="jumpPage(pagination.pageCount)">
        <a aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    props:['pagination'],
    data:function(){
      return{
      }
    },

    mounted () {
      // this.initData();
    },
    methods:{
      jumpPage:function (item) {
        let _this = this;
        if(item == _this.pagination.pageIndex){
          return false;
        }
        _this.pagination.pageIndex = item;
        _this.pagination.startCount = (item - 1) * _this.pagination.pageSize;
        _this.$emit('setPageData',_this.pagination);
      },
      // pageMove:function () {//更多
      //   let _this = this;
      //
      // },
    }
  }
</script>

<style scoped>

</style>
