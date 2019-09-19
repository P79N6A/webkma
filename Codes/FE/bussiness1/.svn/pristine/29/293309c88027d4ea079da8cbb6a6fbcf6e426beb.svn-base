<template>
  <el-container class="employee-m">
    <!-- <el-header class="clear-padding">
            <pageTitle :pageTitle="pageTitleOpt" @search-event="search" />
    </el-header>-->
    <el-main class="ie-flex scroll-box" style="width:100%;overflow-x:hidden;">
      <div class="department" style="padding-right:30px;">
        <el-tree ref="departmentTree" icon-class='el-icon-remove' :data="departmentTree" :expand-on-click-node="false"
          node-key="id" highlight-current default-expand-all @node-click="selectDep">
          <span class="custom-tree-node" slot-scope="{ node, data }" style="position: relative;">
            <div v-if="!data.isEdit" class="node-label">{{ node.label }}</div>
            <el-input v-model="editDepObj.label" placeholder="请输入部门名称" :autofocus="true" v-if="data.isEdit"
              class="dep-name-input" maxlength="10"></el-input>
            <span class="emp-count" v-if="!data.isEdit">{{data.employeeCount}}</span>
            <span class="emp-btn" style="margin-left: 5px;">
              <el-button v-if="!data.isEdit" icon="iconfont icon-write" class="edit-btn"
                @click="()=>{actionDep=data;isShowActionMenu=true;}"></el-button>

              <!-- <el-popover placement="bottom-start" >
                <div class="action-menu" v-if="actionDep.id==data.id&&isShowActionMenu">
                  <div class="item" @click="() => addDepartment(data)" v-if="data.level<4">添加</div>
                  <div
                    class="item"
                    @click="() => updateDepartment(node,data)"
                    v-if="data.level!=1"
                  >修改</div>
                  <div
                    class="item"
                    @click="() => deleteDepartment(node, data)"
                    v-if="data.level!=1"
                  >删除</div>
                </div>
                <el-button
                  icon="iconfont icon-write"
                  class="edit-btn"
                  slot="reference"
                  @click="()=>{actionDep=data;isShowActionMenu=true;}"
                ></el-button>
              </el-popover>-->
              <div ref="actionMenu" nodetype="actionMenu" class="action-menu"
                v-if="actionDep.id==data.id&&isShowActionMenu">
                <div class="item" @click="() => addDepartment(data)" v-if="data.level<4">添加</div>
                <div class="item" @click="() => updateDepartment(node,data)" v-if="data.level!=1">修改</div>
                <div class="item" @click="() => deleteDepartment(node, data)" v-if="data.level!=1">删除</div>
              </div>
            </span>
          </span>
        </el-tree>
      </div>

      <div class="content-body clear-padding" style="width:86%;">
        <div style="width:100%;">
          <el-header class="clear-padding">
            <pageTitle :pageTitle="pageTitleOpt" />
          </el-header>
          <div style="padding:0 25px;">
            <el-row style="height:30px; line-height:30px; margin:10px 0; box-sizing: border-box; padding-left: 9px;">
              <span>
                <el-checkbox v-model="selectAll" @change="selectallFn">
                  <span class="btn-plain black-deep font-14" style="margin-right: 10px;">全选</span>
                </el-checkbox>
              </span>

              <span class="btn-plain color-blue font-14" v-if="isEnable" @click="setBatchState('0')">启用</span>
              <span class="btn-plain color-blue font-14 btn-disabeld" v-if="!isEnable">启用</span>
              <span class="btn-plain color-blue font-14" v-if="isState" @click="setBatchState('1')">禁用</span>
              <span class="btn-plain color-blue font-14 btn-disabeld" v-if="!isState">禁用</span>
              <span class="btn-plain btn-delete color-red font-14" v-if="selectionData.length > 0"
                @click="batchRemove()">删除</span>
              <span class="btn-plain color-blue font-14 btn-disabeld" v-else>删除</span>
              <span class="btn-plain color-blue font-14" @click="OpenImpDialog()">批量导入</span>
              <a target="_blank" :href="exportEmployee.tplUrl" class="export-btn">
                <span class="btn-plain color-blue font-14">批量导出</span>
              </a>
              <span class="btn-plain color-blue font-14" @click="openTransferEmployeeDialog()">移入员工</span>
              <span class="btn-plain color-blue font-14" v-if="isShowSetManager" @click="setManager()">设为boss</span>
              <span class="btn-plain color-blue font-14 btn-disabeld" v-if="!isShowSetManager">设为boss</span>
              <span class="btn-plain color-blue font-14" v-if="isShowCancel" @click="setManager(-1)">取消boss</span>
              <span class="btn-plain color-blue font-14 btn-disabeld" v-if="!isShowCancel">取消boss</span>
              <el-button class="pull-right" type="primary" size="mini" @click="addEmployee">新增员工</el-button>
              <el-input placeholder="输入关键字搜索" size="mini" class="pull-right"
                style="border-radius:none;width:200px;padding-right:10px;border:none" v-model="keyWords">
                <el-button slot="append" style="background:#00BAD0;color:#ffffff;border-radius:none;border:1px solid #00BAD0" size="mini"
                  @click="search">查询
                </el-button>
              </el-input>
            </el-row>
            <el-table ref="employeesTable" :data="list" tooltip-effect="dark" row-key="id" class="table"
              header-row-class-name="table-header" header-cell-class-name="table-header"
              @sort-change="sortChangeHandler">
              <el-table-column prop="active" width="50">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.active" @change="handleSelectionChange"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="员工姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                  <img class="headImg" :src="scope.row.face">
                  <div class="manager-icon" v-if="scope.row.isManager">BOSS</div>
                  <span v-text="scope.row.name"></span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="job" label="职位" align="center" class-name="number_color">
              </el-table-column>
              <el-table-column prop="phone" label="手机号码" align="center" class-name="number_color">
              </el-table-column>
              <el-table-column label="奖励金额" align="center" prop="rewardAmount" sortable class-name="number_color">
              </el-table-column>
              <el-table-column label="营销力排名" align="center" prop="marketing" sortable class-name="number_color">
                <template slot-scope="scope">
                  积分<span style="color:#F68411">{{scope.row.marketing || 0}}</span>排名 <span
                    style="color:#F68411">{{(scope.row.ranking!=-1?scope.row.ranking:'-' )|| '-'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="状态" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <slideBtn :slideBtnOpt="scope.row" @slide-event="setSingleState" />
                </template>
              </el-table-column>
              <el-table-column prop="address" label="操作" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                  <span><i class="btn-plain" @click="details(scope.row)">详情</i></span>
                  <span><i class="btn-plain" @click="edit(scope.row)">编辑</i></span>
                  <span><i class="btn-plain btn-delete" @click="singleRemove(scope.row)">删除</i></span>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt"
              @switchPage="pagesFn" />
          </div>
        </div>
      </div>
    </el-main>
    <el-dialog title="导入员工信息" v-if="importEmployee.visible" :visible.sync="importEmployee.visible" :center="true"
      :width="'600px'" @close="closeImpDialog">
      <el-row v-if="importEmployee.tpl == 'import'">
        <div class="clearfix checkFileBox">
          <label class="pull-left grey_blue_deep">导入联系人</label>
          <div class="pull-right" style="width: 265px;position: relative;">
            <label class="importFileName pull-left">{{importEmployee.fileName}}</label>
            <form enctype="multipart/form-data">
              <input ref="importFile" type="file" name="files" multiple="multiple"
                style="width: 70px;right: 0;height: 34px;position: absolute;opacity: 0;cursor: pointer;"
                class="input-upload detailUpImg" @change="importFileChange($event)">
              <el-button type="primary" size="small" style="width:70px;height:34px;">上传</el-button>
            </form>
          </div>
        </div>
        <div class="cust_importCon">
          <div class="cust_Directions clearfix">
            <span class="pull-left grey_light">导入说明:</span>
            <div class="pull-left">
              <p>1.EXCEL表格不能直接上传,需另存为*.xls或*.xlsx格式
                <br>2.上传的为纯文本内容，不能带有颜色，下划线，等格式。
                <br>
              </p>
              <a target="_blank" :href="importEmployee.tplUrl">下载数据导入模板</a>
            </div>
          </div>
        </div>
        <div class="btn_box clearfix" style="text-align:center;margin:40px auto 20px;">
          <el-button type="default" size="small" @click="closeImpDialog">取消</el-button>
          <el-button type="primary" size="small" @click="importEmployeeCheck">确定</el-button>
        </div>
      </el-row>

      <el-row v-else>
        <el-row style="text-align:center;margin:-10px auto 10px;">{{importEmployee.sucNum}}条导入成功</el-row>
        <el-row style="text-align:center;margin-bottom:20px;">{{importEmployee.failNum}}条导入失败！</el-row>
        <el-row style="text-align:center;">
          <el-button type="default" size="small" @click="closeImpDialog">确定</el-button>
        </el-row>
      </el-row>
    </el-dialog>
    <el-dialog title="移入员工" v-if="transferEmployee.visible" :visible.sync="transferEmployee.visible" :center="true"
      :width="'600px'" :close-on-click-modal="false" :close-on-press-escape="false"
      @close="closeTransferEmployeeDialog">
      <tree-transfer :title="['可移入员工', selectedDep.label]" :default-expanded-keys="[departmentTree[0].id]"
        :from_data="transferEmployee.fromData" :to_data="transferEmployee.toData" :defaultProps="{label:'label'}"
        :render-content="transferEmployeeTreeNodeRender" @addBtn="insertEmployee" @removeBtn="deleteEmployee"
        height="400px"></tree-transfer>
      <div class="text-center" style="margin-top:20px;">
        <el-button type="default" size="small" @click="closeTransferEmployeeDialog">取消</el-button>
        <el-button type="primary" size="small" :loading="transferEmployee.savingStatus"
          @click="saveTransferEmployeeDialog">保存</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import pageTitle from "../../components/page-title";
import slideBtn from "../../components/slide-btn";
import pagination from "../../components/ui-pagination";
import api from "api";
import defaultHead from "../../assets/images/default-headImg.png";
import httpConfig from "config/http";
import treeTransfer from "../../components/tree-transfer";

export default {
  components: {
    pageTitle,
    slideBtn,
    pagination,
    treeTransfer
  },
  name: "employee-management",
  data: function () {
    return {
      pageTitleOpt: {
        text: "员工列表",
        search: {
          value: "",
          placeholder: "请输入姓名/手机号搜索"
        },
        // showSearch: true
      },
      paginationOpt: {
        pageIndex: 1,
        pageSize: 8,
        totalCount: 0,
        pageCount: 0
      },
      selectionData: [],
      keyWords: "", //搜索关键字
      list: [], //员工列表数据
      selectAll: false, //全选

      departmentTree: [], //部门树
      editDepObj: {
        label: ""
      },
      selectedDep: {}, //选中部门
      actionDep: {}, //要操作部门
      isShowActionMenu: false,
      isShowInput: false,
      importEmployee: {
        //客户导入弹窗内容
        sucNum: "",
        failNum: "",
        visible: false,
        tpl: "import",
        fileName: "",
        tplUrl: ""
      },
      exportEmployee: {
        tplUrl:
          httpConfig.apiHost +
          "employee/download?session_id=" +
          localStorage.getItem("sessionId")
      },
      // 移入员工对象
      transferEmployee: {
        savingStatus: false,
        visible: false,
        allEmployeeList: [],
        fromData: [],
        toData: [],
        selected: []
      }
    };
  },
  computed: {
    isShowPop(data) {
      return function (data) {
        return this.actionDep.id == data.id && this.isShowActionMenu;
      };
    },
    isState(data) {
      let isShowon = true
      this.selectionData.find(item => {
        if (item.state == 1) {
          isShowon = false;
          return
        }
      })
      let state = (this.selectionData.length > 0 && isShowon) ? true : false
      return state;
    },
    isEnable(data) {
      let isEnableon = true
      this.selectionData.find(item => {
        if (item.state == 0) {
          isEnableon = false;
          return
        }
      })
      let state = (this.selectionData.length > 0 && isEnableon) ? true : false
      return state;
    },
    isShowCancel: function () {
      let isShow = true
      this.selectionData.find(item => {
        if (item.isManager != 1 && item.state != 1) {
          isShow = false;
          return
        }
        if (item.state == 1) {
          isShow = false;
          return
        }
      })
      let state = (this.selectionData.length > 0 && isShow) ? true : false
      return state;
    },
    isShowSetManager: function () {
      let isShow = true
      this.selectionData.find(item => {
        if (item.isManager == 1) {
          isShow = false;
          return
        }
        if (item.state == 1) {
          isShow = false;
          return
        }
      })
      let state = (this.selectionData.length > 0 && isShow) ? true : false
      return state;
    }
  },
  mounted() {
    this.hideActionMenu();
    return new Promise((resolve, reject) => {
      this.getDepartmentTreeAll(() => {
        resolve(true);
      });
    })
      .then(data => {
        this.getEmployeeList();
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    getDepartmentTreeAll(cb) {
      let _this = this;
      _this.actionDep.id = "";
      _this.editDepObj.label = "";
      let _option = { secret_key: localStorage.businessSecret };
      api.request("getDepartmentTreeAll", _option, result => {
        if (result.status == 0) {
          _this.departmentTree = result.data.map(item => {
            item.isEdit = false;
            return item;
          });
          if (!_this.selectedDep.id)
            _this.selectedDep = _this.departmentTree[0];
          setTimeout(() => {
            _this.$refs.departmentTree.setCurrentKey(_this.selectedDep.id);
          });
        } else {
          _this.$message.error(result.message);
        }
        !!cb && cb();
      });
    },
    addDepartment(data) {
      let _this = this;
      this.editDepObj.label = "";
      this.isShowActionMenu = false;
      const newChild = {
        id: 100000,
        label: "",
        children: [],
        parentId: data.id,
        isEdit: true
      };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
      setTimeout(() => {
        $(".custom-tree-node input").focus();
        $(".custom-tree-node input")
          .off("blur.add")
          .on("blur.add", () => {
            let _obj = {
              id: "",
              parentId: newChild.parentId,
              label: _this.editDepObj.label //$(".custom-tree-node input").val()
            };
            if (!_obj.label) {
              //没有填入数据自动删除节点
              const parent = data;
              const children = parent.children || parent;
              const index = children.findIndex(d => d.id === 100000);
              children.splice(index, 1);
              return;
            }
            this.saveDepartment(_obj);
          });
      }, 500);
    },
    updateDepartment(node, data) {
      let _this = this,
        _id = data.id,
        _parentId = data.parentId;
      this.isShowActionMenu = false;
      this.editDepObj.label = data.label;

      data.isEdit = true;
      data.employeeCount++; //暂时这样操作，为了唤起update
      data.employeeCount--;

      setTimeout(() => {
        $(".custom-tree-node input").focus();
        $(".custom-tree-node input")
          .off("blur.edit")
          .on("blur.edit", () => {
            let _obj = {
              id: _id,
              parentId: _parentId,
              label: _this.editDepObj.label
            };

            if (!_obj.label) {
              _this.getDepartmentTreeAll();
              return;
            }
            _this.saveDepartment(_obj);
          });
      }, 500);
    },
    //删除部门
    deleteDepartment(node, data) {
      let _this = this;
      this.$confirm("确定删除对应部门吗？", "提示", {
        center: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let _option = {
            secret_key: localStorage.businessSecret,
            ids: []
          };
          _option.ids.push(data.id);
          api.request("deleteDepartment", _option, result => {
            if (result.status == 0) {
              _this.getDepartmentTreeAll();
            } else {
              _this.$message.error(result.message);
            }
          });
        })
        .catch(() => { });
    },
    //编辑、保存部门
    saveDepartment(item) {
      //   debugger;
      let _this = this;
      let _option = {
        secret_key: localStorage.businessSecret,
        deptId: item.id,
        parentId: item.parentId,
        name: item.label
      };

      api.request("updateDepartment", _option, result => {
        if (result.status == 0) {
          _this.getDepartmentTreeAll();
        } else {
          _this.$message.error(result.message);
        }
      });
    },
    //选择部门
    selectDep(data, node, nodeTarget) {
      let _this = this;
      this.selectedDep = data;
      this.paginationOpt.pageIndex = 1;
      this.keyWords = "";
      this.getEmployeeList();
      // this.getEmployeeList(() => {}, {
      //   pageIndex: _this.paginationOpt.pageIndex,
      //   pageSize: _this.paginationOpt.pageSize,
      //   orderBy: _this.orderBys,
      //   deptId: _this.selectedDep.id
      // });
    },

    //获取员工列表
    getEmployeeList(cb, option) {
      let _this = this,
        _option = {};

      _this.selectAll = false;
      _this.selectionData = [];
      if (!!option) {
        _option = option;
      } else {
        _option = {
          pageIndex: _this.paginationOpt.pageIndex,
          pageSize: _this.paginationOpt.pageSize,
          keyWords: _this.keyWords,
          orderBy: _this.orderBys,
          deptId: _this.selectedDep.id
        };
      }
      if (!!_this.keyWords) {
        _option.deptId = ""
      }
      api.request("getEmployeeList", _option, result => {
        if (result.status == 0) {
          $.each(result.data.list, (index, item) => {
            item.createTime = item.createTime.replace(/-/, "/");
            item.face = item.face || defaultHead;
            item.active = false;
          });
          _this.list = result.data.list;
          _this.paginationOpt.totalCount = result.data.total;
          _this.paginationOpt.pageCount = Math.ceil(
            _this.paginationOpt.totalCount / _this.paginationOpt.pageSize
          );
        } else {
          _this.$message.error(result.message);
        }
        !!cb && cb();
      });
    },
    //搜索
    search(data) {
      let _this = this;
      this.paginationOpt.pageIndex = 1;
      // this.selectedDep = {};
      // this.getEmployeeList();
      this.getEmployeeList(() => { }, {
        pageIndex: _this.paginationOpt.pageIndex,
        pageSize: _this.paginationOpt.pageSize,
        orderBy: _this.orderBys,
        keyWords: _this.keyWords,
      });
    },
    //新增员工
    addEmployee() {
      var selDepName = encodeURIComponent(this.selectedDep.label);
      if (!!selDepName) {
        this.$router.push({
          path: "/add-employee",
          query: {
            selDepId: this.selectedDep.id,
            selDepText: encodeURIComponent(this.selectedDep.label)
          }
        });
      } else {
        this.$message({ type: "warning", message: "未选中部门！" });
      }

    },
    //分页调用方法
    pagesFn(pageIndex, cb) {
      let _this = this;
      _this.pagination = pageIndex;
      _this.getEmployeeList(cb);
    },
    //修改单个员工状态
    setSingleState(data) {
      let _option = {
        ids: [],
        state: data.state
      };
      _option.ids.push(data.id);
      this.setEmployeeState(_option);
    },
    //批量启用、禁用
    setBatchState(state) {
      let ids = this.getSelectIds();
      if (ids.length == 0) {
        this.$message({ type: "warning", message: "请选择人员！" });
        return false;
      }

      let _option = { ids, state };
      this.setEmployeeState(_option);
    },
    //修改员工状态（启用、禁用）
    setEmployeeState(option) {
      let _this = this;
      api
        .request(
          "setEmployeeState",
          Object.assign(option, { secret_key: localStorage.businessSecret })
        )
        .then(function (result) {
          if (result.status == 0) {
            _this.getEmployeeList();
          } else {
            _this.$message.error(result.message);
          }
        })
        .catch(function (error) {
          _this.$message.error(error.message);
        });
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
        this.getEmployeeList();
      }
    },
    // //全选
    selectallFn() {
      this.list.forEach(item => {
        item.active = this.selectAll;
      });
      this.handleSelectionChange();
    },
    //选择时，获取选中的数据对象
    handleSelectionChange() {
      this.selectionData = this.list.filter(item => {
        return item.active == true;
      });
      if (this.selectionData.length == this.list.length) {
        this.selectAll = true;
      }
      else {
        this.selectAll = false;
      }
    },
    //获取当前选中的对象id数组
    getSelectIds() {
      let ids = [];
      if (!!this.selectionData && this.selectionData.length > 0) {
        ids = this.selectionData.map(item => item.id);
      }
      return ids;
    },
    //设置BOOS
    setManager(type) {
      let _this = this;
      let ids = this.getSelectIds();
      let _option = {
        ids: ids,
        secret_key: localStorage.businessSecret,

        set: type == -1 ? false : true, //设置为boss传true 取消为fasle
      }
      api.request(
        "setManager",
        Object.assign(_option),
        result => {
          if (result.status == 0) {
            _this.$message({ message: "操作成功!", type: "success" });
            _this.getEmployeeList();
          } else {
            _this.myMessage.error(result.message);
          }
        }
      );
    },
    //批量删除
    batchRemove(item) {
      let ids = this.getSelectIds();
      if (ids.length == 0) {
        this.$message({ type: "warning", message: "请选择人员！" });
        return false;
      }
      this.removeEmployee(ids);
    },
    //删除单个员工
    singleRemove(item) {
      let ids = [item.id];
      this.removeEmployee(ids);
    },
    //跳转员工详情
    details(item) {
      this.$router.push({
        path: "/customer-details", //客户详情传1  员工详情传2
        query: {
          indexType: 2,
          id: item.user_id, //员工id
          business_id: item.businessId,
          employId: item.id
        }
      });
    },
    //删除员工
    removeEmployee(ids) {
      let _this = this;
      this.$confirm("确定删除对应员工？", "提示", {
        center: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          api
            .request("removeEmployee", {
              ids: ids,
              secret_key: localStorage.businessSecret
            })
            .then(function (result) {
              if (result.status == 0) {
                _this.$message({
                  message: "操作成功!",
                  type: "success"
                });
                _this.getDepartmentTreeAll();
                _this.getEmployeeList();
              } else {
                _this.$message.error(result.message || "操作失败!");
              }
            })
            .catch(function (error) {
              _this.$message.error(error.message);
            });
        })
        .catch(() => { });
    },
    //编辑
    edit(item) {
      this.$router.push({
        path: "/add-employee?id=" + item.id
      });
    },
    //查看提现记录
    queryWithdrawalLog(item) {
      this.$router.push({
        path: "/cash-management?id=" + item.id
      });
    },
    //弹出导入框
    OpenImpDialog() {
      this.importEmployee.tplUrl =
        httpConfig.apiHost +
        "employee/download/template?session_id=" +
        localStorage.getItem("sessionId");
      this.importEmployee.visible = true;
    },
    //导入客户input file change
    importFileChange(event) {
      let self = this;
      let file = event.currentTarget.files[0].name;
      if (!/\.xlsx?$/i.test(file)) {
        self.$message.error("请选择以.xlsx或以.xls结尾的文件！");
        $(event.currentTarget).val("");
        return false;
      }
      self.importEmployee.fileName = file;
    },
    //确定导入客户
    importEmployeeCheck() {
      var self = this;
      var obj = self.$refs.importFile;
      var file = obj.files[0];
      if (self.uploading) return;
      if (!file) {
        self.$message.error("请选择要导入的文件！");
        return false;
      }

      var formData = new FormData($(obj).parent()[0]);

      // var formData = new FormData();
      //     formData.append("file",$("#FileUpload")[0].files[0]);
      formData.append("deptId", this.selectedDep.id);

      //   debugger
      //   formData = Object.assign(formData, { deptId: this.selectedDep.id });
      // 加锁
      self.uploading = true;
      api
        .request("importEmployee", formData)
        .then(result => {
          if (result.status == 0) {
            self.importEmployee.sucNum = result.data.success;
            self.importEmployee.failNum = result.data.fail;
            self.importEmployee.tpl = "import-result";
            // self.getCustomerList();
            self.getDepartmentTreeAll();
            self.getEmployeeList();
          } else {
            self.$message.error(result.message);
          }
          $(obj).val("");
          self.importEmployee.fileName = "";
          // 解锁
          delete self.uploading;
        })
        .catch(err => {
          $(obj).val("");
          self.importEmployee.fileName = "";
          // 解锁
          delete self.uploading;
          //   self.$message.error("导入失败！");
        });
    },
    //关闭导入框
    closeImpDialog() {
      this.importEmployee.sucNum = "";
      this.importEmployee.failNum = "";
      this.importEmployee.fileName = "";
      this.importEmployee.tpl = "import";
      this.importEmployee.visible = false;
    },
    transferEmployeeTreeNodeRender(h, { node, data, store }) {
      return (
        <span class="transfer-empl-tree-node">
          <div class={"image-icon " + data._type} />
          <span>{node.label}</span>
        </span>
      );
    },
    openTransferEmployeeDialog() {
      let self = this;
      self.transferEmployee.visible = true;
      api.request(
        "getAllEmployeeByBiz",
        { secret_key: localStorage.businessSecret },
        result => {
          if (result.status == 0) {
            self.transferEmployee.allEmployeeList = result.data;
            self.transferEmployee.fromData = self.generateDeptEmplTree();
          } else {
            self.$message.error(result.message);
          }
        }
      );
    },
    closeTransferEmployeeDialog() {
      let self = this;
      self.transferEmployee = {
        savingStatus: false,
        visible: false,
        allEmployeeList: [],
        fromData: [],
        toData: [],
        selected: []
      };
    },
    saveTransferEmployeeDialog() {
      let self = this;
      if (self.transferEmployee.selected.length == 0) return;
      self.transferEmployee.savingStatus = true;
      api.request(
        "transferEmployee",
        {
          ids: self.transferEmployee.selected,
          deptId: self.selectedDep.id,
          secret_key: localStorage.businessSecret
        },
        result => {
          if (result.status == 0) {
            self.transferEmployee.savingStatus = false;
            Kdo.utils.messenger.success("员工转移成功");
            self.closeTransferEmployeeDialog();
            self.getEmployeeList();
            self.getDepartmentTreeAll();
          } else {
            self.$message.error("员工转移失败，请重试");
            console.error(result.message);
          }
        }
      );
    },
    insertEmployee(fromData, toData, obj) {
      let self = this;
      self.transferEmployee.selected = (
        self.transferEmployee.selected || []
      ).concat(
        obj.nodes
          .filter(node => {
            return node._type == "empl";
          })
          .map(node => {
            return node.id;
          })
      );
      self.transferEmployee.fromData = self.generateDeptEmplTree();
      self.transferEmployee.toData = self.generateSelectedEmpl();
    },
    deleteEmployee(fromData, toData, obj) {
      let self = this;
      self.transferEmployee.selected = self.transferEmployee.selected.filter(
        item => {
          return !obj.keys.includes(item);
        }
      );
      self.transferEmployee.fromData = self.generateDeptEmplTree();
      self.transferEmployee.toData = self.generateSelectedEmpl();
    },
    generateDeptEmplTree() {
      let self = this,
        buildData = node => {
          return node.map(dept => {
            return {
              _pid: dept.parentId,
              _type: "dept",
              id: dept.id,
              pid: dept.parentId,
              label: dept.label,
              children: buildData(dept.children || []).concat(
                self.transferEmployee.allEmployeeList
                  .filter(empl => {
                    return (
                      empl.deptId == dept.id &&
                      !(self.transferEmployee.selected || []).includes(
                        empl.emplId
                      )
                    );
                  })
                  .map(empl => {
                    return {
                      _pid: empl.emplId,
                      _type: "empl",
                      id: empl.emplId,
                      pid: empl.deptId,
                      label: empl.name
                    };
                  })
              )
            };
          });
        };
      return buildData(self.departmentTree);
    },
    generateSelectedEmpl() {
      let self = this;
      return self.transferEmployee.selected == 0
        ? []
        : self.transferEmployee.allEmployeeList
          .filter(empl => {
            return (self.transferEmployee.selected || []).includes(
              empl.emplId
            );
          })
          .map(empl => {
            return {
              _pid: empl.emplId,
              _type: "empl",
              id: empl.emplId,
              pid: empl.deptId,
              label: empl.name
            };
          });
    },
    //点击其他区域隐藏菜单栏
    hideActionMenu() {
      let self = this;
      $('.employee-m')
        .unbind("click")
        .bind("click", function () {
          var actionMenu = self.$refs.actionMenu;
          if ($(this).attr("nodetype") != $(actionMenu).attr("nodetype")) {
            self.isShowActionMenu = false;
          }
        });
    }
  }
};
</script>
<style>
.ie-flex {
  display: flex;
  display: -ms-flexbox;
}
.employee-m >>> .el-input-group__append .el-button{
  border-radius: 0
}
.employee-m {
  padding: 0;
  height: calc(100vh - 70px);
}
.employee-m .el-main {
  padding: 0;
}
.employee-m .page-title {
  padding: 0 18px 0 25px !important;
}

.employee-m .search-wrap input {
  font-size: 12px;
}
.employee-m .department {
  padding: 40px 0 60px 10px;
  max-width: 275px;
  float: left;
}
.employee-m .department .icon-class {
  background-image: url("../../assets/images/employee/manager-icon.png");
}

.employee-m .department .dep-name-input {
  height: 26px;
}
.employee-m .department .dep-name-input input {
  background-color: #eff7fa;
  border: 0;
  font-size: 12px;
  height: 26px;
  padding: 0 0 0 5px;
  margin-left: -5px;
}
.employee-m .icon-write {
  font-size: 12px;
}
.employee-m .department .emp-count {
  margin-left: 6px;
  color: #b1bfcd;
}
.employee-m .department .edit-btn {
  width: 12px;
  height: 12px;
  line-height: 12px;
  font-size: 12px;
  padding: 0;
  border: 0;
  color: #888;
}

.employee-m .department .edit-btn:hover {
  background-color: #fff;
}
.employee-m .department .edit-btn:visited {
  background-color: #fff;
}
.employee-m .department .edit-btn:active {
  /* color: #fff; */
  background-color: #fff;
}

.employee-m .department .action-menu {
  width: 70px;
  /* height: 100px; */
  position: absolute;
  text-align: center;
  padding: 3px;
  /* padding-bottom: 0; */
  border: 1px solid #ebeef5;
  background-color: #fff;
  right: -61px;
  z-index: 2;
  box-shadow: 0px 0px 10px 3px #ebeef5;
}

.employee-m .department .action-menu .item {
  height: 32px;
  line-height: 32px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
}

.employee-m .department .action-menu .item:hover {
  background-color: #f4f9fb;
}

.employee-m .department .action-menu .item:last-child {
  border: 0;
}

/* .department .node-label:hover {
  color: #00bad0;
}
.department .node-label:active {
  color: #00bad0;
} */

.employee-m .content-body {
  width: 100%;
  min-width: 800px;
  /* width: 100%; */
  padding: 25px;
  border-left: 10px solid #eff7fa;
  height: calc(100vh - 70px);
  max-height: calc(100vh - 70px);
  /* overflow: hidden; */
  float: left;
}
.employee-m .content-body .headImg {
  width: 40px;
  height: 40px;
}
.employee-m .content-body .manager-icon {
  display: inline-block;
  height: 15px;
  background: #fa766b;
  font-size: 10px !important;
  color: rgba(255, 255, 255, 1);
  line-height: 15px;
  border-radius: 8px;
  margin-left: 8px;
  padding: 0 3px 0 3px;
  text-align: center;
}

.employee-m .content-body .export-btn {
  margin: 0 15px;
}
.employee-m .content-body .export-btn:hover {
  text-decoration: none;
}

.employee-m .checkFileBox {
  width: 370px;
  margin: 10px 0 0 23px;
  height: 34px;
  line-height: 34px;
}

.employee-m .checkFileBox .importFileName {
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

.employee-m .cust_importCon {
  width: 490px;
  margin: 10px auto 20px;
  height: auto;
}

.employee-m .cust_tag_list {
  width: 550px;
  margin: 20px auto 0;
  min-height: 40px;
  padding-left: 12px;
}

.employee-m .checkFileBox label {
  font: normal 14px/33px "Microsoft YaHei";
  display: block;
  width: 100px;
  text-align: right;
  padding-right: 4px;
  font-weight: normal;
}

.employee-m .cust_Directions span {
  width: 100px;
  line-height: 22px;
  font-size: 14px;
  text-align: right;
  padding-right: 10px;
}

.employee-m .cust_Directions p {
  color: #728492;
  line-height: 22px;
}

.employee-m .cust_Directions a {
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

.employee-m .custom-tree-node .node-label {
  max-width: 170px;
  height: 16px;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
}
.employee-m .el-tree-node > .el-tree-node__children {
  overflow: inherit !important;
}
.employee-m .el-tree-node__content {
  height: 26px;
}
.employee-m .el-tree-node__content .emp-btn {
  /* display: none; */
  visibility: hidden;
}

.employee-m .el-tree-node__content:hover .emp-btn {
  /* display: inline-block; */
  visibility: visible;
}

.employee-m .transfer-empl-tree-node {
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  color: #606266;
}

.employee-m .transfer-empl-tree-node .image-icon {
  margin: 4px 4px 0 0;
  float: left;
  width: 16px;
  height: 16px;
}
.employee-m .transfer-empl-tree-node .image-icon.dept {
  background: url(../../assets/images/department.png) no-repeat;
  background-size: 16px;
}
.employee-m .transfer-empl-tree-node .image-icon.empl {
  background: url(../../assets/images/person.png) no-repeat;
  background-size: 16px;
}
.employee-m .el-table--enable-row-transition .el-table__body td {
  padding: 10px 0;
}
</style>



