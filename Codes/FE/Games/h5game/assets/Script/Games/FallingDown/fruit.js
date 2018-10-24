// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        //该精灵的分数
        score: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },


    //初始化精灵
    init(params) {
        //设置精灵node属性
        this.node.width = params.size.width
        this.node.height = params.size.height
        //设置精灵属性
        let frultSprite = this.getComponent(cc.Sprite)
        cc.loader.loadRes(params.path, cc.SpriteFrame, function (err, spriteFrame) {
            frultSprite.spriteFrame = spriteFrame
        })


        //设置刚体属性
        let rigidbody = this.getComponent(cc.RigidBody)
        let direction = Math.random() > 0.5 ? 1 : -1
        //设置随机旋转方向
        rigidbody.angularVelocity = Math.random() * 100 * direction
        //设置重力
        rigidbody.gravityScale = params.gravityScale
        //设置碰撞半径
        let physicsCircleCollider = this.getComponent(cc.PhysicsCircleCollider)
        physicsCircleCollider.radius = params.radius

        this.score = params.score
    },


    start() {

    },


    //碰撞处理
    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (otherCollider.node.name == 'Player' &&
            selfCollider.node.x < otherCollider.node.x + 35 &&
            selfCollider.node.x > otherCollider.node.x - 50 &&
            selfCollider.node.y < otherCollider.node.y + 50) {
                selfCollider.node.destroy();
                this.game.gainScore(this.score)
            }
    },


    update(dt) {
        if (this.node.y < - this.game.Background.height / 2 - 100)
            this.node.destroy();

    },
});
