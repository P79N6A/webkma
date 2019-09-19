<template>
  <el-container class="customer-box">
    <el-main style="padding: 0 20px;">
      <el-row style="height:30px; line-height:30px; margin:16px 0; box-sizing: border-box; padding-left: 9px;">
        <!-- <el-col :span="8">
                  <div class="grid-content bg-purple-dark">
                    <span>
                        <el-checkbox v-model="selectAll" @change="selectallFn">
                            <span class="btn-plain black-deep font-14" style="margin-right: 10px;">全选</span>
                        </el-checkbox>
                    </span>
                  </div>
                </el-col> -->
        <el-col :span="24" style="display:flex; justify-content:flex-end; height:30px;">
          <div class="pull-down mr-10">
            <el-select v-model="sourceValue" @change="getSource(sourceValue)">
              <el-option v-for="item in sourceList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="pull-down mr-10">
            <el-select v-model="stateValue" @change="getState(stateValue)">
              <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="pull-down mr-10">
            <el-select v-model="levelValue" @change="getLevel(levelValue)">
              <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-box">
            <input type="text" class="form-control"
              style="width:240px; height:30px; border-color:#B1BFCD; border-right:0px;" placeholder="输入关键字搜索"
              v-model="keyWords">
            <span class="search-btn" @click="search">查询</span>
          </div>
        </el-col>
      </el-row>
      <el-table ref="customerTable" :data="list" tooltip-effect="dark" style="min-width: 1000px;" row-key="id"
        class="table" header-row-class-name="table-header" header-cell-class-name="table-header"
        @sort-change="sortChangeHandler">
        <!-- <el-table-column
                prop="active"
                width="55">
                    <template slot-scope="scope" >
                        <el-checkbox v-model="scope.row.active" @change="handleSelectionChange"></el-checkbox>
                    </template>
                </el-table-column> -->
        <el-table-column label="昵称/身份" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            <div style="display: flex; margin:10px 0;">
              <div>
                <img style="width:40px;height:40px;margin-right:12px;border-radius:40px;" :src="scope.row.userFace" />
              </div>
                 <div class="manager-icon" v-if="scope.row.is_koc!=0">KOC</div>
              <div class="font-12">
                <p class="black-deep ellipsis">{{scope.row.nickname}}</p>
                <p class="tipText-color ellipsis">{{scope.row.job==null?'':(scope.row.name + '/' + scope.row.job)}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="marketing" label="营销力积分" sortable='custom' align="center" width="150">
          <template slot-scope="scope">
            <span>积分</span>
            <span class="yellow-num" style="line-height:20px;margin:0 3px;">{{scope.row.marketing_power || '-'}}</span>
            <span>排名</span>
            <span class="yellow-num">{{(scope.row.ranking=='-1'?'-':scope.row.ranking) || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" align="center" width="150">
          <template slot-scope="scope">
            {{scope.row.phone || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="transaction_amount" label="成交金额" sortable align="center">
          <template slot-scope="scope">
            <span class="red-light">￥ {{scope.row.transaction_amount==null?'0':scope.row.transaction_amount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户级别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.level==1">普通客户</span>
            <span v-if="scope.row.level==2">一般客户</span>
            <span v-if="scope.row.level==3">重要客户</span>
          </template>
        </el-table-column>
        <el-table-column label="客户状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">微信潜客</span>
            <span v-if="scope.row.status==2">初步沟通</span>
            <span v-if="scope.row.status==3">见面拜访</span>
            <span v-if="scope.row.status==4">确定意向</span>
            <span v-if="scope.row.status==5">正式报价</span>
            <span v-if="scope.row.status==6">签约成功</span>
          </template>
        </el-table-column>
        <el-table-column label="客户来源" prop="from_name" align="center">
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <p>{{(scope.row.create_time).trim().split(" ")[0]}}</p>
            <p class="tipText-color">{{(scope.row.create_time).trim().split(" ")[1]}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="btn-plain" @click="detail(scope.row)">详情</i>
            <!-- <i class="btn-plain btn-delete" @click="singleRemove(scope.row)">删除</i> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt"
        @switchPage="pagesFn" />
    </el-main>
  </el-container>
</template>

<script>
import pagination from "../../components/ui-pagination";
import api from "api";
import defaultHead from "../../assets/images/default-headImg.png";
import eventBus from "../../utils/eventBus";
import httpConfig from "../../config/http";

export default {
  components: {
    pagination
  },
  name: "employee-management",
  data: function () {
    return {
      sourceList: [ //来源选择框
        {
          value: '',
          label: '全部来源'
        },  {
          value: 1,
          label: '名片'
        }, {
          value: 2,
          label: '活动'
        },{
          value: 3,
          label: '文章'
        }],
      sourceValue: '',
      stateList: [{ //状态选择框
        value: '',
        label: '全部状态'
      }, {
        value: 1,
        label: '微信潜客'
      }, {
        value: 2,
        label: '初步沟通'
      }, {
        value: 3,
        label: '见面拜访'
      }, {
        value: 4,
        label: '确定意向'
      }, {
        value: 5,
        label: '正式报价'
      }, {
        value: 6,
        label: '签约成功'
      }],
      stateValue: '',
      levelList: [{ //级别选择框
        value: '',
        label: '全部级别'
      }, {
        value: 1,
        label: '普通客户'
      }, {
        value: 2,
        label: '一般客户'
      }, {
        value: 3,
        label: '重要客户'
      }],
      levelValue: "",
      pageTitleOpt: {
        text: "客户列表",
        search: {
          value: "",
          size: "350px",
          placeholder: "请输入微信昵称/绑定手机号/推广人员进行搜索"
        },
        showSearch: true
      },
      paginationOpt: {
        //列表分页参数
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageCount: 0
      },
      keyWords: "",
      list: [],
      selectionData: [], //选中的客户
      selectAll: false //全选
    };
  },
  mounted() {
    this.getCustomerList();
  },
  methods: {
    getSource(event) {
      let self = this;
      self.sourceValue = event;
      self.getCustomerList({
        from_type: self.sourceValue,
      })
    },
    getState(event) {
      let self = this;
      self.stateValue = event;
      self.getCustomerList({
        status: self.stateValue,
      })
    },
    getLevel(event) {
      let self = this;
      self.levelValue = event;
      self.getCustomerList({
        level: self.levelValue,
      })
    },
    //获取客户列表
    getCustomerList(json, cb) {
      let _this = this;
      let obj = !!json && json.obj || '';
      let _option = {
        pageIndex: _this.paginationOpt.pageIndex,
        pageSize: _this.paginationOpt.pageSize,
        keyword: !!obj ? obj.keyword : _this.keyWords,
        orderBy: _this.orderBys,
        from_type: !!obj ? obj.sourceValue : _this.sourceValue,
        status: !!obj ? obj.stateValue : _this.stateValue,
        level: !!obj ? obj.levelValue : _this.levelValue
      };
      api.request("customerList", _option, result => {
        if (result.status == 0) {
          if (result.data.list.length == 0 && result.data.total > 0) {
            _this.paginationOpt.pageIndex = _this.paginationOpt.pageIndex - 1;
            _this.getCustomerList();
            return false;
          }
          $.each(result.data.list, (index, item) => {
            item.userFace = item.face || defaultHead;
            item.active = false;
            _this.$set(item,item.marketing_power,result.data.list)
          });
          
          _this.list = result.data.list;
          // _this.list=[{"level":1}]
          _this.paginationOpt.totalCount = result.data.total;
          _this.paginationOpt.pageCount = Math.ceil(
            _this.paginationOpt.totalCount / _this.paginationOpt.pageSize
          );
        } else {
          _this.$message.error(result.message);
        }
        !!cb && cb();
      });
      this.selectionData = [];
      this.selectAll = false;
    },
    //搜索
    search() {
      let self = this;
      self.paginationOpt.pageIndex = 1;
      self.getCustomerList({
        keyword: self.keyWords,
        from_type: self.sourceValue,
        status: self.stateValue,
        orderBy: self.orderBys,
        level: self.levelValue
      });
    },
    //分页调用方法
    pagesFn(pageIndex, cb) {
      let _this = this;
      _this.paginationOpt.pageIndex = pageIndex;
      _this.getCustomerList({}, cb);
    },
    //排序
    sortChangeHandler(orderBy) {
      let { order, prop } = orderBy;
      if (!!prop) {
        this.orderBys = [
          {
            [prop]: order === "descending" ? "desc" : "asc"
          }
        ];
        this.getCustomerList();   
      }
    },
    //删除单个客户
    // singleRemove(item) {
    //   var ids = item.id;
    //   this.removeCustomer(ids);
    // },
    //删除客户
    removeCustomer(ids) {
      let _this = this;
      this.$confirm("确定删除对应客户?", "提示", {
        center: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        api
          .request("customerDelete", {
            ids: ids
          })
          .then(function (result) {
            if (result.status == 0) {
              _this.$message({
                message: "操作成功!",
                type: "success"
              });
              _this.getCustomerList();
            } else {
              _this.$message.error(result.message || "操作失败!");
            }
          })
          .catch(function (error) {
            _this.$message.error(error.message);
          });
      });
    },
    detail(item) {
      this.$router.push({
        path: "/customer-details?",
        query: {
          business_id: item.business_id,
          // 客户id
          id: item.user_id,
          // 员工id
          rootUserId: item.ser_user_id,
          // 任务id
          taskId: item.from_id,
          indexType:1,//客户详情传1  员工详情传2
          // 主键id
          keyID: item.id
        }
      });
    },
  }
};
</script>
<style scoped>
/* 公共样式 */
.mr-10 {
  margin-right: 10px;
}
 .manager-icon {
  display: inline-block;
  height: 15px;
  background: #F68411;
  font-size: 10px !important;
  color: rgba(255, 255, 255, 1);
  line-height: 15px;
  border-radius: 8px;
  padding: 0 3px 0 3px;
  text-align: center;
  margin-top:5px;
  margin-right: 3px;
}
.ellipsis{
  width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 组件样式 */
.customer-box >>> .el-input__inner {
  background-color: #fff;
}
.customer-box >>> .el-input--suffix .el-input__inner {
  width: 130px;
  height: 30px;
  color: #9eabb8;
  border-radius: 0;
  border-color: #b1bfcd;
}
.customer-box >>> .el-input__icon {
  line-height: 30px;
}
.customer-box >>> .table-header {
  background-color: #f7fbfc !important;
}
.customer-box >>> .el-table .el-table__row:nth-child(even) {
  background-color: #f7fbfc;
}

/* 内容样式 */
.search-box {
  display: flex;
  width: 304px;
}
.form-control {
  border-radius: 0;
  border: 1px solid #bbbec3;
  box-shadow: none;
}
.search-btn {
  display: inline-block;
  width: 64px;
  height: 30px;
  line-height: 30px;
  background: #01bacf;
  border-radius: 0 4px 4px 0;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
.checkFileBox {
  width: 370px;
  margin: 10px 0 0 23px;
  height: 34px;
  line-height: 34px;
}
.checkFileBox .importFileName {
  width: 185px;
  height: 34px;
  font: normal 12px/33px "Microsoft YaHei" !important;
  border: 1px solid #c4ced8;
  border-radius: 3px;
  color: #a0a0a0;
  text-indent: 5px;
  background: url(../../assets/images/ipm_name_bg.jpg) no-repeat;
  padding-right: 25px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
  margin-right: 10px;
}

.cust_importCon {
  width: 490px;
  margin: 10px auto 20px;
  height: auto;
}

.cust_tag_list {
  width: 550px;
  margin: 20px auto 0;
  min-height: 40px;
  padding-left: 12px;
}

.checkFileBox span {
  font: normal 14px/33px "Microsoft YaHei";
  display: block;
  width: 100px;
  text-align: right;
  padding-right: 4px;
}

.cust_Directions span {
  width: 100px;
  line-height: 22px;
  font-size: 14px;
  text-align: right;
  padding-right: 10px;
}

.cust_Directions p {
  color: #728492;
  line-height: 22px;
}

.cust_Directions a {
  background: #f6f7fc;
  border: 1px solid #c4ced8;
  color: #3c4a55;
  width: 120px;
  height: 30px;
  line-height: 30px;
  display: block;
  text-align: center;
  border-radius: 3px;
  text-decoration: none;
  margin-top: 10px;
}
</style>





