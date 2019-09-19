<template>
  <div style="height:auto;">
    <el-header class="clear-padding" style="position: relative;">
		<span class="search-tip tipText-color" v-if="keyWords">共{{activityTotal}}条，检索结果<span class="yellow-light">{{searchTotal}}</span></span>
        <pageTitle :pageTitle="pageTitleOpt" @search-event="search" ref="searchWrap"/>
    </el-header>
    <!-- 列表 -->
    <div class="container-fluid clear-padding">
      <div class="tpl-table" style="padding-bottom: 10px;">
		<div class="search-option">
			<el-form :inline="true" :model="searchCondition" class="demo-form-inline">
				<el-form-item label="活动类型">
					<el-select v-model="searchCondition.mauscriptType" placeholder="活动类型">
						<el-option label="全部" value=""></el-option>
						<el-option label="H5活动" value="1"></el-option>
						<el-option label="海报" value="2"></el-option>
						<el-option label="文章" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="searchCondition.manuscriptStatus" placeholder="状态">
						<el-option label="全部" value=""></el-option>
						<el-option label="未开始" value="1"></el-option>
						<el-option label="进行中" value="2"></el-option>
						<el-option label="已结束" value="3"></el-option>
						<!-- <el-option label="暂停中" value="4"></el-option> -->
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" style="width: 100px;" @click="search(keyWords)">查询</el-button>
				</el-form-item>
				</el-form>
	  	</div>
        <div class="list" :style="{ width: list.width}" v-if="list.data.length > 0">
			<div class="item" :class="item.hover ? 'hover': ''" v-for="(item, index) in list.data" :key="index" @mouseenter="item.hover = true;" @mouseleave="item.hover = false;">
				<div class="flag" :class="item.flagClass">
					<div class="sanjiao1">
					</div>
					<div class="sanjiao2">
					</div>
					<div class="text"> 
						{{item.flagText}}
					</div>
				</div>
				<div class="img">
					<img :src="item.cover">
				</div>
				<div class="introduce">
					<div class="desc">
						<div class="title">{{item.name}}</div>
						<p class="time">{{item.operatorDate}}</p>
					</div>
					<el-collapse-transition>
						<div class="operate" v-show="item.hover">
							<span class="pull-left">
								<img v-if="item.operatorBtn.preview" src="../../assets/images/task-preview.png" title="预览" @click="preview(item)">
								<img v-if="item.operatorBtn.edit" src="../../assets/images/task-edit.png" title="编辑" @click="edit(item)">
							</span>
							<span class="pull-right">
								<img v-if="item.operatorBtn.copy" src="../../assets/images/task-copy.png" title="复制" @click="copy(item)">
								<img v-if="item.operatorBtn.remove" src="../../assets/images/task-remove.png" title="删除" @click="remove(item)">
							</span>
						</div>
					</el-collapse-transition>
				</div>
				<div class="mask">
					<div style="margin: 50px auto 21px;" v-if="item.manuscriptType == 1 && item.pluginNameList.length>0">
						<transition name="el-zoom-in-center">
							<button class="option-btn font-12" v-show="item.hover" @click="jumpPlur(item.id)">插件数据</button>
						</transition>
					</div>
					<div :style="{'margin-top': item.manuscriptType != 1 || item.pluginNameList.length == 0 ? '80px' : ''}">
						<transition name="el-zoom-in-center">
							<button class="option-btn font-12" v-show="item.hover" @click="toAssignment(item.id, item.manuscriptType,item.name)">人脉数据</button>
						</transition>
					</div>
				</div>
			</div>
			<div>
				<pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
			</div>
		</div>
       
      </div>
      <emptyTpl v-if="paginationOpt.totalCount == 0 "/>
      
    </div>
  </div>
</template>

<script>
import pageTitle from "components/page-title";
import pagination from "components/ui-pagination";
import emptyTpl from "components/empty-tpl";
import api from "api";
import { createPreviewWindow } from "../../utils";
import eventBus from '../../utils/eventBus'

export default {
  components: {
    pageTitle,
    pagination,
    emptyTpl
  },
  name: "my-promotion",
  data: function() {
    return {
      pageTitleOpt: {
        text: "我的任务",
        search: {
          value: "",
          placeholder: "请输入关键词搜索活动"
        },
        showSearch: true
      },
      paginationOpt: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 1,
        pageCount: 0
	  },
	  searchCondition: {
		mauscriptType: '', //活动类型
		manuscriptStatus: '' //活动状态
	  },
      keyWords: "",
      list: {
		  width: '100%',
		  data: []
	  },
	  searchTotal: '', //搜索活动总条数
	  activityTotal: '' //全部活动总条数
    };
  },
  created() {
    
  },
  mounted() {
	eventBus.$on('getPageSize',() =>{
		this.getPageSize();
		this.getList();
	})
	this.getPageSize();
	this.getList();
  },
  methods: {
	// 跳转任务详情tabs
	toAssignment(id, manuscriptType,myTitle) {
		this.$router.push({
			path: '/connection-data',
			query: {
				id,
				manuscriptType,
				myTitle
			}
		})
	},
	//根据页面宽度计算出最合适的pagesize
	getPageSize() {
		let w = $('.container-fluid').width(), item_w = 172;
		this.paginationOpt.pageSize = Math.floor(w / item_w) * 2;
		// 动态给list设置宽度
		console.log(w)
		this.list.width = Math.floor(w / item_w) * 172 + 'px';
	},	
    getList(cb) {
      //获取模板列表
      var _this = this,
        _option = {
		  manuscriptType: _this.searchCondition.mauscriptType,
		  manuscriptStatus: _this.searchCondition.manuscriptStatus,
		  nameSearch: _this.keyWords,
          pageIndex: _this.paginationOpt.pageIndex,
          pageSize: _this.paginationOpt.pageSize,
          businessId: localStorage.businessId
        };
      
      api.request('getMyManuscriptList', _option, result => {
        if (result.status == 0) {
		  // 如果获取数据列表为空，并且页码大于1，则回到第一页重新获取数据。
          if (
            result.data.list.length == 0 &&
            _this.paginationOpt.pageIndex > 1
          ) {
            return _this.search();
		  }
		  result.data.list.map((item) => {
			  var operatorBtn = {
				  preview: true,
				  copy: true,
				  edit: true,
				  remove: true
			  }
			  switch(item.manuscriptStatus){
				  case 1: 
					item.flagClass = 'nostart';
					item.flagText = '未开始';
				  	break;
				  case 2: 
				  	item.flagClass = 'proceed';
					item.flagText = '进行中';
				  	break;
				  case 3: 
				  	item.flagClass = 'pause';
					item.flagText = '已结束';
					operatorBtn.edit = false;
				  	break;
			  }
			  item.operatorBtn = operatorBtn;
			  item.hover = false;
			  if(item.manuscriptType == 3){
				  item.operatorBtn.edit = false;
				  item.operatorBtn.copy = false;
			  } 
			  item.operatorDate = window.timeFormdate(item.operatorDate);
			  return item;
		  });
		  let resData = result.data.list
		  //过滤掉红包插件   
		  resData.forEach(item => {
			  if(item.pluginNameList.length>0){
				item.pluginNameList.forEach((it,index)=>{
					if(it.type == 4){
						item.pluginNameList.splice(index,1)
					}
				})
			  }
		  });
		  _this.list.data =resData;
          _this.paginationOpt.totalCount = result.data.total;
          _this.paginationOpt.pageCount = Math.ceil(
            _this.paginationOpt.totalCount / _this.paginationOpt.pageSize
		  );
		  _this.activityTotal = result.data.count;
		  _this.searchTotal = result.data.total;
        } else {
          _this.$message.error(result.message);
        }
        !!cb && cb();
      });
    },
    search(data) {
      this.keyWords = data;
      this.paginationOpt.pageIndex = 1;
      this.list.data = [];
      this.getList();
    },
    pagesFn(pageIndex, cb) {
      //分页调用方法
      let _this = this;
      _this.paginationOpt.pageIndex = pageIndex;
      _this.getList(cb);
	},
	//预览
	preview(item){
	  createPreviewWindow(item.url, item.id);
	},
	// 复制活动
	copy(item){
		let self = this;
		this.$confirm("此操作将复制该活动，是否继续？", "提示", {
            center: true,
            confirmButtonText: "复制",
            cancelButtonText: "取消"
        })
		.then(() => {
			api.request("copyManuscript",{copyManuscriptId: item.id},
			function (result) {
				if (result.status !== 0) {
					Kdo.utils.messenger.error(result.message);
				} else {
					Kdo.utils.messenger.success("复制成功");
				}
				self.getList();
			});
		})
		.catch(() => { });
		
	},
	//编辑
	edit(item){
		let self = this;
		Kdo.utils.asyncOpenWindow(childWindow => {
			var routeData = self.$router.resolve({
				name: "design",
				query: { id: item.id, manuscriptType: item.manuscriptType }
			});
			childWindow.location = routeData.href;
		});
	},
	//删除
	remove(item) {
		let self = this;
		this.$confirm("此操作将永久删除该项目，是否继续？", "提示", {
            center: true,
            confirmButtonText: "删除",
            cancelButtonText: "取消"
        })
		.then(() => {
			api.request("deleteManuscript",{id: item.id || null},
			function (result) {
				if (result.status !== 0) {
					Kdo.utils.messenger.error(result.message);
				} else {
					Kdo.utils.messenger.success("删除成功");
				}
				self.getList();
			});
		})
		.catch(() => { });
	},
	// 修改活动状态
	modifyActivityStatus(item, status) {
		let self = this;
	  	api.request("modifyActivityStatus", {id: item.id, status: status},
		function (result) {
			if (result.status !== 0) {
				Kdo.utils.messenger.error(result.message);
			} else {
				Kdo.utils.messenger.success("状态修改成功");
			}
			self.getList();
		});
	},
	// 跳转任务详情
	jumpPlur(id) {
		this.$router.push({
        	path: "/plug-in?id=" + id
    	});
	}
  }
};
</script>
<style scoped>
.search-tip{
	position: absolute;
	top: 22px;
	right: 250px;
	font-size: 12px;
}
.search-option {
	width: 100%;
	height: 72px;
	padding: 21px;
}
.search-option >>> .el-form-item__content,
.search-option >>> .el-form-item__label,
.search-option >>> .el-input__icon{
	line-height: 32px;
}
.search-option >>> .el-form-item__label{
	color: #424242;
	font-weight: normal;
}
.search-option >>> .el-input__inner {
	height: 32px;
	border-radius: 0;
}
.search-option >>> .el-form--inline .el-form-item__content {
	vertical-align: none;
}
.list{
	height: 400px;
	margin: -34px auto 0;
}
.list .item{
	position: relative;
	width: 150px;
	height: 280px;
	background-color: rgba(0,0,0,.7);
	border:1px solid rgba(227, 230, 235, 1);
	float: left;
	margin: 0 10px;
	margin-top: 34px;
	overflow: hidden;
}
.list .item .mask{
	position: absolute;
	width: 100%;
	height: 250px;
	top: 0;
	left: 0;
	z-index: 1;
	display: none;
	background-color: rgba(0,0,0,.7);
}
.list .item.hover .mask{
	display: block;
	color: #fff;
}
.list .item .img{
	position: absolute;
	width: 100%;
	height: auto;
	background-color: #fff;
	z-index: 1;
}
.list .item .img img{
	width: 100%;
	height: 100%;
}
.list .item .introduce{
	position: absolute;
	width: 100%;
	bottom: 0;
	left: 0;
	background-color: #fff;
	z-index: 3;
}
.list .item .introduce .desc{
	width: 100%;
	height: 80px;
	padding: 13px 15px;
}
.list .item .introduce .desc .title{
	/* width: 168px; */
	font-size: 12px;
	color: #3C4A55;
	margin: 0 auto;
	overflow: hidden;
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.list .item .introduce .desc .time{
	width: 168px;
	color: #ACACAC;
	font-size: 12px;
	margin: 8px auto 0;
}
.list .item .introduce .operate{
	width: 100%;
	height: 29px;
	line-height: 29px;
	padding: 0 8px;
	box-sizing: border-box;
	background-color: rgba(241,243,252,1);
	display: none;
}
.list .item .introduce .operate img{
	width: 16px;
	height: 16px;
	margin-right: 5px;
	display: inline-block;
	cursor: pointer;
}
.list .item .introduce .operate img:nth-child(3){
	margin-right: 48px;
}
.list .item .introduce .operate img:last-child{
	margin: 0;
}
.list .item.hover .introduce .operate{
	display: block;
}
.list .item .flag{
	position: absolute;
	top: 0;
	right: 52px;
	z-index: 2;
}
.flag .sanjiao1,.flag .sanjiao2{
	position: absolute;
	width: 0;
	height: 0;
}
.flag.pause .sanjiao1,.flag.pause .sanjiao2{
	border:20px solid #00BAD0;
}
.flag.timeout .sanjiao1,.flag.timeout .sanjiao2{
	border:20px solid #FF5858;
}
.flag.proceed .sanjiao1,.flag.proceed .sanjiao2{
	border:20px solid #FF9000;
}
.flag.nostart .sanjiao1,.flag.nostart .sanjiao2{
	border:20px solid #00D473;
}
.flag .sanjiao1{
	top: 0;
	left: 0;
	border-right: 20px solid transparent !important;
	border-bottom: 5px solid transparent !important;
}
.flag .sanjiao2{
	top: 0;
	left: 0px;
	border-left: 20px solid transparent !important;
	border-bottom: 5px solid transparent !important;
}

.flag .text{
	width: 40px;
	position: absolute;
	top: 2px;
	left: 0px;
	color: #FFFFFF;
	font-size: 12px;
	text-align: center;
}
.option-btn {
	display: block;
	width: 89PX;
	height: 30px;
	line-height: 30px;
	margin: 0 auto;
	cursor: pointer;
	background-color: transparent;
}
.option-btn:hover {
	text-align: center;
	background-color: #24D0C6FF;
	border-radius:15px;
}
</style>