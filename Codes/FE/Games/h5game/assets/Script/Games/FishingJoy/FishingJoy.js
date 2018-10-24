const business = require("Business");

cc.Class({
    extends: cc.Component,

    properties: {
        bullet: { default: null, type: cc.Prefab },
        fish1: { default: null, type: cc.Prefab },
        fish2: { default: null, type: cc.Prefab },
        fish3: { default: null, type: cc.Prefab },
        fish4: { default: null, type: cc.Prefab },
        fish5: { default: null, type: cc.Prefab },
        startNode: { default: null, type: cc.Node },
        playNode: { default: null, type: cc.Node },
        actorNode: { default: null, type: cc.Node },
        cannonNode: { default: null, type: cc.Node },
        scoreNode: { default: null, type: cc.Node },
        timerNode: { default: null, type: cc.Node },
        _timer: { default: null, type: cc.Integer }
    },

    onLoad() {
        // 开启物理系统
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
    },

    start() {
        let self = this;
        self.node.on("addScore", self.addScore, self);
        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            let touchPoint = event.getLocation(),
                cannonPoint = cc.v2(320, 0),
                posSub = touchPoint.sub(cannonPoint),                   //向量差计算,结束点-开始点，向量的指向是朝着结束点
                angle = Math.atan2(posSub.y, posSub.x) / Math.PI * 180, //向量的角度计算，cc.pToAngle是获得弧度值，角度 = 弧度/PI*180
                rotation = 90 - angle;                                  //rotation 是逆时针旋转的，在角度添加负号才正确
            // 设置炮台角度
            self.cannonNode.getChildByName("Cannon").setRotation(rotation);
            // 发射子弹
            let buttle = cc.instantiate(self.bullet);
            self.actorNode.addChild(buttle);
            // 子弹初始坐标
            buttle.position = cc.v2(0, -500);
            buttle.setRotation(rotation);
            buttle.getComponent(cc.RigidBody).linearVelocity = cc.v2(
                Math.cos(angle * (Math.PI / 180)) * 250,
                Math.sin(angle * (Math.PI / 180)) * 250
            );
            // console.log(buttle.getComponent(cc.RigidBody).linearVelocity);
        }, self);
        self.init();
    },

    init() {
        let self = this;
        // 游戏时长
        self._timer = 60;
    },

    gameStart() {
        let self = this,
            timer = self.timerNode.getComponent(cc.Label);
        // timer.string = self._timer;
        // 定时器
        let timerHandle, fishHandle;

        // timerHandle = setInterval(() => {
        //     if (self._timer <= 0) {
        //         clearInterval(timerHandle);
        //         clearInterval(fishHandle);
        //         return;
        //     }
        //     timer.string = --self._timer;
        // }, 1000);

        fishHandle = setInterval(() => {
            let rand = Math.random();
            if (rand <= 0.10) {
                self.pushFish(self.fish1, { startY: 120, rangeY: 480, rate: 0.10, score: 30 });
            } else if (rand <= 0.25) {
                self.pushFish(self.fish3, { startY: 0, rangeY: 480, rate: 0.25, score: 25 });
            } else if (rand <= 0.45) {
                self.pushFish(self.fish2, { startY: -120, rangeY: 480, rate: 0.40, score: 20 });
            } else if (rand <= 0.70) {
                self.pushFish(self.fish4, { startY: -240, rangeY: 480, rate: 0.60, score: 15 });
            } else {
                self.pushFish(self.fish5, { startY: -360, rangeY: 480, rate: 0.80, score: 10 });
            }
        }, 800);
    },

    pushFish(prefab, params) {
        let self = this,
            fish = cc.instantiate(prefab),
            direction = Math.random() > 0.5 ? -1 : 1,
            startPos = cc.v2(480 * direction, params.startY + (Math.random() * params.rangeY)),
            endPos = cc.v2(480 * -direction, params.startY + (Math.random() * params.rangeY)),
            posSub = endPos.sub(startPos),                          //向量差计算,结束点-开始点，向量的指向是朝着结束点
            angle = Math.atan2(posSub.y, posSub.x) / Math.PI * 180, //向量的角度计算，cc.pToAngle是获得弧度值，角度 = 弧度/PI*180
            rotation = 180 - angle;                                      //rotation 是逆时针旋转的，在角度添加负号才正确
        // 鱼初始坐标
        fish.position = startPos;
        fish.setRotation(rotation);
        fish.getChildByName("Sprite").setScale(cc.v2(1, direction));
        fish.getComponent("Fish").init({ rate: params.rate, score: params.score });
        fish.getComponent(cc.RigidBody).linearVelocity = cc.v2(
            Math.cos(angle * (Math.PI / 180)) * 100,
            Math.sin(angle * (Math.PI / 180)) * 100
        );
        self.actorNode.addChild(fish);
    },

    btnStart(event) {
        let self = this;
        self.startNode.active = false;
        self.playNode.active = true;
        // 开始游戏
        self.gameStart();
    },

    addScore(event) {
        let self = this,
            score = self.scoreNode.getComponent(cc.Label);
        score.string = parseFloat(score.string) + parseFloat(event.detail.score);
        event.stopPropagation();
    }

    // update (dt) {},
});
