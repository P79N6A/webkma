// pages/cash-withdrawal/cash-withdrawal.js

const activityService = require('../../services/activity-service.js'),
  util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allBalance: "", //当前账户余额
    cashMoney: "", //提现金额
    employeeId: "", //员工id
    btnDisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    // _this.setData({
    //   employeeId: options.id,
    // })
    activityService.getAccountInfo({
      // id: options.id
    }, function(err, res) {
      if (res.status == 0) {
        _this.setData({
          allBalance: res.data.balance,
        })
      } else {
        util.toast.fail({
          title: "获取当前账户余额失败"
        });
      }
    })
  },
  //提现
  cashWithdrawal: function() {
    var _this = this;
    if (!this.data.cashMoney) {
      util.toast.fail({
        title: "请填写提现金额"
      });
      return
    }
    this.setData({
      btnDisabled: true
    })
    activityService.cashWithdrawal({
      // employeeId: this.data.employeeId,
      amount: +this.data.cashMoney
    }, function(err, res) {
      if (res.status == 0 && res.data.code == 200) {
        wx.showToast({
          title: "提现成功",
          duration: 3000,
          complete: () => {
            var pages = getCurrentPages();
            var prePage = pages[pages.length - 1];
            prePage.onLoad();
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              });
            }, 1000);
          }
        })
      } else {
        if (res.data.message.indexOf("NOTENOUGH") !== -1) {
          util.toast.fail({
            title: "资金结算周期内(1-3天)，请稍后再试",
            duration: 3000,
          })
          _this.setData({
            btnDisabled: false
          })
        } else if (res.data.message.indexOf("AMOUNT_LIMIT") !== -1) {
          util.toast.fail({
            title: "提现金额超出限制。低于最小金额0.30元或累计超过5000.00元",
            duration: 3000,
          })
          _this.setData({
            btnDisabled: false
          })
        } else {
          util.toast.fail({
            title: res.data.message,
            duration: 3000,
          })
          _this.setData({
            btnDisabled: false
          })
        }
      }
    })
  },
  bindInput(e) {
    this.setData({
      cashMoney: e.detail.value,
    })
  },
  // 全部提现
  allCash: function(e) {
    this.setData({
      cashMoney: this.data.allBalance
    })

  }
})