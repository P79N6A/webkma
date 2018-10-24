const business = require("Business");

cc.Class({
    extends: cc.Component,

    properties: {
        egg: { default: null, type: cc.Prefab },
        _containerNode: { default: null, type: cc.Node },
        _layerResultNode: { default: null, type: cc.Node },
        _activitySettings: { default: null, type: cc.Object },
        _prize: { default: null, type: cc.Object },
        _status: { default: "", type: cc.String }   // 状态控制
    },

    onLoad() {
        // 开启物理系统
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        // 业务初始化
        this._containerNode = this.node.getChildByName("Background");
        // 动画事件注册
        cc.find("Carrier/Prize", this._containerNode).getComponent(cc.Animation).on("finished", this.popupPrizeLayer, this);
        cc.find("LayerContext", this._containerNode).getComponent(cc.Animation).on("finished", this.showResult, this);

        this._status = "loaded";
    },

    start() {
        let self = this,
            eggsContainer = self._containerNode.getChildByName("EggsContainer"),
            num = 0;
        while (num < 18) {
            let egg = cc.instantiate(self.egg);
            egg.position = cc.v2(Math.random() * 10, Math.random() * 10);
            eggsContainer.addChild(egg);
            num++;
        }
        // 初始化活动设置
        business.getGameSettings({ "relationId": "11001180719000000015", "controlId": "sjtest111" }, (err, result) => {
            if (err) return cc.error(err.message || err);
            self._activitySettings = result;
            self._activitySettings.theme = "red";

            // 根据活动设置的主题加载结果显示层
            business.getLayerResultPrefab(self._activitySettings.theme, (err, prefab) => {
                if (err) return cc.error(err.message || err);
                self._layerResultNode = cc.instantiate(prefab);
                self.node.addChild(self._layerResultNode);
                self._status = "ready";
            });
            // 设置UI
            self.setUIDetail();
        });
    },
    
    setUIDetail() {
        let self = this,
            title;
        switch (self._activitySettings.status) {
            case 0: // 未开始
                title = "活动未开始";
                break;
            case 1: // 进行中
                title = `您剩余抽奖次数：${self._activitySettings.drawCount}次`;
                if (self._activitySettings.drawCount > 0) {
                    cc.find("ButtonStart", self._containerNode).getComponent(cc.Button).interactable = true;
                }
                break;
            case 2: // 已结束
                title = "活动已结束";
                break;
        }
        cc.find("Carrier/Title", self._containerNode).getComponent(cc.Label).string = title;
    },

    btnStart(event) {
        let self = this,
            forceNode = cc.find("EggsContainer/Force", self._containerNode),
            prizeNode = cc.find("Carrier/Prize", self._containerNode);
        if (self._status != "ready") return;
        self._status = "starting";

        self._activitySettings.drawCount--;
        // 设置UI
        self.setUIDetail();

        Promise.all([
            new Promise((resolve, reject) => {
                // 执行抽奖动画过程
                forceNode.active = true;
                setTimeout(() => {
                    forceNode.active = false;
                    resolve();
                }, 3000);
            }), new Promise((resolve, reject) => {
                // 开始抽奖 Todo: 数据通过外部拿取
                business.drawPrize({ "relationId": "11001180719000000015", "controlId": "sjtest111" }, (err, result) => {
                    if (err) return reject(err);
                    // 记录抽奖结果
                    self._prize = result;
                    resolve();
                });
            })
        ]).then(result => {
            // 执行中奖蛋出现动画（延迟500毫秒是为了让容器中的球落下效果完成后）
            setTimeout(() => {
                prizeNode.getComponent(cc.Animation).play();
            }, 500);
        }).catch(err => {
            forceNode.active = false;
            self._status = "ready";
            return cc.error(err.message || err);
        });
    },

    // 显示蛋浮动打开动画
    popupPrizeLayer() {
        let self = this,
            layerContextNode = self._containerNode.getChildByName("LayerContext");
        layerContextNode.getComponent(cc.Animation).play();
        // 动画开始播放时，重置节点元素的坐标后，再显示节点。（避免二次播放时，屏幕上出现闪现的情况） By Dyllon
        setTimeout(() => { layerContextNode.active = true; }, 1);
    },

    // 显示结果层
    showResult() {
        let self = this;
        // 传递中奖结果
        self._layerResultNode.getComponent("LayerResult").show({
            result: !self._prize.status ? null : {
                prize: { name: self._prize.name, level: self._prize.level }
            }
        });
        // 关闭抽奖动画层
        self._containerNode.getChildByName("LayerContext").active = false;
        // 重置游戏状态
        self._status = "ready";
    },

    // update(dt) { },
});
