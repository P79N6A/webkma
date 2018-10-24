cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() { },

    start() {
        this.node.on("showResult", this.showResult, this);
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        let self = this,
            rigidBody = selfCollider.node.getComponent(cc.RigidBody);
        rigidBody.linearVelocity = cc.v2(0, 0);
        selfCollider.enabled = false;
        // 碰壁后直接销毁对象
        if (otherCollider.tag == 99) return self.node.destroy();
    },

    animFinished(type, animState) {
        this.node.destroy();
    },

    showResult(result) {
        let self = this,
            mAnimation = self.node.getComponent(cc.Animation);
        mAnimation.play("Fishnet");
        if (result.score) {
            self.node.getChildByName("Score").getComponent(cc.Label).string = result.score;
            self.node.getComponent(cc.Animation).playAdditive("FishnetScore");
        }
        mAnimation.on("finished", function (type, animState) {
            if (!result.score || animState.name == "FishnetScore") this.node.destroy();
        }, self);

    },

    update(dt) {
        let rigidBody = this.node.getComponent(cc.RigidBody);
        // if (rigidBody.enabled == false) {
        //     rigidBody.linearVelocity = cc.v2(0, 0);
        //     console.log(rigidBody);
        // }
        // console.log(rigidBody.enabled);
    }
});
