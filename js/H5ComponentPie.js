// 基本饼图组件对象
var H5ComponentPie=function (name,cfg) {

	var component=new H5ComponentBase(name,cfg);

	//绘制网格线.
	var w=cfg.width;
	var h=cfg.height;

	//加入一个画布。
	var cns=document.createElement("canvas");
	var ctx=cns.getContext("2d");
	cns.width=ctx.width=w;
	cns.height=ctx.height=h;
	$(cns).css('z-index',1);
	component.append(cns);

	var r=w/2;

	//底图层.
	ctx.beginPath();
	ctx.fillStyle="#eee";
	ctx.strokeStyle='#eee';
	ctx.lineWidht=1;
	ctx.arc(r,r,r,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();

	//绘制数据层。
	//新建画布。
	var cns=document.createElement("canvas");
	var ctx=cns.getContext("2d");
	cns.width=ctx.width=w;
	cns.height=ctx.height=h;
	$(cns).css('z-index',2);
	component.append(cns);

	//新建饼图。
	var colors=['#6F83D6','#4965D6','#61B7CF','#057D9F','#216477','#025167','#FF8100'];
	var sAngel=1.5*Math.PI;//起始角度。
	var eAngel=0//结束角度
	var aAngel=2*Math.PI;
	var step=cfg.data.length;

	for(var i=0;i<step;i++){
		var item=cfg.data[i];
		var color=item[2]||(item[2]=colors.pop());
		eAngel=sAngel+aAngel*item[1];

		ctx.beginPath();
		ctx.fillStyle=color;
		ctx.strokeStyle=color;
		ctx.lineWidht=1;
		ctx.moveTo(r,r);
		ctx.arc(r,r,r,sAngel,eAngel);
		ctx.fill();
		ctx.stroke();

		sAngel=eAngel;

		//加入项目文本及百分比.
		var text=$('<div class="text"></div>');
		var per=$('<div class="per"></div>')
		per.text(cfg.data[i][1]*100+'%');
		text.text(cfg.data[i][0]);
		text.append(per);

		var x=r+Math.sin(0.5*Math.PI-sAngel)*r;
		var y=r+Math.cos(0.5*Math.PI-sAngel)*r;
		if (x>w/2) {
			text.css("left",x/2+10);
		}else{
			text.css("right",(w-x)/2+10);
		};
		if (y>h/2) {
			text.css("top",y/2+10);
		}else{
			text.css('bottom',(h-y)/2+10);
		};
		if (cfg.data[i][2]) {
			text.css('color',cfg.data[i][2]);
		};
		text.css('opacity',0)
		component.append(text);
	};

	//加入蒙版层。
	//加入一个画布。
	var cns=document.createElement("canvas");
	var ctx=cns.getContext("2d");
	cns.width=ctx.width=w;
	cns.height=ctx.height=h;
	$(cns).css('z-index',3);
	component.append(cns);

	ctx.fillStyle="#eee";
	ctx.strokeStyle='#eee';
	ctx.lineWidht=1;

	//生长动画。
	var draw=function( _per ){
		ctx.clearRect(0,0,w,h);
		ctx.beginPath();
		ctx.moveTo(r,r)
		if (_per<=0) {
			ctx.arc(r,r,r,1.5*Math.PI,1.5*Math.PI+2*Math.PI);
		}else{
			ctx.arc(r,r,r,1.5*Math.PI,1.5*Math.PI+2*Math.PI*_per,true);
		}
		ctx.fill();
		ctx.stroke();

		if (_per>=1) {
			component.find('.text').css('opacity',1);
		};
		if (_per<=0) {
			component.find('.text').css('opacity',0);
		};
	};
	draw(0);

	component.on('onLoad',function(){
		//生长动画
		setTimeout(function(){
			var s=0;
			for(i=0;i<100;i++){
				setTimeout(function(){
					s+=.01;
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