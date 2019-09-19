<template>
    <div class="slide-btn" :class="{'active': (state === 0 || state == 2 )}" @click="emitToParent">
        {{ slideText }}
        <!-- <div class="dott"></div> -->
    </div>
</template>
<script>
/**
 * 状态包含：0 活动，1 未活动
 * button 属性选型(slideBtnOpt),默认：{}
 * 属性 key (propKey), 默认为：state
 * 属性值到状态的映射(propValueMap),默认：
 * { 
 *    0:0,
 *    1:1
 * }
 * 活动时显示文本（activeText）,默认：启用
 * 未活动时显示文本（inactiveText）,默认：禁用
 */
export default {
    name: 'page-title',
    props: {
        'slideBtnOpt': {
            default: () => {
                return {}
            }
        },
        'inactiveText':{
            type:String,
            default:'禁用'
            },
        'activeText':{
            type:String,
            default:'启用'
        },
        'propKey':{
            type:String,
            default:'state'
        },
        // 属性值到状态的映射
        'propValueMap':{
            type:Object,
            default(){
               return{ 
                0:0,
                1:1
               }
            }
        }
    },
    data: () => {
        return {
            
        }
    },
    created(){
        // 转换状态到属性值
        this.stateMapValue={};
        for (const key in this.propValueMap) {
            if (this.propValueMap.hasOwnProperty(key)) {
                const element = this.propValueMap[key];
                this.stateMapValue[element]=key;
            }
        }
    },
    computed: {
        state:{
            get(){
                return this.propValueMap[this.slideBtnOpt[this.propKey]];
            },
            set(val){
                this.slideBtnOpt[this.propKey]=this.stateMapValue[val];
            }
        },
      slideText (obj) {
        let val =this.slideBtnOpt[this.propKey];
        let text =(this.propValueMap[val] === 0 || this.propValueMap[val] == 4) ? this.activeText : this.inactiveText;
        return text;
      }
    },
    methods: {
        emitToParent() {
            if(this.state == 1){
                this.state = 0;
            }else {
                this.state = 1;
            }
            this.$emit( 'slide-event', this.slideBtnOpt );
        }
    }
}
</script>
<style scoped>
.slide-btn {
    display: inline-block;
    position: relative;
    min-width: 50px;
    height: 19px;
    line-height: 19px;
    border-radius: 19px;
    color: #fff;
    cursor: pointer;
    background-color: #b1bfcd;
    font-size: 12px;
    padding-left: 20px;
    padding-right: 5px;
    transition: border-color .3s,background-color .3s;
}
.slide-btn.active {
    background-color: #00BAD0;    
    padding-left: 5px;
    padding-right: 20px;
}
.slide-btn::after {
    content: "";
    display: inline-block;
    width: 15px;
    height: 15px;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: all .3s;
    border-radius: 100%;
    background-color: #fff;
}
.slide-btn.active::after {
    left: calc(100% - 18px);
}
</style>

