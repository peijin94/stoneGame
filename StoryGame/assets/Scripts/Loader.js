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
        card:cc.Prefab,
        board:cc.Node,
        pageView:cc.PageView,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad () {
        let that=this;
        wx.cloud.init(
            {
                env: 'inky-stone-onbz5'
            }
        );
        wx.cloud.database().collection(Story_Data).doc("5475f359-660b-40d5-b363-427cf78717e5").get({
            success:res=>{
                for(let i=0;i<res.data.StoryNames.length;i++){
                    that.addCard(res.data.StoryNames[i]);
                }
            }
        });
    },

    addCard:function(name){
        let card=cc.instantiate(this.card);         
        let brain= card.getComponent("CardBrain");
        brain.StoryName=name;
        this.pageView.addPage(card);    
    }

    // update (dt) {},
});
