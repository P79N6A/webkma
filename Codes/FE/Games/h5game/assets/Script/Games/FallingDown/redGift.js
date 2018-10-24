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
        score: 0,
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    //初始化精灵
    init(params) {
        // console.log('params', params)
        //设置精灵node属性
        this.node.width = params.size.width
        this.node.height = params.size.height
        if (!!params.rotation)
            this.node.setRotation(params.rotation)
        // //设置精灵属性
        // let frultSprite = this.getComponent(cc.Sprite)
        // cc.loader.loadRes(params.path, cc.SpriteFrame, function (err, spriteFrame) {
        //     frultSprite.spriteFrame = spriteFrame
        // })


        //设置刚体属性
        let rigidbody = this.getComponent(cc.RigidBody)
        let direction = Math.random() > 0.5 ? 1 : -1
        // //设置随机旋转方向
        // rigidbody.angularVelocity = Math.random() * 100 * direction
        // //设置重力
        rigidbody.gravityScale = params.gravityScale
        // //设置碰撞半径
        let physicsPolygonCollider = this.getComponent(cc.PhysicsPolygonCollider)
        let i = 0
        while (i < physicsPolygonCollider.points.length) {
            let vec = physicsPolygonCollider.points[i]
            vec.x *= params.ratio
            vec.y *= params.ratio
            i++;
        }
        // physicsCircleCollider.radius = params.radius

        this.score = params.score
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    //碰撞处理
    onBeginContact: function (contact, selfCollider, otherCollider) {
        var rightLen = this.game.Player.width / 2,
            leftLen = this.game.Player.width / 2
        if (otherCollider.node.name == 'Player' &&
            selfCollider.node.x < otherCollider.node.x + rightLen &&
            selfCollider.node.x > otherCollider.node.x - leftLen &&
            !this.isContact) {
            this.isContact = true
            //播放音效
            cc.audioEngine.playEffect(this.scoreAudio, false);
            selfCollider.node.destroy();
            this.game.gainScore(this.score)
        } else if (otherCollider.node.name == 'Player' && selfCollider.node.x > otherCollider.node.x + rightLen) {
            //改变移动方向
            selfCollider.body.linearVelocity = cc.v2(Math.random() * 500, 100);
        } else if (otherCollider.node.name == 'Player' && selfCollider.node.x < otherCollider.node.x - leftLen) {
            //改变移动方向
            selfCollider.body.linearVelocity = cc.v2(Math.random() * -500, 100);
        }

    },



    start() {
        this.isContact = false
    },

    update(dt) {
        if (this.node.y < - this.game.Background.height / 2 - 100)
            this.node.destroy();
    },
});
