<template>
    <div class="pager-container">
        <div class="pager-shrinking" :class="{'up':!isShow,}"  @click="onShrinkingHandler"></div>
        <div class="pager-body" v-if="isShow">
                <custom-scroll :options="{scrollX: true, scrollY: false,scrollbars:true,preventDefault: false}"  :refresh="refreshEvt"  >
                    <div class="pager-list">
                        <ul id="page_list">
                            <li class="pager-item" :class="{'active':item.number===currentPage.number}" v-for="(item,index) in pages" :data-page-number="item.number" :key="item.number" @click.stop="switchPage(item)">第{{index+1}}页
                                <div class="remove" >
                                    <div class="opt-item" @click.stop="copyPage(item,index)" > <i class="iconfont icon-copy"></i> 
                                    </div>
                                    <div class="opt-item" @click.stop="removePage(item,index)">
                                    <i class="el-icon-delete"></i></div> </div>
                            </li>
                            <li class="pager-item pager-add" @click="addPage"> <div class="" title="新增页面"><i class="el-icon-plus"></i></div>
                            </li>
                            <!-- <li class="pager-item pager-add" @click="restorePage"> <div class="" title="恢复删除页面" ><i class="iconfont icon-previous-step"></i></div>
                            </li> -->
                        </ul>
                    </div>
                </custom-scroll >
        </div>  
    </div>
</template>
<script>

export default {
    name: "designPager",
    props:{
        pages:{
            type:Array,
            default(){
                return [];
            }
        },
        currentPage:{
            type:Object,
            default(){
                return {};
            }
        }
    },
    data(){
        return {
            isShow:true,
            refreshEvt:'refreshEditorPager'
        }
    },
    created(){
    },
    mounted() {
        this.$eventBus.$emit(this.refreshEvt);
        $("#page_list" ).sortable({
            items:'> li:not(.pager-add)',
            cursor: "move",
            placeholder: "ui-state-area",
        }).on('sortupdate',()=>{
            var sortResult=[];
            $("#page_list" ).find('[data-page-number]').each((idx,el)=>{
                sortResult.push($(el).data('pageNumber'));
            });
            this.$emit('sort-page',sortResult);
        });
    },
    updated(){
        this.$eventBus.$emit(this.refreshEvt);
    },
    methods:{
        addPage(){
            this.$emit('add-page');
        },
        restorePage(){
            this.$emit('restore-page');
        },
        removePage(item,idx){
            Kdo.utils.messenger.confirm('页面删除后不可恢复，确定删除吗？',(ok)=>{
                if(ok)this.$emit('remove-page',item);
            });
        },
        copyPage(item,idx){
            this.$emit('copy-page',item);
        },
        onShrinkingHandler(){
            this.isShow=!this.isShow;
        },
        switchPage(page){
            this.$emit('on-load-page',page.number);
        }
    }
}
</script>

<style>
    .pager-container{
        width: auto;
        box-sizing: border-box;
        background: #fff;
        position: fixed;
        top: auto;
        bottom: 0;
        left: 320px;
        right: 450px;
        z-index: 1999;
    }
    .pager-container .pager-body{
        height: 120px;
        width: 100%;
        padding: 10px 10px 0;
    }
    .pager-container .pager-shrinking{
        width: 100px;
        height: 10px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        background: #c9d4df;
        position: absolute;
        top: -10px;
        right: 0;
        left: 0;
        margin: auto;
        padding-top: 3px;
        cursor: pointer;
    } 
    .pager-container .pager-shrinking:before{
        content: '';
        width: 0;
        height: 0;
        display: block;
        margin: auto;
        border: 6px solid #fff;
        border-left-color: transparent;
        border-right-color: transparent;
        border-bottom: none;
    }
    .pager-container .pager-shrinking.up:before{
        border-top: none;
        border-bottom: 6px solid #fff;
    }
    .pager-container .pager-list{
        display: inline-block;
        writing-mode: vertical-lr;
        height: 100%;
    }
    .pager-container .ui-state-area,
    .pager-container .pager-item{
        width: 70px;
        height: 100px;
        background-color: #f2f3f7;
        font-size: 14px;
        color: #63717b;
        line-height: 100px;
        text-align: center;
        position: relative;
        margin-right: 10px;
        display: inline-block;
        cursor: pointer;
        writing-mode: horizontal-tb;
        box-sizing: border-box;
    }
    .pager-container .pager-add{
        color: #c9d4df;
    }
    .pager-container .pager-add:last-child{
         margin-right: 0;
    }
    .pager-container .pager-item .remove{
        display: none;
        line-height: 35px;
        height: 35px; 
        position: absolute;
        left: 0;
        right: 0;
        top: auto;
        bottom: 0;
    }
    .pager-container .pager-item.active{
        background-color: #00bad0;
        color: #fff;
    }
    .pager-container .pager-item.active:hover .remove{
        height: 35px;
        background: rgba(0,0,0,.3);
        display: block;
    }
    .pager-container .remove .opt-item{
        width: 50%;
        float: left;
        height: 100%;
    }
    .pager-container .ui-state-area{
        border: 1px dotted #00bad0;
        background-color:transparent;
    }
</style>


