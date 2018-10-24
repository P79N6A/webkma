cc.Class({
    extends: cc.Component,

    properties: {
        _rate: { default: 0, type: cc.Float },
        _score: { default: 0, type: cc.Integer }
    },

    init(params) {
        this._rate = params.rate || 1;  //0.01 ~ 1
        this._score = params.score || 1;
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        let self = this;
        if (otherCollider.tag == 99) return self.node.destroy();
        if (Math.random() > self._rate) {
            selfCollider.enabled = false;
            self.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);

            selfCollider.node.getComponent(cc.Animation).play().speed = 3;

            // 计算奖励
            let resut = { score: self._score },
                customEvent = new cc.Event.EventCustom('addScore', true);
            customEvent.detail = resut;
            self.node.dispatchEvent(customEvent);
            otherCollider.node.emit("showResult", resut);
            // 销毁对象
            setTimeout(() => {
                if (cc.isValid(self.node)) self.node.destroy();
            }, 600);
        } else {
            otherCollider.node.emit("showResult", {});
        }
    },

    // update (dt) {},
});
