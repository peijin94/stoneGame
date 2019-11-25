// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
        StoryButton: cc.Node,       
        StoryName:"SchoolGame",
        StoryTitle:"科大启示录",
        ViceTitle:"科大新生入学指北",
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.colorCycle();
        let that = this;
        this.StoryButton.on('touchend',function(event){
            window.StoryName=that.StoryName;
            cc.director.loadScene("GamePlay");
        });
    },

    colorCycle:function(){
        let color= new cc.Color();
        switch(this.node.getSiblingIndex()%3){
            case 0: color.fromHEX("#FFC8C8");break;
            case 1: color.fromHEX("#C8FFC8");break;
            case 2: color.fromHEX("#C8C8FF");break;
        }
        this.node.color=color;
    }

    // update (dt) {},
});
