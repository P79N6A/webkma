let webim = require("../../vendor/timsdk/webim_wx.min.js");
global.webim = webim;
const config = require('../../config.js'),
  utilStatistics = require("../../utils/statistics.js"),
  util = require("../../utils/util.js"),
  timCommon = require("../../vendor/timsdk/common.js"),
  userSvr = require("../../services/user-info.js");
// pages/messages-send/messages-send.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toAccountInfo: { //对方
      toAccountid: "",
      toAccountFace: "",
      toAccountNikeName: "",
      toAccountBussniessId: ""
    },
    fromAccountInfo: { //自己
      fromAccountid: "",
      fromAccountFace: ""
    },
    selfUserInfo: {},
    isHasCard: "false",
    sendMessages: "", //当前发送消息
    msgList: [], //对话列表
    msgItem: { //对话详情
      isOwnMsg: false, //是否是自己发的消息
      msgContent: ""
    },
    historyMsgsConfig: {
      msgKey: "",
      lastMsgTime: 0,
      complete: 0
    },
    recentTime: "", //消息最近时间
    isSendHehavior: false, //是否发送用户雷达
    source: "", //进入私信来源，
    isSent: false //是否发送过消息，用于咨询量统计
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(webim.MsgStore.sessMap())
    this.data.selfUserInfo = getApp().globalData.userInfo.data[0];
    this.data.toAccountInfo.toAccountid = options.accountid;
    this.data.toAccountInfo.toAccountBussniessId = options.businessId;
    // debugger
    this.data.isHasCard = options.isHasCard;
    this.data.fromAccountInfo.fromAccountid = this.data.selfUserInfo.user_uuid;
    this.setData({
      fromAccountInfo: {
        fromAccountFace: this.data.selfUserInfo.user_face
      }
    })

    this.getProfilePortrait(() => {
      wx.setNavigationBarTitle({
        title: this.data.toAccountInfo.toAccountNikeName
      });
    })

    let _this = this;
    this.applyAddFriend(() => {
      // debugger
      this.getLastC2CHistoryMsgs(() => {
        // debugger
        if (_this.data.isHasCard == "true") {
          let _item = {
            isOwnMsg: false,
            msgContent: "",
            msgTime: util.formatTime(new Date()).replace(/\//g, '-'),
            showPromptbox: true
          }
          _this.data.msgList.push(_item)

          _this.setData({
            msgList: _this.data.msgList
          })

          _this.moveToBottom()
        }
      })
      //私信加好友人脉改变状态
      userSvr.msgToRelation({
        id: _this.data.toAccountInfo.toAccountid
      }, (err, result) => {

      });
    });


    wx.$on('onMsgNotify', (fncName, newMsgList) => {
      this.onMsgNotify(newMsgList);
    })

    var sessMap = webim.MsgStore.sessMap()[webim.SESSION_TYPE.C2C + _this.data.toAccountInfo.toAccountid];
    !!sessMap ? sessMap.unread(0) : () => {};
  },
  applyAddFriend: function(cb) {
    let _this = this;
    var add_friend_item = [{
      'To_Account': this.data.toAccountInfo.toAccountid,
      "AddSource": "AddSource_Type_Unknow",
      "AddWording": "" //加好友附言，可为空
    }];
    var options = {
      'From_Account': this.data.fromAccountInfo.fromAccountid,
      'AddFriendItem': add_friend_item
    };

    webim.applyAddFriend(
      options,
      function(resp) {
        if (resp.Fail_Account && resp.Fail_Account.length > 0) {
          for (var i in resp.ResultItem) {
            console.log(resp.ResultItem[i].ResultInfo);
            break;
          }
        } else {
          !!cb && cb()
        }
      },
      function(err) {
        !!cb && cb()
        console.log(err.ErrorInfo);
        console.log("-----------------------------------------");
      }
    );
  },
  getProfilePortrait: function(cb) {
    let _this = this;
    let options = {
      "To_Account": [this.data.toAccountInfo.toAccountid],
      "TagList": [
        "Tag_Profile_IM_Nick",
        "Tag_Profile_IM_Image"
      ]
    }
    webim.getProfilePortrait(options, (resp) => {
      if (resp.UserProfileItem && resp.UserProfileItem.length > 0) {
        let data = [];
        for (var i in resp.UserProfileItem) {
          // debugger
          var to_account = resp.UserProfileItem[i].To_Account;
          var nick = null,
            gender = null,
            allowType = null,
            imageUrl = null;
          for (var j in resp.UserProfileItem[i].ProfileItem) {
            switch (resp.UserProfileItem[i].ProfileItem[j].Tag) {
              case 'Tag_Profile_IM_Nick':
                nick = resp.UserProfileItem[i].ProfileItem[j].Value;
                break;
              case 'Tag_Profile_IM_Image':
                imageUrl = resp.UserProfileItem[i].ProfileItem[j].Value;
                break;
            }
          }
          data.push({
            'To_Account': to_account,
            'Nick': webim.Tool.formatText2Html(nick),
            'Gender': gender,
            'AllowType': allowType,
            'Image': imageUrl
          });
        }
        _this.setData({
            toAccountInfo: {
              toAccountid: data[0].To_Account,
              toAccountFace: data[0].Image,
              toAccountNikeName: data[0].Nick,
              toAccountBussniessId: _this.data.toAccountInfo.toAccountBussniessId
            }
          })

          !!cb && cb()
      }
    }, (err) => {
      console.log(err.ErrorInfo);
    })
  },
  getLastC2CHistoryMsgs: function(cbOk, cbError) {
    let _this = this;
    let _options = {
      'Peer_Account': this.data.toAccountInfo.toAccountid, //好友帐号
      'MaxCnt': 12, //拉取消息条数
      'LastMsgTime': this.data.historyMsgsConfig.lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
      'MsgKey': this.data.historyMsgsConfig.msgKey
    };
    // webim.MsgStore.delSessByTypeId(webim.SESSION_TYPE.C2C, this.data.toAccountid);

    webim.getC2CHistoryMsgs(
      _options,
      function(resp) {
        console.log(webim.MsgStore.sessMap())
        var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有
        var retMsgCount = resp.MsgCount; //返回的消息条数，小于或等于请求的消息条数，小于的时候，说明没有历史消息可拉取了
        if (resp.MsgList.length == 0) {
          if (cbOk)
            cbOk();
          return;
        }

        let newArr = [];
        resp.MsgList.forEach((item) => {
          // debugger
          let _timeMinutesDiff = (item.getTime() - _this.data.recentTime) / 60;
          let _msgTime = "";
          if (_timeMinutesDiff > 5) {
            _msgTime = webim.Tool.formatTimeStamp(item.getTime())
          }
          let _isCustomMsgTpl = false,
            _msgContent = _this.convertMsg(item).toString();
          if (_msgContent == timCommon.customMsgTpl.exchangeCard.key) {
            if (item.isSend) {
              return;
            }
            _msgContent = timCommon.customMsgTpl.exchangeCard.value;
            _isCustomMsgTpl = true;
          }
          let msgItem = {
            isOwnMsg: item.isSend,
            msgContent: _msgContent,
            msgTime: _msgTime,
            isCustomMsgTpl: _isCustomMsgTpl
          }
          newArr.push(msgItem)
          _this.data.recentTime = item.getTime()
          var opts = {
            'To_Account': _this.data.toAccountInfo.toAccountid, //好友帐号
            'LastedMsgTime': item.getTime() //消息时间戳
          };
          // debugger
          webim.c2CMsgReaded(opts);
        })

        // debugger
        if (_this.data.historyMsgsConfig.lastMsgTime != 0) {
          newArr = newArr.concat(_this.data.msgList)
        }
        _this.setData({
          msgList: newArr
        })

        if (_this.data.historyMsgsConfig.lastMsgTime == 0) {
          _this.moveToBottom()
        }

        _this.data.historyMsgsConfig.lastMsgTime = resp.LastMsgTime;
        _this.data.historyMsgsConfig.msgKey = resp.MsgKey;

        if (cbOk)
          cbOk();
      },
      function(err) {
        console.log(err.ErrorInfo);
      }
    );
  },
  onMsgNotify: function(newMsgList) {
    let _this = this;
    var sess, newMsg, selSess;
    //获取所有聊天会话
    var sessMap = webim.MsgStore.sessMap();

    for (var j in newMsgList) { //遍历新消息
      newMsg = newMsgList[j];
      if (newMsg.getSession().id() == _this.data.toAccountInfo.toAccountid) { //为当前聊天对象的消息
        selSess = newMsg.getSession();
        // debugger
        //在聊天窗体中新增一条消息
        //console.warn(newMsg);
        var opts = {
          'To_Account': _this.data.toAccountInfo.toAccountid, //好友帐号
          'LastedMsgTime': newMsg.getTime() //消息时间戳
        };
        // debugger
        webim.c2CMsgReaded(opts);
        // var sessMap = webim.MsgStore.sessMap()[webim.SESSION_TYPE.C2C + _this.data.toAccountInfo.toAccountid];
        // !!sessMap ? sessMap.unread(0) : () => { };
        _this.showMsg(newMsg)
      }
    }
  },
  bindInput(e) {
    this.setData({
      sendMessages: e.detail.value,
    })
  },
  toCardDetail: function(e) {
    wx.navigateTo({
      url: `/pages/card-detail/card-detail?from_user=${this.data.toAccountInfo.toAccountid}&from_company=${this.data.toAccountInfo.toAccountBussniessId}&origin=custom`
    })
  },
  onSendMsg: function() {
    let selToID = this.data.toAccountInfo.toAccountid,
      selType = webim.SESSION_TYPE.C2C,
      friendHeadUrl = "",
      _this = this;
    if (!selToID) {
      console.log("您还没有选中好友或者群组，暂不能聊天");
      return;
    }
    //获取消息内容
    var msgtosend = this.data.sendMessages;
    var msgLen = webim.Tool.getStrBytes(msgtosend);
    if (msgtosend.length < 1) {
      console.log("发送的消息不能为空!");

      return;
    } 
    var maxLen, errInfo;
    if (selType == webim.SESSION_TYPE.C2C) {
      maxLen = webim.MSG_MAX_LENGTH.C2C;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    } else {
      maxLen = webim.MSG_MAX_LENGTH.GROUP;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    }
    if (msgLen > maxLen) {
      console.log(errInfo);
      return;
    }
    if (!selSess) {
      var selSess = new webim.Session(selType, selToID, selToID, this.data.fromAccountInfo.fromAccountFace, Math.round(new Date().getTime() / 1000));
    }
    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示 SDK 自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    var subType; //消息子类型
    if (selType == webim.SESSION_TYPE.C2C) {
      subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    } else {

      subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    }
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, this.data.fromAccountInfo.fromAccountid, subType, this.data.fromAccountInfo.fromAccountFace);
    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgtosend.match(expr);
    if (!emotions || emotions.length < 1) {
      text_obj = new webim.Msg.Elem.Text(msgtosend);
      msg.addText(text_obj);
    } else {
      for (var i = 0; i < emotions.length; i++) {
        tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
        if (tmsg) {
          text_obj = new webim.Msg.Elem.Text(tmsg);
          msg.addText(text_obj);
        }
        emotionIndex = webim.EmotionDataIndexs[emotions[i]];
        emotion = webim.Emotions[emotionIndex];
        if (emotion) {
          face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
          msg.addFace(face_obj);
        } else {
          text_obj = new webim.Msg.Elem.Text(emotions[i]);
          msg.addText(text_obj);
        }
        restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
        msgtosend = msgtosend.substring(restMsgIndex);
      }
      if (msgtosend) {
        text_obj = new webim.Msg.Elem.Text(msgtosend);
        msg.addText(text_obj);
      }
    }

    webim.sendMsg(msg, function(resp) {
      if (selType == webim.SESSION_TYPE.C2C) {
        _this.showMsg(msg)
        _this.setData({
          "sendMessages": "",
          "recentTime": msg.getTime()
        })

        //发送微信服务通知
        userSvr.sendMsgNotice({
          targetUserId: _this.data.toAccountInfo.toAccountid,
          content: "你有私信消息，快去查看吧",
          time: new Date().getTime()
        }, (err, result) => {});

        //私信发送用户雷达
        if (!_this.data.isSendHehavior) {
          utilStatistics.behaviorRecord({
            type: "be_private_message",
            targetUser: _this.data.toAccountInfo.toAccountid,
            targetClass: '',
            userClass: '',
            manuscriptId: '',
            comment: "私信",
            action: "发送",
            clientType: "weapp"
          }, () => {
            _this.data.isSendHehavior = true;
          });
        }

        if (!isSend) {
          activityService.behaviorRecord({
            "relationId": getApp().globalData.userInfo.businessId,
            "rootUserId": _this.data.selfUserInfo.user_uuid,
            "clientType": "weapp",
            "indexType": "user_service",
            "extId": _this.data.toAccountInfo.toAccountid,
            "extType": "communication"
          }, () => {
            _this.data.isSend = true;
          });
        }
      }
    }, function(err) {
      console.log("-----------------------------------------");
      console.log(err.ErrorInfo);
      console.log("-----------------------------------------");
    });
  },
  showMsg: function(msg) {
    let isSelfSend, fromAccount, fromAccountNick, sessType, subType;
    fromAccount = msg.getFromAccount() || '';
    fromAccountNick = msg.getFromAccountNick() || fromAccount;
    isSelfSend = msg.getIsSend(); //消息是否为自己发的
    sessType = msg.getSession().type();

    let msgItem = {
      isOwnMsg: msg.getIsSend(),
      msgContent: this.convertMsg(msg).toString(),
      msgTime: ""
    }

    let _msgTime = msg.getTime();
    let _timeDiff = (_msgTime - this.data.recentTime) / 60;
    if (_timeDiff >= 5) {
      msgItem.msgTime = webim.Tool.formatTimeStamp(msg.getTime()).split(" ")[1]
    }

    this.setData({
      msgList: this.data.msgList.concat(msgItem)
    })
    this.moveToBottom()
  },
  convertMsg: function(msg) {
    // debugger
    var contentArr = [],
      elems, elem, type, content;
    elems = msg.getElems(); //获取消息包含的元素数组
    for (var i in elems) {
      elem = elems[i];
      type = elem.getType(); //获取元素类型
      content = elem.getContent(); //获取元素对象
      switch (type) {
        case webim.MSG_ELEMENT_TYPE.TEXT:
          contentArr.push(content.getText().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"'))
          break;
        default:
          webim.Log.error('未知消息元素类型: elemType=' + type);
          break;
      }
    }
    return contentArr;
  },
  formatTime: function(timestamp) {
    var publishTime = timestamp / 1000,
      d_seconds,
      d_minutes,
      d_hours,
      d_days,
      timeNow = parseInt(new Date().getTime() / 1000),
      d,
      date = new Date(timestamp),
      Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
      M = '0' + M;
    }
    if (D < 10) {
      D = '0' + D;
    }
    if (H < 10) {
      H = '0' + H;
    }
    if (m < 10) {
      m = '0' + m;
    }
    if (s < 10) {
      s = '0' + s;
    }

    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    d_seconds = parseInt(d);

    if (d_days > 0 && d_days < 3) {
      return d_days + '天前';
    } else if (d_days <= 0 && d_hours > 0) {
      return d_hours + '小时前';
    } else if (d_hours <= 0 && d_minutes > 0) {
      return d_minutes + '分钟前';
    } else if (d_seconds < 60) {
      if (d_seconds <= 0) {
        return '刚刚';
      } else {
        return d_seconds + '秒前';
      }
    } else if (d_days >= 3 && d_days < 30) {
      return M + '-' + D + ' ' + H + ':' + m;
    } else if (d_days >= 30) {
      return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
    }
  },
  moveToBottom: function() {
    Promise.all([
      new Promise((resolve, rej) => {
        const query = wx.createSelectorQuery()
        query.select('.msg-list').boundingClientRect()
        query.exec(function(res) {
          resolve(res[0]);
        });
      }),
      new Promise((resolve, rej) => {
        const query = wx.createSelectorQuery()
        query.select('.footer').boundingClientRect()
        query.exec(function(res) {
          resolve(res[0]);
        });
      })
    ]).then((result) => {
      wx.pageScrollTo({
        duration: 0,
        scrollTop: result[0].height - wx.getSystemInfoSync().windowHeight + result[1].height + 10
      });
    }).catch(() => {});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var sessMap = webim.MsgStore.sessMap()[webim.SESSION_TYPE.C2C + this.data.toAccountInfo.toAccountid];
    !!sessMap ? sessMap.unread(0) : () => {};
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (!this.data.historyMsgsConfig.complete) {
      wx.showNavigationBarLoading();
      this.getLastC2CHistoryMsgs(() => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      });
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})