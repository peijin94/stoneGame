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
        lay:cc.Node,
        out:cc.Node,
        scrollView:cc.ScrollView,
        but:cc.Prefab,
        board:cc.Prefab,
        imageFrame:cc.Prefab,
        storyName:'intercept',
        playerName:'喵喵',
        story:undefined,
        myStory:undefined,
        started:false,
        downloaded:false,
        tmpPath:'',
        bar:cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad(){
        var inkjs=require('inkjs');
        this.story=inkjs.Story;
    },

    onEnable(){        
        this.playerName=Player_Name;
        this.storyName=Story_Name;
        this.loadStory(this.storyName,this.playerName);
    },

    loadStory:function (storyname,playername) {
        this.lay.destroyAllChildren();
        this.out.destroyAllChildren();
        let that=this;   
        //本地资源加载json的解决方案   
        // cc.loader.loadRes(storyname,cc.JsonAsset,function (err,JS){
        //     if (err) {
        //         cc.log(err.message || err);
        //         return;
        //     }
        //     that.myStory=new that.story(JS.json);
        //     if(that.myStory.variablesState.$("player_name")!=null)that.myStory.variablesState.$("player_name",playername);
        //     cc.log('success');
        //     that.continueToNextChoice();
        // });
        //微信云开发存储空间加载json的解决方案
        if(cc.sys.platform===cc.sys.WECHAT_GAME){
            wx.cloud.init(
                {
                    env: 'inky-stone-onbz5'
                }
            );
            if(this.downloaded===false){
                this.bar.active=true;
                const downloadTask=wx.cloud.downloadFile({
                    fileID: WeChat_Cloud_Path+storyname+'.json', // 文件 ID
                    success: res => {
                      // 返回临时文件路径
                      console.log(res.tempFilePath);
                      let tmpPath=res.tempFilePath;
                      this.tmpPath=tmpPath;
                      this.loadTemp(storyname,playername);
                    },
                    fail:()=>{
                        that.XHRload(storyname,playername);
                    }
                });

                downloadTask.onProgressUpdate((res)=>{
                    console.log(res.progress);
                    this.bar.getComponent(cc.ProgressBar).progress=res.progress/100;
                    if(res.progress===100)this.bar.active=false;
                });
            }
            else{
                that.loadTemp(storyname,playername);
            }
        }
        //网络加载json的解决方案
        else{
            this.XHRload(storyname,playername);
        }       
    },

    // update (dt) {},
    end:function(){
        let end=this.addLine('---The End---');
        let str=end.getComponent(cc.Label);
        str.fontSize*=2;
        str.lineHeight=str.fontSize;
        let that=this;
        var restartButton=this.addButton('重新开始');
        let color=new cc.Color();
        color.fromHEX("#09BB07");
        restartButton.children[0].color=color;
        restartButton.on('touchend',function(event){
            that.myStory=null;
            that.started=false;
            that.loadStory(that.storyName,that.playerName);
        });
        var backButton=this.addButton('返回菜单');
        color.fromHEX("#E64340");
        backButton.children[0].color=color;
        backButton.on('touchend',function(event){
            cc.director.loadScene("Menu");                      
        });
        color.fromHEX("#FFFFFF");
        restartButton.children[0].children[0].color=color;
        backButton.children[0].children[0].color=color;
    },

    continueStory:function(cycle){
        if(!this.started){
            this.started=true;
        }
        var tags = this.myStory.currentTags;
        for(let i=0; i<tags.length; i++) {
            var tag = tags[i];
            var splitTag = this.splitPropertyTag(tag);
            if( splitTag && splitTag.property == "IMAGE" ) {
                this.addImage(splitTag.val);
            }
            if(splitTag&&splitTag.property=="IMAGE64"){
                this.addImage64(splitTag.val);
            }
        }
        this.addLine(this.myStory.Continue());
        if(!cycle)this.continueToNextChoice();
    },

    continueToNextChoice:function(){
        this.lay.destroyAllChildren();
        if (!this.myStory.canContinue && this.myStory.currentChoices.length === 0) this.end();
        //this.board.string='';
        else if(this.myStory.canContinue){
            let that=this;
            var continueButton=this.addButton(this.started?'点击继续':'点击开始');
            if(this.started){
                var continueAllButton=this.addButton('点击跳过');
                continueAllButton.on('touchend',function(event){
                    while(that.myStory.canContinue)that.continueStory(true);
                    that.continueToNextChoice();
                });
            }
            
            continueButton.on('touchend',function(event){
                that.continueStory(false);
            });
        }
        else if(this.myStory.currentChoices.length > 0){
            for (let i = 0; i < this.myStory.currentChoices.length; ++i) {           
                var choice = this.myStory.currentChoices[i];
                var button=this.addButton(choice.text);
                let that=this;
                button.on('touchend',function(event){                    
                    that.myStory.ChooseChoiceIndex(i);
                    that.continueStory(false);
                });                  
            }
        }
        else this.end();
    },

    addLine:function(string){
        let newLine=cc.instantiate(this.board);
        newLine.getComponent(cc.Label).string=string;
        newLine.parent=this.out;
        this.scrollView.scrollToBottom(1.0);
        return newLine;
    },

    addButton:function(text){
        let button=cc.instantiate(this.but);
        button.getComponent('ChoiceButton').text=text;
        button.parent=this.lay;
        return button;
    },

    addImage:function(url){
        let that=this;
        let image=cc.instantiate(this.imageFrame);
        cc.loader.load(url,function(err,texture) {
            image.getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(texture);
            image.parent=that.out;
        });
    },

    addImage64:function(str){
        let that=this;
        let image=cc.instantiate(this.imageFrame);
        let img=new Image();
        img.src="data:image/png;base64,"+str;
        img.onload=function(){
            let texture=new cc.Texture2D();
            texture.setMipmap(false);
            texture.initWithElement(img);
            image.getComponent(cc.Sprite).spriteFrame=new cc.spriteFrame(texture);
            image.parent=that.out;
        };        
    },

    // addInput:function(defaultText,placehoder){
    //     let newInput=cc.instantiate()
    // }

    splitPropertyTag:function(tag) {
        var propertySplitIdx = tag.indexOf(":");
        if( propertySplitIdx != null ) {
            var property = tag.substr(0, propertySplitIdx).trim();
            var val = tag.substr(propertySplitIdx+1).trim(); 
            return {
                property: property,
                val: val
            };
        }
        return null;
    },

    XHRload:function(storyname,playername){
        var xhr =cc.loader.getXMLHttpRequest();
        xhr.open("GET", Server_Name + storyname +'.json', true);//Server_Name请在Global.js中配置
        xhr.onerror=()=>{console.log('请检查你的网络连接');}
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                let responseJson=JSON.parse(xhr.responseText);
                that.myStory=new that.story(responseJson);
                if(that.myStory.variablesState.$("player_name")!=null)that.myStory.variablesState.$("player_name",playername);
                cc.log('success');
                that.continueToNextChoice();
            }
        };
        xhr.send();
    },

    loadTemp:function(storyname,playername){
        let that=this;
        wx.getFileSystemManager().readFile({
            filePath:that.tmpPath,
            encoding:'utf8',
            success:(response)=>{
                let responseText=response.data;
                let mew=responseText.indexOf('{');
                responseText=responseText.substr(mew,responseText.length-mew);
                let responseJson=JSON.parse(responseText);
                that.myStory=new that.story(responseJson);
                if(that.myStory.variablesState.$("player_name")!=null)that.myStory.variablesState.$("player_name",playername);
                console.log('success');
                that.downloaded=true;
                that.continueToNextChoice();
            },
            fail:()=>{
                that.downloaded=false;
                that.loadStory(storyname,playername);
            }
        });
    }

});
