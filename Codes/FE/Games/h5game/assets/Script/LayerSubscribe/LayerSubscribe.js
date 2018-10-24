const request = require("../Utils/Request");

cc.Class({
    extends: cc.Component,

    properties: {
        qrCode: { default: null, type: cc.Node, displayName: "小程序码精灵" }
    },

    onLoad() { },

    start() {
        let self = this;

        cc.loader.load("http://bos-kcmsdesign.iwanqi.cn/00000000-0000-0000-0000-000000000000/KMA/8cf84528-1c45-4d67-9d68-a4a56b2cfbde.jpg",
            function (err, tex) {
                if (err) return console.log(err);

                self.qrCode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            });
    }
});
