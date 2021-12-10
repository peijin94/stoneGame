cc.Class({
    extends: cc.Component,

    properties: {
        StoryName:""
    },


    // onLoad () {},

    start () {

    },

    loadGame:function(){
        Story_Name=this.StoryName;
        cc.director.loadScene("GamePlay");
    },

    // update (dt) {},
});
