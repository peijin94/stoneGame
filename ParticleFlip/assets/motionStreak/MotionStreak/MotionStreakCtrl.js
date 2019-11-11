cc.Class({
    extends: cc.Component,

    properties: {
        motionStreak: cc.MotionStreak,
        newTexture: {
            default: null,
            type: cc.Texture2D
        },
        gold: {
            default: null,
            type: cc.Node
        },
        trace: {
            default: null,
            type: cc.Node
        },        
        score: {
            default: null,
            type: cc.Label
        },        
        charge: {
            default: null,
            type: cc.Label
        },
        gamestart: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {
        this._changed = true;
        this.oldTexture = this.motionStreak.texture;

        
        this.xSpeed = -400;
        this.ySpeed = 300;
        this.tSpeed = 500;
        this.dtheta=0.05;
        this.target_x = 100;
        this.target_y = 100;
        this.target_width_x = 25;
        this.target_width_y = 25;
        this.Timeall = 0
        

        this.accLeft = false;
        this.accRight = false;

        
        this.running = false;

        this.drawing = this.trace.getComponent(cc.Graphics);
        this.drawing.lineWidth = 6;
        this.drawing.moveTo(-350, 0);

    },

    onClick: function () {
        
        this.dtheta=-this.dtheta;
        if (this.charge.string=="+"){
            this.charge.string='-'
        }else{
            this.charge.string='+'
        }
    },

    onStart: function(){
        this.gamestart.destroy();
        this.running = true;
    },

    update: function update(dt) {

        var dt0 = 1/60
        if( this.running){
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt0;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt0;
        }
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }


         //根据当前速度更新主角的位置
        this.gold.x += this.xSpeed * dt0;
        this.gold.y += this.ySpeed * dt0;


        var w_view = 700;
        var h_view = 600;
        if (this.gold.x > w_view / 2) {
            this.xSpeed = -this.xSpeed;
            this.gold.x = w_view / 2 - 0.0001;
        }

        if (this.gold.x < -w_view / 2) {
            this.xSpeed = -this.xSpeed;
            this.gold.x = -w_view / 2 + 0.0001;
        }

        
        
        if (this.gold.y > h_view / 2) {
            this.ySpeed = -this.ySpeed;
            this.gold.y = h_view / 2 - 0.0001;
        }

        if (this.gold.y < -h_view / 2) {
            this.ySpeed = -this.ySpeed;
            this.gold.y = -h_view / 2 + 0.0001;
        }

        this.xSpeed =this.xSpeed * Math.cos(this.dtheta) + this.ySpeed * Math.sin(this.dtheta)
        this.ySpeed =this.ySpeed * Math.cos(this.dtheta) - this.xSpeed * Math.sin(this.dtheta)


        var xtmp = this.xSpeed*this.tSpeed/Math.sqrt(Math.pow(this.xSpeed,2)+Math.pow(this.ySpeed,2))
        var ytmp = this.ySpeed*this.tSpeed/Math.sqrt(Math.pow(this.xSpeed,2)+Math.pow(this.ySpeed,2))
        
        this.xSpeed = xtmp
        this.ySpeed = ytmp

        this.drawing.lineTo(this.gold.x, this.gold.y);
        this.drawing.strokeColor = cc.Color.RED;
        this.drawing.stroke();
        
        //console.log(this.score);

        this.Timeall = this.Timeall +dt0

        this.score.string = "L:"+this.Timeall.toFixed(2)

        if(    this.gold.x > this.target_x -this.target_width_x 
            && this.gold.x < this.target_x +this.target_width_x
            && this.gold.y > this.target_x -this.target_width_x
            && this.gold.y < this.target_x +this.target_width_x){
            // position

            this.running = false
        }
        }
    }




});
