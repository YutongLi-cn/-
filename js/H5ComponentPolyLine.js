// 基本折现图组件对象
var H5ComponentPolyLine=function (name,cfg) {

	var component=new H5ComponentBase(name,cfg);

	//绘制网格线.
	var w=cfg.width;
	var h=cfg.height;

	//加入一个画布。
	var cns=document.createElement("canvas");
	var ctx=cns.getContext("2d");
	cns.width=ctx.width=w;
	cns.height=ctx.height=h;
	component.append(cns);

	//水平网格线，100份 ——> 10份 背景层。
	var step=10;	
	ctx.lineWidth=1;
	ctx.strokeStyle="#AAAAAA";
	window.ctx=ctx;

	ctx.beginPath();
	for (var i = 0; i < step+1; i++) {
		var y=(h/step)*i;
		ctx.moveTo(0,y);
		ctx.lineTo(w,y);
	}
	ctx.stroke();

	//垂直网格
	step=cfg.data.length+1;
	var text_w=w/step>>0;
	ctx.beginPath();
	for (var i = 0; i < step+1; i++) {
		var x=(w/step)*i;
		ctx.moveTo(x,0);
		ctx.lineTo(x,h);

		if (cfg.data[i]) {
			var text=$('<div class="text"></div>');
			text.text(cfg.data[i][0]);
			text.css({
				width:text_w,
				left:x/2,
			});

			component.append(text);
		};
		
	}
	ctx.stroke();
	
	var cns=document.createElement("canvas");
	var ctx=cns.getContext("2d");
	cns.width=ctx.width=w;
	cns.height=ctx.height=h;
 	component.append(cns);


	/**
	 * 绘制折线及对应数据阴影
	 * { float }  per 0-1之间的数值，会根据这个值绘制最终数据的中间状态。
	 * @return
	 */

	var draw=function( per ){
		ctx.clearRect(0,0,w,h);
		
		//绘制折线  数据层。
		ctx.lineWidth=3;
		ctx.strokeStyle="#ff8878";
		var x=0,
			y=0;
		step=cfg.data.length+1;
		var row_w=w/(cfg.data.length+1);

		ctx.beginPath();
		//画点
		for(var i in cfg.data){
			var item=cfg.data[i];
			x=row_w*i+row_w;
			y=h*(1-item[1]*per);
			ctx.moveTo(x,y);
			ctx.arc(x,y,5,0,2*Math.PI);
		}
		ctx.stroke();

		//画线
		ctx.beginPath();
		ctx.moveTo(row_w,h*(1-cfg.data[0][1]*per));
		for(var i in cfg.data){
			var item=cfg.data[i];
			x=row_w*i+row_w;
			y=h*(1-item[1]*per);
			ctx.lineTo(x,y)
		}

		ctx.stroke();

		//绘制阴影	
		ctx.lineTo(x,h);
		ctx.lineTo(row_w,h);
		ctx.fillStyle="rgba(255,136,120,0.2)";
		ctx.fill();

		//写数据
		ctx.beginPath();
		for(var i in cfg.data){
			var item=cfg.data[i];
			x=row_w*i+row_w;
			y=h*(1-item[1]*per);
			ctx.moveTo(x,y);
			ctx.fillStyle=item[2]?item[2]:"#595959";
			ctx.fillText((item[1]*100>>0)+'%',x-10,y-10)
		}
		ctx.stroke();
	}

	component.on('onLoad',function(){
		//生长动画
		setTimeout(function(){
			var s=0;
			for(i=0;i<100;i++){
				setTimeout(function(){
					s+=0.01;
					draw(s)
				},i*10)
			}
		},cfg.growDelay)
	});
	component.on('onLeave',function(){
		//退场动画
		var s=1;
		for(i=0;i<100;i++){
			setTimeout(function(){
				s-=0.01;
				draw(s)
			},i*10)
		}
	});


	return component;//component.appendTO($(body));
}