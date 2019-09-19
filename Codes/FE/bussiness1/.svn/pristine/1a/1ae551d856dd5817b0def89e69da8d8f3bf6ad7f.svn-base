<template>
    <div class="article-item">
        <div class="step1" v-if="step == 1">
			<div class="text-center" style="height: 50px;line-height: 50px;margin: 200px auto 74px;">
				<img style="display: inline-block;width: 62px;height: 50px;vertical-align: top;margin-right: 15px;" src="../assets/images/wx_chart.png">
				<span style="font-size: 26px;color: #3C4A55;">搜索微信文库</span>
			</div>
			<div class="text-center">
				<span style="display:inline-block;width: 500px;">
					<el-input placeholder="请输入内容、摘要、标题进行搜索" v-model="keywords" @keyup.native.enter.stop.prevent="toStep2">
						<el-button slot="append" icon="el-icon-search" @click="toStep2"></el-button>
					</el-input>
				</span>
			</div>
		</div>
		<div class="step2" v-else>
			<!-- <div class="top-tip">
				<span class="black-deep">搜索结果 <span style="color: #00BAD0;margin-left: 13px;">{{paginationOpt.totalCount}}</span></span>
				<span class="pull-right">
					<el-input placeholder="推小宝" v-model="keywords" @keyup.native.enter.stop.prevent="search">
						<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
					</el-input>
				</span>
			</div> -->
			<div class="loading" v-if="!!isloading">
				<img src="../assets/images/loading-300.gif" alt="">
			</div>
			<div class="list" v-if="!isloading && list.length > 0">
				<div class="list-item" v-for="(item,index) in list" :key="index">
					<div class="img-wrap pull-left">
						<img :src="item.imageUrl">
					</div>
					<div class="content">
						<div class="title font-16 black-deep ellipse" v-html="item.title" @click="urlSwitch(item.articleUrl)"></div>
						<div class="time font-12"><a @click="urlSwitch(item.publicUrl)"><span>{{item.publicName}}</span></a>  {{item.publicDate}}</div>
						<div class="desc font-12 black-light" v-html="item.desc"></div>
					</div>
					<div class="btn-wrap pull-right">
						<el-button class="pull-left" type="primary" size="small" @click="previeWxArticle(item)" :loading="item.loading">预览/发布</el-button>
					</div>
				</div>
				<pagination
					v-if="paginationOpt.pageCount > 1" 
					class="pull-right"
					:paginationOpt="paginationOpt"
					@switchPage="pagesFn"
					/>
			</div>
			<div v-if="!isloading && list.length == 0" style="margin-top:100px;">
				<emptyTpl />
			</div>
		</div>
		<div v-if="dialogOptions.visible">
			<releaseSetting :manuscript="manuscript" :dialogOptions="dialogOptions" type="2"/>
		</div>
			
    </div>
</template>
<script>
import pagination from "./ui-pagination";
import releaseSetting from "components/release-setting";
import emptyTpl from "components/empty-tpl";
import api from "api";
export default {
  name: "category",
  components: {
	  pagination,
	  releaseSetting,
	  emptyTpl
  },
  data() {
    return {
	  step: 1,
	  keywords:'',
	  list: [],
	  isloading: true,
	  paginationOpt: {
		totalCount: '',
		pageIndex: 1,
		pageSize: 10,
		pageCount: 10
	  },
	  manuscript: {
        id: "",
        name: "",
        description: "",
        cover: "",
        catIds: ""
	  },
	  previewUrl: '',
	  dialogOptions: {
		  visible: false
	  }
    };
  },
   watch: {
    // "navigatorOpts.selectedKey"(isReal) {
    //   this.articleItem = [];
    //    this.manuscriptTotal='';
    // },
  },
  mounted() {
    
  },
  methods: {
	  toStep2(data,val){
		  this.keywords= val? data:this.keywords
		 if(!this.keywords) return false;
		  this.step = 2;
		  this.paginationOpt.pageIndex = 1;
		  this.isloading = true;
		  this.getList();
	  },
	  getList(cb,data) {
		let _this = this;
		let option = {
			keywords:data || this.keywords,     
			page: this.paginationOpt.pageIndex
		}
		api.request("searchArticle", option)
        .then((result) => {
			_this.$emit("dataClick",result)
          if (result.status == 0) {
            _this.list = result.data.list.map((item) => {
				item.publicDate = window.timeFormdate(parseInt(item.publicDate) * 1000);
				item.loading = false;
				return item;
			});
			_this.paginationOpt.totalCount = !!result.data.total ? result.data.total.toString().replace(/,/g, '') : 0;
			_this.paginationOpt.totalCount = parseInt(_this.paginationOpt.totalCount) > 100 ? 100 : parseInt(_this.paginationOpt.totalCount);
			_this.paginationOpt.pageCount = Math.ceil(
				parseInt(_this.paginationOpt.totalCount) / _this.paginationOpt.pageSize
			);
          } else {
            _this.$message.error(result.message || result.data.error);
		  }
		  _this.isloading = false;
		  !!cb && cb();
        })
        .catch(function(error) {
          _this.$message.error(error.message);
        });
	  },
	//   search(){
	// 	  if(!this.keywords) return false;
	// 	  this.paginationOpt.pageIndex = 1;
	// 	  this.isloading = true;
	// 	  this.getList();
	//   },
	  pagesFn(pageIndex, cb){
		this.paginationOpt.pageIndex = pageIndex;
		this.getList(cb);
	  },
	  //地址转换
	  urlSwitch(url) {
		let _this = this;
		api.request("getArticleRealUrl", {'url': url})
        .then((result) => {
          if (result.status == 0) {
			window.open(result.data.wxUrl, "_blank");
          } else {
            _this.$message.error(result.message);
		  }
        })
	  },
	  previeWxArticle(item) {
		let _this = this;
		item.loading = true;
		api.request("previeWxArticle", {'url': item.articleUrl})
        .then((result) => {
          if (result.status == 0) {
			_this.manuscript = Object.assign(_this.manuscript, {
				id: "",
				name: result.data.title,
				description: result.data.descText,
				cover: result.data.descImg,
				catIds: "",
				htmlData: result.data.htmlData,
				manuscriptType: '3'
			});
			_this.previewUrl = result.data.wxUrl;
			_this.dialogOptions.visible = true;
          } else {
            _this.$message.error(result.message);
		  }
		  item.loading = false;
        }).catch((err) => {
		  _this.$message.error('接口错误，找涛哥');
		  item.loading = false;
		}) 
	  }	
	  
  }
};
</script>
<style scoped>
.article-item {
	height: calc(100vh - 70px);
}
.loading {
	text-align: center;
	margin-top: 20vh;
}
.loading img{
	width: 200px;
	height: 200px;
}
.article-item >>> .el-input-group--append .el-input__inner,
.article-item >>> .el-input-group__prepend{
	height: 40px;
	border-color: #E3E6EB;
	background-color: #fff;
}
.article-item >>> .el-input-group__append button.el-button{
	background-color: #00BAD0;
	border-top-left-radius: 0; 
	border-bottom-left-radius: 0;
}
.article-item >>> .el-input-group__append,.article-item >>>  .el-input-group__prepend{
	width: 60px;
	border-color: #00BAD0;
}
.article-item >>>  .el-input-group__append{
	background-color: #00BAD0;
}
.article-item >>> .el-input-group__append button.el-button{
	height: 40px;
}
.article-item .step1 >>> .el-icon-search {
	color: #fff;
	font-size: 18px;
}
.article-item .step2 >>> .el-input ,.article-item .step2 >>> .el-input--suffix .el-input__inner{
	width: 360px;
	height: 30px;
	line-height: 30px;
}
.article-item .step2 >>> .el-input__icon{
	line-height: 30px;
	font-size: 16px;
	color: #B8B8B8;
}
.top-tip{
	height: 30px;
	line-height: 30px;
	margin: 29px 0;
}
.article-item .step2 {
	padding: 0 21px;
}
.article-item .step2 .list{
	border: 1px solid #E3E6EB;
}
.article-item .step2 .list-item {
	position: relative;
	padding: 20px;
	height: 140px;
	overflow: hidden;
	border-bottom: 1px solid #E3E6EB;
}
.article-item .step2 .list-item:last-child{
	border: none;
}
.article-item .step2 .list-item > div {
	position: absolute;
}
.article-item .step2 .img-wrap {
	width: 235px;
	height: 100px;
	margin-right: 22px;
	left: 20px;
	overflow: hidden;
}
.article-item .step2 .img-wrap img {
	width: 100%;
	height: auto;
}
.article-item .step2 .btn-wrap {
	width: 208px;
	height: 100px;
	right: 20px;
}
.article-item .step2 .btn-wrap button{
	width: 100px;
	height: 34px;
	margin: 32px 54px;
}
.article-item .ellipse {
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.article-item .desc {
	overflow: hidden;
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.article-item .title{
	cursor: pointer;
	
}
.article-item .title:hover{
	text-decoration: underline;
}
.article-item .content {
	left: 275px;
	right: 280px;
}
.article-item .time {
	color: #ACACAC;
	margin: 16px 0 15px;
	cursor: pointer;
}

</style>