<template>
	<div class="bussiness-detail">
		<el-collapse v-model="activeName">
		<el-collapse-item name="1">
			<template slot="title">
			<i class="header-icon el-icon-info" style="margin: 0 6px;"></i>设计师详情
			</template>
			<div class="label-info">
				<el-row class="business-block">
					<el-row class="business-block-title">{{!bussinessDate.businessId ? '注册': '编辑'}}账号</el-row>
					<el-row class="business-block-body">
						<el-form ref="form" :model="bussinessDate" label-width="120px" class="block-wrap">
							<el-form-item label="设计师姓名">
								<el-input v-model="bussinessDate.businessName" placeholder="请输入设计师姓名"></el-input>
								<span class="help-inline">设计师姓名</span>
							</el-form-item>
							<el-form-item label="账号">
								<el-input v-model="bussinessDate.businessPhone" placeholder="用于登录的手机号"></el-input>
								<span class="help-inline">账号</span>
							</el-form-item>
							<el-form-item label="密码">
								<el-input type="text" onfocus="this.type='password'" v-model="bussinessDate.voucher" autocomplete="off" placeholder="请输入密码"></el-input>
								<span class="help-inline">6-20位，至少包含字母、数字、符号任意两项</span>
							</el-form-item>
							<el-form-item label="确认密码">
								<el-input type="text" onfocus="this.type='password'"  v-model="revoucher" autocomplete="off" placeholder="请确认密码"></el-input>
								<span class="help-inline">6-20位，至少包含字母、数字、符号任意两项</span>
							</el-form-item>
						</el-form>
					</el-row>
				</el-row>
			</div>
		</el-collapse-item>
		</el-collapse>
		<el-row class="text-center" style="margin:20px 0;">
			<el-button type="primary" @click="submit">确定{{!bussinessDate.businessId ? '创建': '修改'}}</el-button>
		</el-row>
	</div>
</template>
<script scope>
import api from "../../axios/api-service";
import upload from '../../components/com-upload'
export default {
	name:'bussiness-detail',
	components: { upload },
	data() {
		return {
			activeName: '1',
			isEdit: false, //是否编辑
			bussinessDate: {
				"businessId": "",
				"businessName": "",//公司名称
				"businessPhone": "",//用户名
				"voucher": "", //密码
				"businessType": "2"
			},
			revoucher: '' //重复密码 
		}
	},
	mounted(){
		this.isEdit = this.$route.query.edit || false;
		this.bussinessDate.businessId = this.$route.query.businessId || '';
		if(this.isEdit) this.getDetail();
	},
	methods: {
		//获取商家详情
		getDetail() {
			let _this = this;
			let _option = {
				businessId: _this.bussinessDate.businessId
			}
			api.request("getBussinessInfo", _option, result => {
				if (result.status == 0) {
					_this.bussinessDate = Object.assign({}, result.data[0]);
				} else {
					_this.messenger.error(result.message);
				}
			});
		},
		//上传图片回调
		uploadCb(data) {
			this.bussinessDate = Object.assign(this.bussinessDate, data);
		},
		//表单验证
		_fomvalidation(){
			var _tag = true
				, regArr = [
					{ type: 'businessName', reg: /^[a-zA-Z\u4e00-\u9fa5]{2,10}$/ },
                    { type: 'businessPhone', reg: /^1[0-9]{10}$/ },
                    { type: 'voucher', reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z@_~\!#\$%\^&\*\(\)-=\+\?]{6,20}$/ }
				];
			if (_tag && !this.bussinessDate.businessName) {
				this.messenger.error('请输入设计师姓名！');
				_tag = false;
			} else if (_tag && !regArr[0].reg.test(this.bussinessDate.businessName)) {
				this.messenger.error('设计师姓名由2～10个中文、英文字符组成！');
				_tag = false;
			}
			if (_tag && !this.bussinessDate.businessPhone) {
				this.messenger.error('请输入手机号！');
				_tag = false;
			} else if (_tag && !regArr[1].reg.test(this.bussinessDate.businessPhone)) {
				this.messenger.error('请输入正确的手机号');
				_tag = false;
			}
			if (this.isEdit == false) {
				if (_tag && !this.bussinessDate.voucher) {
					this.messenger.error('请输入密码！');
					_tag = false;
				} else if (_tag && !regArr[2].reg.test(this.bussinessDate.voucher)) {
					this.messenger.error('密码6-20位，至少包含字母、数字、符号任意两项！');
					_tag = false;
				}
				if (_tag && !!this.bussinessDate.voucher && !this.revoucher) {
					this.messenger.error('请输入确认密码！');
					_tag = false;
				} else if (_tag && !!this.bussinessDate.voucher && this.bussinessDate.voucher != this.revoucher) {
					this.messenger.error('两次密码输入不一致，请重新输入！');
					_tag = false;
				}
			}
			return _tag;
		},
		//提交
		submit() {
			let _this = this;
            this._lock = false;
			if (!this._fomvalidation()) { return false; }
			if (_this._lock) {
				return false;
			}
			_this._lock = true;
			api.request("savebusiness", _this.bussinessDate, result => {
				if (result.status == 0) {
					_this.messenger.success((_this.isEdit ? '修改' : '新增') + '成功!');
					this.$router.push({
						path: `/designer-list`
					});
				} else {
					_this.messenger.error(result.message);
				}
				_this._lock = false;
			});
		}
	}
}
</script>
<style scoped>
.bussiness-detail {
	padding: 10px 20px 0;
}
.bussiness-detail >>> .el-collapse .el-collapse-item{
    border: 1px solid #555!important;
  }
  .bussiness-detail >>> .el-collapse .el-collapse-item .el-collapse-item__header{
    height: 41px;
    font-size: 18px;
    color: #fff;
    background-color: #555;
    border-bottom: none;
    overflow: hidden;
  }
  .bussiness-detail >>> .el-collapse .el-collapse-item .el-collapse-item__content{
    padding: 30px!important;
  }
  .bussiness-detail >>> .el-collapse .el-collapse-item .el-button{
    padding: 8px 12px!important;
    border-radius: 0; 
  }
  .bussiness-detail >>> .el-collapse .el-input__inner{
    height: 32px;
    line-height: 32px;
    border-radius: 0;
    margin-right: 10px;
  }
  .bussiness-detail >>> .el-row .grid-content{
    background-color: #fafafa!important;
    padding: 25px;
    margin: 8px;
  }



.business-block {
    width: 100%;
    min-width: 900px;
    height: auto;
    overflow: hidden;
}

.form_upload {
	width: 142px;
	float: left;
	margin-right: 10px;
}

.help-inline {
    font-size: 13px;
    color: #737373;
    display: inline-block;
}

.business-block-title {
    width: 100%;
    height: 54px;
    line-height: 54px;
    border: 1px solid #e7ecf1 !important;
    padding: 0 20px;
}

    .business-block-title .icon-settings {
        float: left;
        margin: 20px 5px 0 0;
    }

.business-block-body {
    overflow: hidden;
    border: 1px solid #e7ecf1;
    border-top: none;
    padding-top: 20px;
    padding-bottom: 20px;
    overflow: hidden;
}

    .business-block-body .block-wrap {
        width: 900px;
        margin: 0 auto;
    }

    .business-block-body >>> .el-input__inner {
		width: 320px;
	}
	.business-block-body >>> .el-input {
		width: 320px;
		margin-right: 10px;
	}
</style>

