<template>
<div class="bread-crumb1" v-if="breadList.length > 0">
	<div aria-label="Breadcrumb" role="navigation" class="el-breadcrumb">
		<span class="el-breadcrumb__item" v-for="(item, index) in breadList" :key="index">
			<span role="link" class="el-breadcrumb__inner is-link" @click="toPage(item)">{{item.title}}</span>
			<i class="el-breadcrumb__separator el-icon-arrow-right" v-if="index < breadList.length-1"></i>
		</span>
	</div>
</div>
</template>
<script scoped>
import menusConfig from '../config/sidebar'
import { constants } from 'crypto';
import eventBus from '../utils/eventBus.js'
export default {
    name:'BreadCrumb',
    componentName:'BreadCrumb',
    props:{

    },
    data(){
        return{
			activeIndex: '',
			breadList: []
        }
	},
	created(){
		eventBus.$on('initBreadCrumb', (item) => {
			this.activeIndex = '';
			this.breadList = [];
			this.getActiveItem(menusConfig, '');
			if(this.activeIndex) this.getBreadList();
		});
	},
    mounted(){
		this.getActiveItem(menusConfig, '');
		if(this.activeIndex) this.getBreadList();
		
    },
    methods:{
        getActiveItem(menu, index) {
			let self = this, _index = index !== '' ? index + '-' : '';
			_.each(menu, (item, index1) => {
				if(self.$route.name == item.key) {
					self.activeIndex = _index + index1;
				}
				if(!self.activeIndex && !!item.children && item.children.length > 0) {
					self.getActiveItem(item.children, _index + index1);
				}
			});
		},
		getBreadList() {//todo
			let self = this, _indexArr = this.activeIndex.split('-');
			switch(_indexArr.length){
				case 1: 
				self.breadList.push(menusConfig[parseInt(_indexArr[0])]);
				break;
				case 2: 
				self.breadList.push(menusConfig[parseInt(_indexArr[0])]);
				self.breadList.push(menusConfig[parseInt(_indexArr[0])].children[parseInt(_indexArr[1])]);
				break;
				case 3:
				self.breadList.push(menusConfig[parseInt(_indexArr[0])]);
				self.breadList.push(menusConfig[parseInt(_indexArr[0])].children[parseInt(_indexArr[1])]);
				self.breadList.push(menusConfig[parseInt(_indexArr[0])].children[parseInt(_indexArr[1])].children[parseInt(_indexArr[2])]);
				break;
			}
		},
		toPage(item) {
			if (!!item.href && item.href != this.$route.name) {
				this.$router.push({
					path: item.href
				});
				eventBus.$emit('initBreadCrumb');
			}
		}
    }   
}
</script>
<style scoped>
.bread-crumb1{
	padding: 0 20px;
	border-bottom: 1px solid #e7ecf1;
}
.bread-crumb1 >>> .el-breadcrumb{
	height: 43px;
	line-height: 43px !important;
	font-size: 12px;
}
</style>


