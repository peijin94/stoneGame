cc.Class({
    extends: cc.Component,

    properties: {
        ChoiceLabel:cc.Label,
        text:'选项',
    },

    start () {
        this.ChoiceLabel.string=this.text;
    },
});
