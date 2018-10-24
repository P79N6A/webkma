cc.Class({
    extends: cc.Component,

    properties: {
        successLayer: { default: null, type: cc.Node },
        failedLayer: { default: null, type: cc.Node },
        _result: { default: null, type: cc.Object }
    },

    onLoad() {
        let self = this;
        self.node.active = false;
    },

    start() {

    },

    show(params) {
        let self = this;
        self._result = params.result || null;
        self.node.active = true;
        self.successLayer.active = false;
        self.failedLayer.active = false;

        if (self._result && self._result.prize) {
            self.successLayer.active = true;
            cc.find("Body/Title/Label", self.successLayer).getComponent(cc.Label).string = self._result.prize.name;
        } else {
            self.failedLayer.active = true;
        }
    },

    btnAction(event, action) {
        let self = this;
        switch (action) {
            case "return":
                self.node.active = false;
                break;
            case "subscribe":
                console.log("subscribe");
                break;
            case "submit":
                console.log("form submit");
                break;
        }
    }
});
