let webim = require("./webim_wx.min.js"),
  utilStatistics = require("../../utils/statistics.js"),
  util = require("../../utils/util.js"),
  userSvr = require("../../services/user-info.js");
global.webim = webim;
module.exports = {
  //发送交换名片申请私信
  sendMsgAlone: function(toAccountid, fromAccountid, sendMessages) {
    this.applyAddFriend(toAccountid, fromAccountid, this.onSendMsg(toAccountid, fromAccountid, sendMessages))
  },
  //自定义消息转义
  customMsgTpl: {
    exchangeCard: {
      key: "5a790d10-552e-11e9-ad0d-177cce4eb5b0",
      value: "TA已经同意您的交换名片申请"
    }
  },
  //解析消息内容
  convertMsg: function(msg) {
    var contentArr = [],
      elems, elem, type, content;
    elems = msg.getElems(); //获取消息包含的元素数组
    for (var i in elems) {
      elem = elems[i];
      type = elem.getType(); //获取元素类型
      content = elem.getContent(); //获取元素对象
      switch (type) {
        case webim.MSG_ELEMENT_TYPE.TEXT:
          contentArr.push(content.getText())
          break;
        default:
          webim.Log.error('未知消息元素类型: elemType=' + type);
          break;
      }
    }
    return contentArr;
  },
  //申请添加好友
  applyAddFriend: function(toAccountid, fromAccountid, cb) {
    let _this = this;
    var add_friend_item = [{
      'To_Account': toAccountid,
      "AddSource": "AddSource_Type_Unknow",
      "AddWording": "" //加好友附言，可为空
    }];
    var options = {
      'From_Account': fromAccountid,
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
  //发送消息
  onSendMsg: function(toAccountid, fromAccountid, sendMessages, cb) {
    let selToID = toAccountid,
      selType = webim.SESSION_TYPE.C2C,
      friendHeadUrl = "",
      _this = this;
    if (!selToID) {
      console.log("您还没有选中好友或者群组，暂不能聊天");
      return;
    }
    //获取消息内容
    var msgtosend = sendMessages;
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
      var selSess = new webim.Session(selType, selToID, selToID, "", Math.round(new Date().getTime() / 1000));
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
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, fromAccountid, subType, "");
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
        // _this.showMsg(msg)
        // _this.setData({
        //   "sendMessages": "",
        //   "recentTime": msg.getTime()
        // })

        //发送微信服务通知
        userSvr.sendMsgNotice({
          targetUserId: toAccountid,
          content: "你有私信消息，快去查看吧",
          time: new Date().getTime()
        }, (err, result) => {});

        //私信发送用户雷达
        // if (!_this.data.isSendHehavior) {
        utilStatistics.behaviorRecord({
          type: "be_private_message",
          targetUser: toAccountid,
          targetClass: '',
          userClass: '',
          manuscriptId: '',
          comment: "私信",
          action: "发送"
        }, () => {
          // _this.data.isSendHehavior = true;
        });
        // }
        !!cb && cb()
      }
    }, function(err) {
      console.log(err.ErrorInfo);
      console.log("-----------------------------------------");
    });
  },
  //我的最近联系人
  getRecentContactList: function() {
    let _this = this;
    return new Promise((resolve, reject) => {
      var options = {
        'Count': 100 //最近的会话数
      };
      webim.getRecentContactList(
        options,
        function(resp) {
          var data = [];
          var tempSess, tempSessMap = {}; //临时会话变量
          if (resp.SessionItem && resp.SessionItem.length > 0) {
            webim.syncMsgs(_this.initUnreadMsgCount); //初始化最近会话的消息未读数
            let sessMap = webim.MsgStore.sessMap();
            for (var i in resp.SessionItem) {
              var item = resp.SessionItem[i];
              var type = item.Type; //接口返回的会话类型
              var sessType, typeZh, sessionId, sessionNick = '',
                sessionImage = '',
                senderId = '',
                senderNick = '';
              if (type == webim.RECENT_CONTACT_TYPE.C2C) { //私聊
                typeZh = '私聊';
                sessType = webim.SESSION_TYPE.C2C; //设置会话类型
                sessionId = item.To_Account; //会话id，私聊时为好友ID或者系统账号（值为@TIM#SYSTEM，业务可以自己决定是否需要展示），注意：从To_Account获取,

                if (sessionId == '@TIM#SYSTEM') { //先过滤系统消息，，
                  webim.Log.warn('过滤好友系统消息,sessionId=' + sessionId);
                  continue;
                }
                var key = sessType + "_" + sessionId;
                // var c2cInfo = infoMap[key];
                // if (c2cInfo && c2cInfo.name) { //从infoMap获取c2c昵称
                //   sessionNick = c2cInfo.name; //会话昵称，私聊时为好友昵称，接口暂不支持返回，需要业务自己获取（前提是用户设置过自己的昵称，通过拉取好友资料接口（支持批量拉取）得到）
                // } else { //没有找到或者没有设置过
                //   sessionNick = sessionId; //会话昵称，如果昵称为空，默认将其设成会话id
                // }
                // if (c2cInfo && c2cInfo.image) { //从infoMap获取c2c头像
                //   sessionImage = c2cInfo.image; //会话头像，私聊时为好友头像，接口暂不支持返回，需要业务自己获取（前提是用户设置过自己的昵称，通过拉取好友资料接口（支持批量拉取）得到）
                // } else { //没有找到或者没有设置过
                //   sessionImage = friendHeadUrl; //会话头像，如果为空，默认将其设置demo自带的头像
                // }
                // senderId = senderNick = ''; //私聊时，这些字段用不到，直接设置为空
                sessionImage = item.C2cImage;
                sessionNick = item.C2cNick
              } else if (type == webim.RECENT_CONTACT_TYPE.GROUP) { //群聊
                typeZh = '群聊';
                sessType = webim.SESSION_TYPE.GROUP; //设置会话类型
                sessionId = item.ToAccount; //会话id，群聊时为群ID，注意：从ToAccount获取
                sessionNick = item.GroupNick; //会话昵称，群聊时，为群名称，接口一定会返回

                if (item.GroupImage) { //优先考虑接口返回的群头像
                  sessionImage = item.GroupImage; //会话头像，群聊时，群头像，如果业务设置过群头像（设置群头像请参考wiki文档-设置群资料接口），接口会返回
                } else { //接口没有返回或者没有设置过群头像，再从infoMap获取群头像
                  var key = sessType + "_" + sessionId;
                  var groupInfo = infoMap[key];
                  if (groupInfo && groupInfo.image) { //
                    sessionImage = groupInfo.image
                  } else { //不存在或者没有设置过，则使用默认头像
                    sessionImage = groupHeadUrl; //会话头像，如果没有设置过群头像，默认将其设置demo自带的头像
                  }
                }
                senderId = item.MsgGroupFrom_Account; //群消息的发送者id

                if (!senderId) { //发送者id为空
                  webim.Log.warn('群消息发送者id为空,senderId=' + senderId + ",groupid=" + sessionId);
                  continue;
                }
                if (senderId == '@TIM#SYSTEM') { //先过滤群系统消息，因为接口暂时区分不了是进群还是退群等提示消息，
                  webim.Log.warn('过滤群系统消息,senderId=' + senderId + ",groupid=" + sessionId);
                  continue;
                }

                senderNick = item.MsgGroupFromCardName; //优先考虑群成员名片
                if (!senderNick) { //如果没有设置群成员名片
                  senderNick = item.MsgGroupFromNickName; //再考虑接口是否返回了群成员昵称
                  if (!senderNick) { //如果接口没有返回昵称或者没有设置群昵称，从infoMap获取昵称
                    var key = webim.SESSION_TYPE.C2C + "_" + senderId;
                    var c2cInfo = infoMap[key];
                    if (c2cInfo && c2cInfo.name) {
                      senderNick = c2cInfo.name; //发送者群昵称
                    } else {
                      sessionNick = senderId; //如果昵称为空，默认将其设成发送者id
                    }
                  }
                }

              } else {
                typeZh = '未知类型';
                sessionId = item.ToAccount; //
              }

              if (!sessionId) { //会话id为空
                webim.Log.warn('会话id为空,sessionId=' + sessionId);
                continue;
              }

              if (sessionId == '@TLS#NOT_FOUND') { //会话id不存在，可能是已经被删除了
                webim.Log.warn('会话id不存在,sessionId=' + sessionId);
                continue;
              }

              // if (sessionNick.length > maxNameLen) { //帐号或昵称过长，截取一部分，出于demo需要，业务可以自己决定
              //   sessionNick = sessionNick.substr(0, maxNameLen) + "...";
              // }

              if (item.MsgShow == _this.customMsgTpl.exchangeCard.key) {
                item.MsgShow = _this.customMsgTpl.exchangeCard.value;
              } else {
                item.MsgShow = item.MsgShow.length == 0 ? "" : item.MsgShow.substring(0, 17) + (item.MsgShow.length > 18 ? "..." : "");
              }
              //  debugger
              console.log(sessMap)
              item.UnreadMsgCount = !!sessMap['C2C' + sessionId] ? sessMap['C2C' + sessionId].unread() : 0;
              item.UnreadMsgCount = item.UnreadMsgCount.length > 2 ? "..." : item.UnreadMsgCount
              tempSess = tempSessMap[sessType + "_" + sessionId];
              if (!tempSess) { //先判断是否存在（用于去重），不存在增加一个
                tempSessMap[sessType + "_" + sessionId] = true;
                data.push({
                  SessionType: sessType, //会话类型
                  SessionTypeZh: typeZh, //会话类型中文
                  SessionId: webim.Tool.formatText2Html(sessionId), //会话id
                  SessionNick: webim.Tool.formatText2Html(sessionNick), //会话昵称
                  SessionImage: sessionImage, //会话头像
                  C2cAccount: webim.Tool.formatText2Html(senderId), //发送者id
                  C2cNick: webim.Tool.formatText2Html(senderNick), //发送者昵称
                  UnreadMsgCount: item.UnreadMsgCount, //未读消息数
                  MsgSeq: item.MsgSeq, //消息seq
                  MsgRandom: item.MsgRandom, //消息随机数
                  MsgTimeStamp: _this.formatTimeStamp(webim.Tool.formatTimeStamp(item.MsgTimeStamp)), //消息时间戳
                  MsgShow: item.MsgShow //消息内容
                });
              }
            }
          }
          return resolve(data);
        },
        function(err) {
          return resolve(err);
        }
      );
    })
  },
  formatTimeStamp: function(time) {
    let _now = util.formatTime(new Date()).replace(/\//g, '-');
    let _nowArr = _now.split('-'),
      _timeArr = time.split('-');
    if (_nowArr[0] == _timeArr[0]) {
      time = time.substring(5, time.length)
      _now = _now.substring(5, _now.length)
      if (time.split(' ')[0] == _now.split(' ')[0]) {
        time = time.split(' ')[1]
      }
    }
    return time.substring(0, time.length - 3);
  },
  //初始化最近会话的消息未读数
  initUnreadMsgCount: function() {
    var sess;
    var sessMap = webim.MsgStore.sessMap();
    // console.error(sessMap)
    for (var i in sessMap) {
      sess = sessMap[i];
      // if (selToID && selToID != sess.id()) { //更新其他聊天对象的未读消息数
      // console.error('sess.unread()', sess.unread())
      // updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread());
      // }
    }
  },
  getAllFriend: function() {
    let _this = this;
    var options = {
      'From_Account': getApp().globalData.userInfo.data[0].user_uuid,
      'TimeStamp': 0,
      'StartIndex': (_this.data.pagination.pageIndex - 1) * _this.data.pagination.pageSize,
      'GetCount': _this.data.pagination.pageSize,
      'LastStandardSequence': 0,
      "TagList": [
        "Tag_Profile_IM_Nick",
        "Tag_Profile_IM_Image"
      ]
    };
    webim.getAllFriend(
      options,
      async function(resp) {
        if (resp.FriendNum > 0) {
          var friends = resp.InfoItem;
          if (!friends || friends.length == 0) {
            return;
          }
          let list = []
          var count = friends.length;

          for (let i = 0; i < count; i++) {
            let itemInfo = {
              friend_name: "",
              friend_face: "",
              info_Account: friends[i].Info_Account,
              msg_content: "",
              msg_time: "",
              msg_unread: 0
            }
            itemInfo.friend_name = friends[i].Info_Account;
            if (friends[i].SnsProfileItem && friends[i].SnsProfileItem[0] &&
              friends[i].SnsProfileItem[0].Tag) {
              itemInfo.friend_name = friends[i].SnsProfileItem[0].Value;
            }
            if (friends[i].SnsProfileItem && friends[i].SnsProfileItem[1] &&
              friends[i].SnsProfileItem[1].Tag) {
              itemInfo.friend_face = friends[i].SnsProfileItem[1].Value;
            }
            let result = await _this.getLastC2CHistoryMsgs(friends[i].Info_Account)

            // debugger
            itemInfo.msg_content = result.msg_content.length == 0 ? "" : result.msg_content[0].substring(0, 17) + (result.msg_content[0].length > 18 ? "..." : "");
            itemInfo.msg_time = result.msg_time.substring(5, result.msg_time.length - 3);
            itemInfo.msg_unread = result.msg_unread;
            list.push(itemInfo);

            list = list.sort((item1, item2) => {
              return item1.msg_time > item2.msg_time ? -1 : 1
            });

            if (list.length == friends.length) {
              // debugger
              if (!!_this.data.pagination.dataMore) {
                list = _this.data.friendsList.concat(list).sort((item1, item2) => {
                  return item1.msg_time > item2.msg_time ? -1 : 1
                });
              }
              _this.setData({
                friendsList: list
              })
            }
          }
        } else {
          _this.setData({
            isShow: true
          })
        }

        wx.hideLoading();
      },
      function(err) {
        console.log(err.ErrorInfo);
      }
    );
  },
  getLastC2CHistoryMsgs: function(toAccountid) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let _options = {
        'Peer_Account': toAccountid, //好友帐号
        'MaxCnt': 2, //拉取消息条数
        'LastMsgTime': 0, //最近的消息时间，即从这个时间点向前拉取历史消息
        'MsgKey': ""
      };
      let _result = {
        msg_content: "",
        msg_time: "",
        msg_unread: 0
      }
      webim.getC2CHistoryMsgs(
        _options,
        function(resp) {
          if (resp.MsgList.length > 0) {
            _result.msg_content = timCommon.convertMsg(resp.MsgList[0]);
            //  debugger
            // if (_result.msg_content == timCommon.customMsgTpl.exchangeCard.key) { 
            //   if (resp.MsgList[0].isSend) {
            //     _result.msg_content = timCommon.convertMsg(resp.MsgList[1]);
            //   }else{
            //   _result.msg_content = timCommon.customMsgTpl.exchangeCard.value;
            //   }
            // }

            _result.msg_time = webim.Tool.formatTimeStamp(resp.MsgList[0].getTime());
            _result.msg_unread = resp.MsgList[0].getSession().unread();
          }
          return resolve(_result);
        })
    })
  },
}