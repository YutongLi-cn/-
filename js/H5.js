var H5=function(){
	this.id=("h5_"+Math.random()).replace(".","_");
	this.el=$("<div class='h5' id='"+this.id+"'></div>").hide();
	this.page=[];
	this.slide=[];
	$("body").append(this.el);

	// 新增一个页
	/**
	 * @param {string} name 组件的名称，会加入classname中
	 * @param {string} text 页内默认文本。
	 * @return {h5} h5对象，可以重复使用h5对象支持的方法。
	 */
	this.addPage=function(name,text){
		var page=$("<div class='h5_page section'></div>");

		if (name!=undefined) {
			page.addClass("h5_page_"+name);
		}
		if (text!=undefined) {
			page.text(text);
		}
		this.el.append(page);
		this.page.push(page);
		if (typeof this.whenAddPage==='function') {	
			this.whenAddPage ();
		}
		return this;
	}
	//新增一个滑块
	this.addSlide=function(){
		var slide=$("<div class='slide'></div>");
		this.slide.push(slide);
		var page = this.page.slice(-1)[0];
		page.append(slide);
		return this;
	}
	//滑块中增加图文
	this.addSlideComponent=function(name,cfg){
		var cfg
		cfg || {};
		cfg=$.extend({
			type:"base"
		},cfg);
		var slide = this.slide.slice(-1)[0];
		var slideComponent=new H5ComponentBase(name,cfg);
		slide.append(slideComponent);
		return this;
	}
	// 新增一个组件
	this.addComponent=function(name,cfg){
		var cfg= cfg || {};

		cfg=$.extend({
			type:"base"
		},cfg);

		var component;
		var page = this.page.slice(-1)[0];//选取page数组中最后一个元素。
		switch(cfg.type){
			case "base":
				component= new H5ComponentBase(name,cfg);
				break;
			case "polyline":
				component= new H5ComponentPolyLine(name,cfg);
				break;
			case "pie":
				component= new H5ComponentPie(name,cfg);
				break;
			case "bar":
				component= new H5ComponentBar(name,cfg);
				break;
			case "bar_v":
				component= new H5ComponentBar_v(name,cfg);
				break;
			case "radar":
				component= new H5ComponentRadar(name,cfg);
				break;
			case "ring":
				component= new H5ComponentRing(name,cfg);
				break;
			case "point":
				component= new H5ComponentPoint(name,cfg);
				break;
			default:
			break;
		}
		page.append(component);

		return this;
	}
	//h5对象方法初始化呈现。
	this.loader=function(firstPage){	
		this.el.fullpage({
			slidesNavigation:true,
			controlArrowColor:true,
			onLeave:function(index,nextIndex,direction){
				$(this).find(".h5_component").trigger("onLeave");//trigger触发哪一个事件。
			},
			afterLoad:function(anchorLInk,index,direction){
				$(this).find(".h5_component").trigger("onLoad");
			}
		});
		this.el.show();
		this.page[0].find(".h5_component").trigger("onLoad");
		if(firstPage){
            $.fn.fullpage.moveTo( firstPage );
        }
	}
	return this;
};

