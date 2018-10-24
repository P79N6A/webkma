// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const spriteList = require('spriteList')

cc.Class({
    extends: cc.Component,

    properties: {
        //红包
        GiftPrefab: {
            default: null,
            type: cc.Prefab
        },
        //炸弹
        bombPrefab: {
            default: null,
            type: cc.Prefab
        },
        //背景
        Background: {
            default: null,
            type: cc.Node
        },
        //初始布局层
        StartLayer: {
            default: null,
            type: cc.Node
        },
        //精灵父节点
        SpriteLayer: {
            default: null,
            type: cc.Node
        },
        //玩家
        Player: {
            default: null,
            type: cc.Node
        },
        //游戏中的ly
        PlayingLy: {
            default: null,
            type: cc.Node
        },
        //接到东西后的精灵
        FullGift: {
            default: null,
            type: cc.Node
        },
        //倒计时lb
        CountDownLb: {
            default: null,
            type: cc.Label
        },
        //右动画
        ArrowRight: {
            default: null,
            type: cc.Animation
        },
        //左动画
        ArrowLeft: {
            default: null,
            type: cc.Animation
        },
        //ready go 音效
        ReadyGoAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.enabled = true
        //积分
        console.log('准备')
        console.log('数据：', spriteList)
        //开启物理引擎
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        // manager.gravity = cc.v2(0, -160);

        // manager.enabledDebugDraw = true;
        // manager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     cc.PhysicsManager.DrawBits.e_pairBit |
        //     cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit
        //     ;
    },

    playerMove(event) {
        //坐标点修改，精灵层的坐标是世界坐标
        this.Player.x = event.getLocationX() - this.SpriteLayer.width / 2
    },

    btnStart() {
        //开启动画
        this.animationStart()
        //显示分数和时间层
        this.SpriteLayer.active = true;
        this.PlayingLy.active = true;
        //播放音效
        cc.audioEngine.playEffect(this.ReadyGoAudio, false);
        this.CountDownLb.string = 'ready!'
        let isClean = false;
        //关闭开始按钮的激活状态
        this.StartLayer.active = false
        this.schedule(function () {
            if (!isClean) {
                this.CountDownLb.string = 'GO'
                this.isStart = true
                //注册鼠标和触摸监听
                this.SpriteLayer.on(cc.Node.EventType.MOUSE_MOVE, this.playerMove, this)
                this.SpriteLayer.on(cc.Node.EventType.TOUCH_MOVE, this.playerMove, this)
                //第一波
                this.addReserve();

                this.schedule(this.addReserve, this.waveTime, spriteList.length - 2)
                isClean = true
            } else {
                this.CountDownLb.string = ''
            }
        }, 0.8, 2)
    },
    animationStart() {
        var rightAnim = this.ArrowRight.getComponent(cc.Animation);
        rightAnim.play();
        var leftAnim = this.ArrowLeft.getComponent(cc.Animation)
        leftAnim.play();
    },

    addReserve() {
        //新的一波数据添加进预备资源中
        spriteList[this.wave].forEach(element => {
            let isExit = false,
                i = 0;
            while (i < this.reserveList.length) {
                if (this.reserveList[i].name == element.name) {
                    isExit = true
                    this.reserveList[i].count += element.count
                }
                i++;
            }
            if (!isExit) {
                this.reserveList.push(element)
            }
        });
        //计算刷新时间
        let totalCount = 0
        this.reserveList.forEach(element => {
            totalCount += element.count
        })
        //计算
        if (this.refreshTime >= 0.5) {
            this.refreshTime -= 0.2

        }
        this.wave++;
        if (this.wave == spriteList.length) {
            //游戏最后一波已添加到
            this.isWillEnd = true
        }
        // console.log(this.reserveList)

        // this.schedule(this.getReserve, this.refreshTime, totalCount - 1)
    },
    getReserve() {
        if (this.reserveList.length > 0) {

            //到了刷新时间
            //重置时间和
            let num = Math.floor(Math.random() * this.reserveList.length)
            // console.log('num:', num)
            //获取本次初始化的精灵数据
            let frult = this.reserveList[num]
            this.getNewSprite(frult)
            this.reserveList[num].count -= 1
            if (this.reserveList[num].count <= 0) {
                // console.log(this.reserveList)
                this.reserveList.splice(num, 1)
            }
        }
    },

    getNewSprite(params) {
        // let layer = this.SpriteLayer.getComponent('SpriteLayer')
        var newSprite,
            jsSprite;
        if (params.name.indexOf('bomb') == 0) {
            newSprite = cc.instantiate(this.bombPrefab);
            jsSprite = newSprite.getComponent("bomb")
        } else if (params.name.indexOf('redGift') == 0) {
            newSprite = cc.instantiate(this.GiftPrefab);
            jsSprite = newSprite.getComponent("redGift")
        }
        //新生产一个精灵
        jsSprite.init(params);
        this.SpriteLayer.addChild(newSprite)
        newSprite.setPosition(this.getNewPosition())
        jsSprite.game = this;
    },

    getNewPosition() {
        var randX = 0;
        // 根据场景的高度
        var randY = this.Background.height / 2
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    //计算得分
    gainScore(num) {
        this.score += num
        var totalLb = this.PlayingLy.getChildByName('score').getChildByName('Label').getComponent(cc.Label)
        var scoreLb = this.Player.getChildByName('score').getComponent(cc.Label)
        if (num > 0)
            scoreLb.string = '+' + num
        else
            scoreLb.string = num
        totalLb.string = this.score
        let path = ''
        if (this.score > 40 && this.score < 70) {
            path = 'FallingDown/little'
        } else if (this.score > 70) {
            path = 'FallingDown/full'
        }
        if (!!path) {
            let fullSprite = this.FullGift.getComponent(cc.Sprite)
            cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
                fullSprite.spriteFrame = spriteFrame
            })
        }

        this.scheduleOnce(function () {
            scoreLb.string = ''
        }, 1);
    },
    //消除
    start() {
        //计分
        this.score = 0;
        //预备资源，将被初始化的数据来自这里
        this.reserveList = [];

        //波数
        this.wave = 0;
        //每波的时间间隔,单位秒
        this.waveTime = 8;
        //每个精灵的刷新间隔时间
        this.refreshTime = 1.3;
        //时间积累
        this.time = 0
        //是否即将结束
        this.isWillEnd = false
        //倒计时
        this.reverseTime = 30
        //是否开始
        this.isStart = false
        this.lastNum = {
            times: 0
        }
    },


    gameOver() {
        this.isStart = false
        this.CountDownLb.string = '得分：' + this.score
        this.enabled = false
        this.SpriteLayer.active = false
    },

    update(dt) {
        if (this.isStart) {
            this.reverseTime -= dt
            var timeLb = this.PlayingLy.getChildByName('time').getChildByName('Label').getComponent(cc.Label)
            if (this.reverseTime <= 0) {
                timeLb.string = 0
                this.gameOver()
                return
            }
            timeLb.string = Math.floor(this.reverseTime)


            if (this.reserveList.length > 0) {

                this.time += dt
                if (this.time > this.refreshTime) {
                    //到了刷新时间
                    //重置时间和
                    this.time = 0
                    let num = Math.floor(Math.random() * this.reserveList.length)
                    if (!!this.lastNum.num && num == this.lastNum.num) {
                        if (this.lastNum.times >= 2) {
                            if (this.reserveList.length >= 2) {
                                let isExit = false
                                while (!isExit) {
                                    let newNum = Math.floor(Math.random() * this.reserveList.length)
                                    if (num != newNum) {
                                        isExit = true
                                        num = newNum
                                        this.lastNum.num = num
                                        this.lastNum.times = 1
                                    }
                                }
                            }
                        } else {
                            this.lastNum.times++;
                        }

                    } else {
                        this.lastNum.num = num
                        this.lastNum.times = 1
                    }
                    console.log('num:', num)
                    //获取本次初始化的精灵数据
                    let frult = this.reserveList[num]
                    this.getNewSprite(frult)
                    this.reserveList[num].count -= 1
                    if (this.reserveList[num].count <= 0) {
                        this.reserveList.splice(num, 1)
                    }
                }
            }
        }
    },
});
