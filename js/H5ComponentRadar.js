// 基本雷达图组件对象
var H5ComponentRadar=function (name,cfg) {

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

	var r=w/2;
	var step=cfg.data.length;

	//计算一个圆周上的坐标。
	//***已知圆心坐标（a，b）,r,角度deg.
	//***rad=(2*Math.PI/360)*(360/step)*i
	//***x=a+Math.sin(rad)*r
	//***y=b+Math.con(rad)*r
	
	//绘制网格背景。
	var isBlue=false;
	for (var j = 10; j > 0 ; j--) {
		ctx.beginPath();
		for (var i = 0; i < step; i++) {
			var rad=(Math.PI/180)*(360/step)*i;
			var x=r+Math.sin(rad)*r*(j/10);
			var y=r+Math.cos(rad)*r*(j/10);		
			// ctx.moveTo(r,r);
			ctx.lineTo(x,y);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle=(isBlue=!isBlue)?'#99c0ff':'#f1f9ff';
		ctx.fill();
	}

	//绘制伞骨图.
	ctx.beginPath();
	for(var i=0;i<step;i++){		
		var rad=(Math.PI/180)*(360/step)*i;
		var x=r+Math.sin(rad)*r;
		var y=r+Math.cos(rad)*r;		
		ctx.moveTo(r,r);
		ctx.lineTo(x,y);
		//输出文字.
		var text=$('<div class="text"></div>');
		text.text(cfg.data[i][0]);
		
		if (x>w/2) {
			text.css('left',x/2);
		}else{
			text.css('right',(w-x)/2);
		};
		if (y>h/2) {
			text.css('top',y/2);
		}else{
			text.css('bottom',(h-y)/2);
		};	
		if (cfg.data[i][2]) {
			text.css('color',cfg.data[i][2])
		}
		text.css('transition','all 0.1s '+(i*0.05)+'s');
		component.append(text);

	}
	ctx.strokeStyle="#e0e0e0";
	ctx.stroke();

	//绘制数据层。
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
		if (per>=1) {
			component.find('.text').css('opacity',1);
		}
		if (per<=0) {
			component.find('.text').css('opacity',0);
		}
		ctx.clearRect(0,0,w,h);
		//输出数据折线。
		ctx.beginPath();
		ctx.strokeStyle="#f00";
		for(var i=0;i<step;i++){
			var rad=(Math.PI/180)*(360/step)*i;
			var rate=cfg.data[i][1]*per;
			var x=r+Math.sin(rad)*r*rate;
			var y=r+Math.cos(rad)*r*rate;	
			ctx.lineTo(x,y);
		}
		ctx.closePath();
		ctx.stroke();

		//输出点。
		ctx.fillStyle="#f00";
		for(var j=0;j<step;j++){
			ctx.beginPath();	
			var rad=(Math.PI/180)*(360/step)*j;
			var rate=cfg.data[j][1]*per;
			var x=r+Math.sin(rad)*r*rate;
			var y=r+Math.cos(rad)*r*rate;	
			ctx.arc(x,y,3,0,2*Math.PI);
			ctx.closePath();
			ctx.fill();
		}	
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