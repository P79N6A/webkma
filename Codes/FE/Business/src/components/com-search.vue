<template>
    <el-input
        :placeholder="placeholder"
        suffix-icon="el-icon-search"
        v-model="keywords"
        @keyup.native.enter.stop.prevent="searchHandler"
        @click.native.stop.prevent="searchHandler"
        size ="small"
        class="com-search-input"
        ref="searchInputRef"
        >
    </el-input> 
</template>
<script>
export default {
    name:'ComSearch',
    componentName:'ComSearch',
    props:{
        placeholder:{
            type:String,
            default:"请输入关键词搜索"
        }
    },
    data(){
        return{
            keywords:''
        }
    },
    mounted(){
        // @keyup.native.space.stop.prevent="keyHandler"
        // @keydown.native.space.stop.prevent="keyHandler"
        // 兼容ie 注册keyup事件
        this.$refs.searchInputRef.$el.addEventListener('keyup',this.keyHandler.bind(this));
    },
    methods:{
        searchHandler($evt){
            $evt.stopPropagation();
            $evt.preventDefault();
            if($evt.target.tagName!=='INPUT' || $evt.code==='Enter'||$evt.keyCode===13){
                this.$emit('searchHandler',this.keywords)
            }
        },
        keyHandler($evt){
            // console.log(JSON.stringify( $evt))
            if($evt.code ==='Space' || $evt.keyCode===32){
                $evt.stopPropagation();
                $evt.preventDefault();
                return false;
            }
            if($evt.keyCode===13){
                this.searchHandler($evt);
            }
        }
    }   
}
</script>


