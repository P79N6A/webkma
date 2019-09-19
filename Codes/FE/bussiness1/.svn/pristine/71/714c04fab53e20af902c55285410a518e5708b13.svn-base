<template>
    <div class="el-select pull-left" :class="{'spread': spread}" data-type="el-select"> 
        <div class="select-value" :class="{'borderBottom': !spread}" @click="spread = !spread;"><span>{{selectItem.name}}</span><i class="iconfont pull-right" :class="spread ? 'icon-form-spread-true' : 'icon-form-spread-false' " style="cursor:pointer;font-size:14px;"></i> </div>
        <div class="select-dropmenu"  style="width:100%;height:153px;padding:0 10px;position:absolute;top:30px;left:0px;background-color:#fff;z-index:2;border:1px solid #e3e3e3;border-top:none;">
            <p class="menu-search">
                <el-input
                    placeholder="请输入推广活动名称"
                    suffix-icon="el-icon-search"
                    v-model="keywords"
                    @keyup.native.enter.stop.prevent="searchHandler"
                    @click.native.stop.prevent="searchHandler">
                </el-input>
            </p>
            <div class="menu-body scroll-box">
                <p style="padding-left:10px;" :class="{'secletP': item.id == selectItem.id}" v-for="(item, index) in selectArr" :key="index" @click="select(item)">{{item.name}}</p>
            </div>
        </div>
    </div>
</template>
<script>
  import api from 'api'
  export default {
    name: 'com-upload',
    props: {
      'selectArr': {
          type:Array,
          default:() => { return [];}
      },
      'search': {
          type:String,
          default:''
      }
    },
    data() {
      return {
        spread: false,
        keywords: '',
        selectItem: {name: ''}
      };
    },
    watch: {
        'selectArr': function (n, o) {
            this.selectItem = !this.selectItem.name ? n[0] : this.selectItem;
        }
    },
    mounted(){
        this.$eventBus.$on('el-select-spread',($event) => {
            this.spread = false;
        });
    },
    methods: {
      searchHandler($evt){
        $evt.stopPropagation();
        $evt.preventDefault();
        if($evt.target.tagName!=='INPUT' || $evt.code==='Enter'||$evt.keyCode===13){
            this.$emit('freshDataHandle',this.keywords);
        }
      },
      select(item) {
        this.selectItem = item;
        this.spread = false;
        this.$emit('slectedHandle', this.selectItem);
      }
    }
  }

</script>
<style scoped>
.el-select {
    width: 254px;
    height: 30px;
    overflow: hidden;
    color: #888;
}
.el-select.spread{
    overflow: inherit;
}
.select-value {
    width:100%;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    border: 1px solid #e3e3e3;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    font-size: 14px;
    color:#63717b;
}
.select-value.borderBottom {
    border-bottom: 1px solid #e3e3e3;
    border-radius: 4px;
}
.el-select .el-input__inner {
    padding-left:10px;
}
.select-value i{
    margin-right: 10px;
}
.menu-body {
    margin-top:5px;
    height: 110px;
    overflow-y: auto;
}
.menu-body p{
    cursor: pointer;
}
.secletP {
    background-color: #eff7fa;
}
</style>


