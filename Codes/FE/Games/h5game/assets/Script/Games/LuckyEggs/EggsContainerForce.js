cc.Class({
    extends: cc.Component,

    properties: {
    },

    start() {

    },

    onBeginContact: (contact, selfCollider, otherCollider) => {
        let float = Math.random() > 0.5 ? 1 : -1;
        otherCollider.body.linearVelocity = cc.v2(Math.random() * 100 * float, 2800);
    }
});
