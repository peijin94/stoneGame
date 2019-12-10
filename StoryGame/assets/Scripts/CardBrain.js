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
        TitleLabel:cc.Label,
        DescriptionLabel:cc.Label,
        TagLayOut:cc.Node,
        Tag:cc.Node,
        TitleImage:cc.SpriteFrame,       
        StoryName:"",
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
        let db=wx.cloud.database();
        db.collection(Story_List).where({
            fileName:that.StoryName
        })
        .get({success:res=>
            {
                console.log(res.data);
                that.colorCycle();
                that.setButton();
                that.setLabel(res.data[0].title,res.data[0].description);
                that.setTags(res.data[0].tags);
                //that.setImage64(res.data[0].titleImage);

            }
        })


    },

    colorCycle:function(){
        let color= new cc.Color();
        let num=this.node.getSiblingIndex();
        switch(num%3){
            case 0: color.fromHEX("#FFC8C8");break;
            case 1: color.fromHEX("#C8FFC8");break;
            case 2: color.fromHEX("#C8C8FF");break;
        }
        this.node.color=color;
        num++;
        switch(num%3){
            case 0: color.fromHEX("#FFC8C8");break;
            case 1: color.fromHEX("#C8FFC8");break;
            case 2: color.fromHEX("#C8C8FF");break;
        }
        this.TagLayOut.color=color;
    },

    setLabel:function(title,description){
        this.TitleLabel.string=title;
        this.DescriptionLabel.string=description;
    },

    setTags:function(array){
        for(let i=0;i<array.length;i++){
            let newtag=cc.instantiate(this.Tag);
            newtag.getComponent(cc.Label).string=array[i];
            newtag.parent=this.TagLayOut;
        }
    },

    setButton:function(){
        let that = this;
        this.StoryButton.on('touchend',function(event){
            Story_Name=that.StoryName;
            cc.director.loadScene("GamePlay");
        });
    },

    setImage64:function(str){
        let that=this;
        let img=new Image();
        img.src=str;
        img.onload=function(){
            let texture=new cc.Texture2D();
            texture.setMipmap(false);
            texture.initWithElement(img);
            that.TitleImage.spriteFrame=new cc.spriteFrame(texture);
        };        
    },

    // update (dt) {},
});
