<template>
    <div class="pagination text-right">
        <span class="prev mr10 ml10" @click="action('prev')" v-if="paginationOpt.pageIndex != '1'"><i class="triangle-left"></i></span>
        <span class="prev disabled mr10 ml10" v-if="paginationOpt.pageIndex == '1'"><i class="triangle-left"></i></span>
        <span class="mr5">{{paginationOpt.pageIndex}}</span>/<span class="ml5">{{paginationOpt.pageCount}}</span>
        <span class="next mr10 ml10" @click="action('next')" v-if="paginationOpt.pageIndex < paginationOpt.pageCount"><i class="triangle-right"></i></span>
        <span class="next disabled mr10 ml10" v-if="paginationOpt.pageIndex >= paginationOpt.pageCount"><i class="triangle-right"></i></span>
        <span style="float:right;padding-top:2px;">
        <input type="text" v-model="whichPage"><span class="go" @click="action('gotowhich')">GO</span></span>
    </div>

</template>
<script>
/**  父组件调用该组件方法如下
 * 引入方法   例： <pagination class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
    paginationOpt: {//列表分页参数
        pageIndex: 1,
        pageSize: 5,
        totalCount:0,
        pageCount: 0
    }

    **注意事项
        在获取到数据之后，务必重置分页参数
        例： this.paginationOpt.totalCount = result.data.total;
             this.paginationOpt.pageCount = Math.ceil(this.paginationOpt.totalCount / this.paginationOpt.pageSize);
             获取完数据之后，执行固定代码   !!cb && cb();

    //mothod里面增加分页调用方法
    pagesFn(pageIndex, cb) { //pageIndex --- 分页组件返回的页码，    cb ---- 主要目的是为分页加锁，固定参数
        let _this = this;
        _this.paginationOpt.pageIndex = pageIndex;
        _this.getCustomerList(cb);
    }

    具体调用，请参考客户列表
 */
export default {
    name: 'pagination',
    props: {
        'paginationOpt': {
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            clock: false,
            whichPage: ''
        }
    },
    mounted(){

    },
    methods: {
        action (type) {
            let _this = this;
            switch( type ){
                  case 'prev':
                      if(_this.clock == false){
                          _this.whichPage = '';
                          _this.paginationOpt.pageIndex--;
                          _this.clock = true;
                          _this.$emit('switchPage', _this.paginationOpt.pageIndex, function(){
                              _this.clock = false;
                          });
                      }
                      break;
                  case 'next':
                          _this.whichPage = '';
                      if(_this.clock == false){
                          _this.paginationOpt.whichPage = '';
                          _this.paginationOpt.pageIndex++;
                          _this.clock = true;
                          _this.$emit('switchPage', _this.paginationOpt.pageIndex, function(){
                              _this.clock = false;
                          });
                      }
                      break;
                  case 'gotowhich':
                      /* 验证正整数 */
                      if (!/^\d+$/.test(_this.whichPage)) {
                          break;
                      }
                      /* 必须大于0 */
                      if (parseInt(_this.whichPage) <= 0) {
                          break;
                      }
                      /* 超出最大页数时不跳转 */
                      if (parseInt(_this.whichPage) > parseInt(_this.paginationOpt.pageCount)) {
                          break;
                      }
                      if(_this.clock == false){
                          _this.paginationOpt.pageIndex = _this.whichPage;
                          _this.clock = true;
                          _this.$emit('switchPage', _this.paginationOpt.pageIndex, function(){
                              _this.clock = false;
                          });
                      }
                      break;
              }
        }
    }
}
</script>
<style scoped>

/*分页样式 start*/
.pagination {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  /*text-align: center;*/
}

.pagination .mr5 {
  margin-right: 5px;
}

.pagination .ml5 {
  margin-left: 5px;
}

.pagination .ml10 {
  margin-left: 10px;
}

.pagination .mr10 {
  margin-right: 10px;
}

.pagination .next, .pagination .prev {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 1px solid #dee4e9;
  border-radius: 4px;
  vertical-align: middle;
  cursor: pointer;
}

.pagination .triangle-left {
  position: absolute;
  left: 11px;
  top: 9px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-right: 6px solid #3C4A55;
  border-bottom: 5px solid transparent;
}

.pagination .triangle-right {
  position: absolute;
  left: 12px;
  top: 9px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-left: 6px solid #3C4A55;
  border-bottom: 5px solid transparent;
}

.pagination .prev.disabled .triangle-left {
  border-right: 6px solid #dee4e9;
}

.pagination .next.disabled, .pagination .prev.disabled {
  cursor: default;
}

.pagination .next.disabled .triangle-right {
  border-left: 6px solid #dee4e9;
}

.pagination input {
  display: inline-block;
  width: 40px;
  height: 30px;
  border: 1px solid #dee4e9;
  padding-left: 5px;
  border-radius: 4px 0 0 4px;
}

.pagination .go {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 0 4px 4px 0;
  background-color: #00BAD0;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.text-right {
    text-align: right;
}
/*分页样式 end*/
</style>







