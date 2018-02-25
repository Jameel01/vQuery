/*
* @Author: youngjm
* @Date:   2017-08-09 20:55:04
* @Last Modified by:   youngjm
* @Last Modified time: 2017-12-19 20:08:08
*   核心框架：构造函数与原型函数组合
*/
//事件绑定
function myAddEvent(obj,sEv,fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+sEv,function(event){
			if(false == fn.call(obj)){
				event.cancelBubble = true;//取消冒泡
				return false;//除了Firefox取消默认事件
			}
		});
	}else {
		obj.addEventListener(sEv,function(event){
			if(false == fn.call(obj)){
				event.cancelBubble = true;//取消冒泡
				event.preventDefault();//Firefox取消默认事件
			}
		},false);
	}
}



//通过class名称获取元素
function getClass(oParent,sClass){
	var oEv = document.getElementsByTagName('*');
	var aResult = [];
	var re = new RegExp('\\b'+sClass+'\\b',i);
	for(var i=0; i<oEv.length; i++){
		if(re.test(oEv[i].className)){
			aResult.push(oEv[i]);
		}
	}
	return aResult;
}


/*
*	获取元素样式
*	currentStyle  IE
*	getComputedStyle   Chrome firefox safari IE 9-11
*	getComputedStyle(obj,null)['borderLeftWidth']//FireFox/safari获取边框样式需要加具体方向
*/
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];//IE
	}
	else{
			return getComputedStyle(obj,null)[attr];//Chrome/firefox/safari/IE 9.10.11
		}
}
/*
*   获取元素
*	$('input') element
*	$('#div1') ID
*	$('.box') Class
*	$(this) object
*	$(function(){}) window.onload
*/
function VQuery(vArg){
	this.elements=[];//保存获取元素
	switch (typeof vArg) {
		case 'function':
			myAddEvent(window,'load',vArg);
			break;
		case 'string':
			switch(vArg.charAt(0)){
				case '#':
					var obj = document.getElementById(vArg.substring(1));
					this.elements.push(obj);
					break;
				case '.':
					this.elements = getClass(document,vArg.substring(1));
					break;
				default:
					this.elements = document.getElementsByTagName(vArg);
			}
			break;
		case 'object':
			this.elements.push(vArg);
			break;
	}
}


/*
*	css('width','100px') 设置样式
*	css('width') 读取第一个元素样式
*	css({width:'100px',height:'100px'}) 设置多个样式
*/
VQuery.prototype.css = function(attr,value){
	if(arguments.length == 2){

		for(var i=0;i<this.elements.length;i++){
			this.elements[i].style[attr] = value;
		}
	}
	else{
			if(typeof attr == 'string'){
				return getStyle(this.elements[0],attr);
			}
			else{
					for(i=0;i<this.elements.length;i++){
					var k='';

					for(k in attr){

						this.elements[i].style[k] = attr[k];//非严格json格式
					}
				}
			}

	}
	return this;//VQuery链式操作
};


/*
* 功能：鼠标点击事件
* 参数：鼠标点击事件处理函数
*/
VQuery.prototype.click = function(fn){
	for(var i=0; i<this.elements.length; i++){
		myAddEvent(this.elements[i],'click',fn);
	}
	return this;//VQuery链式操作
};


/*
*	功能：事件绑定
*	$('input').bind('contextmenu',function(){
	//事件动作
});
*/
VQuery.prototype.bind= function(sEv,fn){
	for(var i=0; i<this.elements.length; i++){
		myAddEvent(this.elements[i],sEv,fn);
	}
	return this;//VQuery链式操作
};


/*size()元素对象个数*/
VQuery.prototype.size = function(){
	return this.elements.length;
};


/*
*	功能：对象深拷贝
*	参数：deepCopy(object);
	思路：
		for in 遍历对象每个属性
		利用递归进行深拷贝
	示例：
	var num = {
    			a:{b:10}
    		};
	var obj = $().deepCopy(num);
	var b = 20;
	alert(obj.a.b);//10
*/
VQuery.prototype.deepCopy =function(obj){
	if(typeof obj != 'object'){
		return obj;
	}
	var newObj ={};
	for(var attr in obj){
		newObj[attr] = arguments.callee(obj[attr]);
	}
	return newObj;
};


/*
*	功能：快速排序
*	参数：quickSort(需要排序的数组对象,排序顺序（true/false）);
		  第二个参数true为升序false为降序
*	var arr = [1,35,6,8,44,69,15];
*		1.设基准值，取数组中间值
*			var num = arr.Math.floor(arr.length/2);
*			var baseValue = arr.splice(num,1);//splice(位置，个数，替换项)
*		2.将数组分为左右两数组
*			升序：left存小于basevalue，right存大于等于basevalue
*			降序：left存大于等于basevalue，right存小于basevalue
*		3.利用递归循环执行
*			arguments.callee(left).concat(baseValue,arguments.callee(right));//concat()数组黏贴
*			严格模式下arguments.callee()是一个指向正在执行的函数的指针，会出错
*			解决方法：
*					VQuery.prototype.quickSort = (function sort(){
*									return shor();
*								})//使用命名函数表达式达到相同目的
*		4.return left+basevalue+right
*		示例：
*		alert($().quickSort(arr,true));//6,1,8,69,44,35,15
*		alert($().quickSort(arr,false));//69,44,35,15,8,6,1
*/
VQuery.prototype.quickSort = (function sort(arr,bool){
	if(arr.length<=1){
		return arr;
	}
	var num = Math.floor(arr.length/2);
	var baseValue = arr.splice(num,1);
	var left = [];
	var rigth = [];
	for(var i=0;i<arr.length;i++){
		if(arr[i]<baseValue){
			left.push(arr[i]);//存放小于中间值的数字
		}
		else{
			rigth.push(arr[i]);//存放大于中间值的数字
		}
	}
	if (bool === true) {
		return sort(left).concat(baseValue,sort(rigth));//升序
	}else {
		return sort(rigth).concat(baseValue,sort(left));//降序
	}
});


/*
*	功能：插件扩展函数
*	参数：extend(插件扩展函数名,插件扩展函数);
*	$().extend('size',function(){
	return this.elements.length;
});
*/
VQuery.prototype.extend = function(name,fn){
	VQuery.prototype[name] = fn;
};
/*
*	功能：属性操作
*	参数：attr（属性名，属性值（缺省时该函数为读取属性））
*	$().attr('className');//读取属性值
*	$().attr('className'，'box2');//设置属性值
*/
VQuery.prototype.attr = function (attr,value){
	if(arguments == 2){
		for(var i=0;this.elements.length;i++){
			this.elements[i][attr] = value;
		}
	}else {
		return this.elements[0][attr];
	}
	return this;
};

/*
*	功能：用$符号代替VQuery(vArg)函数
*/
function $(vArg){
	return new VQuery(vArg);
}
/*
*	功能：将元素的display属性设置为可见
*/
VQuery.prototype.show = function(){
	for(var i=0;i<this.elements.length;i++){
        		this.elements[i].style.display= 'block';
        	}
        	return this;//链式操作
};

/*
*	功能：将元素的display属性设置为不可见
*/
VQuery.prototype.hidden = function(){
	for(var i=0;i<this.elements.length;i++){
        		this.elements[i].style.display= 'none';
        	}
        	return this;//链式操作
};
/*
*	toggle()切换键:n>=1个参数，循环执行arguments内的函数 toggle（fn1.fn2,fn3....）;
*	思路：
*		1.for()循环给每个element绑定事件
*			for(var i=0;i<this.elements.length;i++){
      			addToggle(this.elements[i]);
      		}
      	2.	点击计数count，通过count++%——arguments.length循环执行——arguments内的函数
		3	count位置问题，放在addToggle内每次改变elenment对象时会新建空间，避免多个
			element使用同一个计数变量
      	4	var ——arguments = arguments;//引用toggle的arguments
      		function addToggle(obj){
				var count = 0;
				myAddEvent(obj,'click',function(obj){
					//执行toggle的arguments里面保存的函数
					//普通调用函数——arguments[count++%——arguments.length]();
					//带改变this指向的函数调用——arguments[count++%——arguments.length].call(obj)//执行函数并改变this指
					_arguments[count++%_arguments.length](obj);
				});
      		}
		示例：
			$('#btn2').toggle(function(){
	    			$('#div1').css('background','green');
	    		},function(){
	    			$('#div1').css('background','red');
	    		});
*/
VQuery.prototype.toggle = function(){
	var _arguments = arguments;//引用toggle的arguments
      		for(var i=0;i<this.elements.length;i++){
      			(function(obj){
      				var count=0;
      				myAddEvent(obj,'click',function(){
      					_arguments[count++%_arguments.length](obj);
      				});
      			})(this.elements[i]);
      		}
      		return this;//链式操作
};
/*
*	功能：鼠标移入移出事件函数
	参数：hover(鼠标移入事件函数,鼠标移出事件函数);
	思路：
		给每个元素绑定mouseover和mouseout事件
*/
VQuery.prototype.hover = function(fnover,fnout){
	for(var i=0;i<this.elements.length;i++){
      			myAddEvent(this.elements[i],'mouseover',fnover);
      			myAddEvent(this.elements[i],'mouseout',fnout);
      		}
      		return this;//链式操作
};
/*
	功能：查找父级下的子级元素
	参数：find（元素名）格式与css命名一样
	$().find('.box'); //class
	$().find('div'); //element
	思路：
		1.找到元素存入数组aResult中
		2.aResult是Array没有css方法
		3.将aResult存入新建的VQuery函数的elements属性中
		2.替换VQuery中的this.elements，即替换父级元素，使其能够链式操作
*/
VQuery.prototype.find = function(str){
	var aResult = [];
      		for(var i=0;i<this.elements.length;i++){
      			switch (str.charAt(0)) {
      				case '.':
      					var aEle = getClass(this.elements[i],str.substring(1));
      					aResult = aResult.concat(aEle);//getClass结果返回数组，可以进行数组操作
      					break;
      				default:
      					var aEle = this.elements[i].getElementsByTagName(str);
      					//aResult = aResult.concat(aEle);//会出错，原因是aEle是个集合可以进行循环操作，不能进行数组操作
      					appendArr(aResult,aEle);
      					break;
      			}
      		}
      		function appendArr(arr1,arr2){
				for(var i=0;i<arr2.length;i++){
					arr1.push(arr2[i]);
				}
			}

      		var NewQuery = new VQuery();
      		NewQuery.elements = aResult;//替换VQuery中的this.elements，使其能够链式操作
      		return NewQuery;
};

/*
*	eq():1个参数，number类型
*/
VQuery.prototype.eq = function(n){
	return $(this.elements[n]);
      	//return new VQuery(this.elements[n]);
};

/*
*	函数功能：获取元素索引
*	参数：获取索引的对象
*	获取父级下的子节点（该对象的兄弟节点）数组，循环匹配操作返回该对象的索引值
*/
function getIndex(obj){
	var aBrother = obj.parentNode.children;//父级节点下的子节点
	for(var i=0;i<aBrother.length;i++){
		if(aBrother[i]==obj){//当循环到与自己相等的节点时，返回i；
			return i;
		}
	}
}
/*
*	index()索引：返回当前元素索引值
*/
VQuery.prototype.index = function(){
	return getIndex(this.elements[0]);
};

/*
*	功能：1.可以改变width、height、opacity、fontSize、border等等样式
*		  2.该运动框架为缓冲运动
*	参数：第一个参数为json格式运动操作数据，第二个参数为运动完成后的处理函数（可以不写）
*	注意事项：
*			  1.border，FireFox/safair需加上具体方位，例borderLeftWidth	
*			  2.opacity，$().starMove('opacity',0-100);
*/
$().extend('animate',function(json,fn){
	for(var i=0;i<this.elements.length;i++){
		starMove(this.elements[i],json,fn);
	}
	function starMove(obj,json,fn){
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var bStop = true;//全部执行到位
			for(var attr in json){
				//获取当前值
				var iCur = 0;
				if(attr == 'opacity'){
					iCur = parseInt(parseFloat(getStyle(obj,attr))*100);
				}else {
					iCur = parseInt(getStyle(obj,attr));
				}
				//计算速度
				var iSpeed = (json[attr]-iCur)/8;
				iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
				//是否全部执行到位
				if(json[attr]!=iCur){
					bStop = false;
				}
				//样式操作
				if(attr == 'opacity'){
						obj.style.opacity = (iCur+iSpeed)/100;
						obj.style.filter = 'alpha(opacity:'+(iCur+iSpeed)+')';
					}else {
						obj.style[attr] = iCur+iSpeed+'px';
					}
			}

			//检测停止
			if(bStop){
				clearInterval(obj.timer);
				if(fn){
					fn();
				}
			}

		},30);
		
	}
	return this;//链式操作
});


/*
*	功能：弹性碰撞+重力运动
*	参数：elasticMove(gravity)//gravity:（重力/质量）整数
*	例：$('div').elasticMove(10);
*/
$().extend('elasticMove',function(gravity){
	for(var i=0;i<this.elements.length;i++){
		elastic(this.elements[i],gravity);
	}
	function elastic(obj,gravity){
		var iSpeedX = 0;
		var iSpeedY = 0;
		obj.onmousedown = function(ev){
			var disX = 0;
			var disY = 0;
			var lastX = 0;
			var lastY = 0;

			var ev = ev || event;
			disX = ev.clientX-obj.offsetLeft;
			disY = ev.clientY-obj.offsetTop;


			document.onmousemove = function(ev){
				var ev = ev || event;
				var l = ev.clientX-disX;
				var t = ev.clientY-disY;

				obj.style.left = l+'px';
				obj.style.top = t+'px';

				//根据移拖拽速度计算松开鼠标后物体运动速度
				iSpeedY = t-lastY;
				iSpeedX = l-lastX;
				lastY = t;
				lastX = l;
			};
			document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;
					fn(obj,gravity);//模拟重力运动函数
				};

			clearInterval(obj.timer);//防止未松开鼠标自动脱落
			
		};

		//模拟重力运动函数
		function fn(obj,gravity){
			
			clearInterval(obj.timer);
			obj.timer=setInterval(function(){
				iSpeedY+=gravity;//模拟重力
				var l = obj.offsetLeft+iSpeedX;
				var t = obj.offsetTop+iSpeedY;
				
				if (t>=document.documentElement.clientHeight-obj.offsetHeight) {
					iSpeedY*=-0.8;//Y轴反向减速
					iSpeedX*=0.8;//X轴减速
					t=document.documentElement.clientHeight-obj.offsetHeight;//防止超过可视区底部
				}else if (t<=0) {
					iSpeedY*=-1;
					iSpeedX*=0.8;
					t=0;//防止超过可视区顶部
				}
				if (l>=document.documentElement.clientWidth-obj.offsetWidth) {
					iSpeedX*=-0.8;
					l=document.documentElement.clientWidth-obj.offsetWidth;//防止超过可视区右边
				}else if (l<=0) {
					iSpeedX*=-0.8;
					l=0;//防止超过可视区左边
				}
				//解决速度飘移，停不下来问题
				if (Math.abs(iSpeedY)<1) {
					iSpeedY=0;
				}
				if (Math.abs(iSpeedX)<1) {
					iSpeedX=0;
				}
				//停止条件
				if (iSpeedX==0 && iSpeedY==0 && t==document.documentElement.clientHeight-obj.offsetHeight){
					clearInterval(obj.timer);
					//alert('stop');
				}else {

					obj.style.left = l+'px';
					obj.style.top = t+'px';

				}

				//document.title =iSpeedX;//检测iSpeedX

			},30);
		}
	}
	return this;
});
/*
*	$().ajax()无刷新数据传输（阿贾克斯）
*	参数：（模式，地址，发送数据，成功返回执行函数）
*	模式：
		1.'get':与 POST 相比，GET 更简单也更快，并且在大部分情况下都能用
		2.'post':在以下情况中，请使用 POST 请求：
					无法使用缓存文件（更新服务器上的文件或数据库）
					向服务器发送大量数据（POST 没有数据量限制）
					发送包含未知字符的用户输入时，POST 比 GET 更稳定也更可靠
*/
$().extend('ajax',function(method,url,data,success){

	var xtr=null;
	try {
		xtr = new XMLHttpRequest();
	} catch (e) {
		xtr = new ActiveXObject('Microsoft.XMLHTTP');
	}

	if (method == 'get' && data) {
		url += '?'+data;
	}

	xtr.open(method,url,true);
	if (method == 'get') {
		xtr.send();
	}else {
		xtr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
		xtr.send(data);
	}

	xtr.onreadystatechange = function(){
	 	if(xtr.readyState==4){
	 		if (xtr.status==200) {
	 			success && success(xtr.responseText);
	 		}else {
	 		alert('出错了，erro：'+xtr.status);
	 		}
	 	}
	 	
	};
});

/*
*	功能：鼠标悬浮事件
*	参数：（事件函数）
*/
$().extend('mouseover',function(fn){
	for(var i=0;i<this.elements.length;i++){
		myAddEvent(this.elements[i],'mouseover',fn);
	}
	return this;
});
/*
*	功能：鼠标移出事件
*	参数：（事件函数）
*/
$().extend('mouseout',function(fn){
	for(var i=0;i<this.elements.length;i++){
		myAddEvent(this.elements[i],'mouseout',fn);
	}
	return this;
});
/*
*	功能：鼠标移动事件
*	参数：（事件函数）
*/
$().extend('mousemove',function(fn){
	for(var i=0;i<this.elements.length;i++){
		myAddEvent(this.elements[i],'mousemove',fn);
	}
	return this;
});
/*
*	功能：鼠标按下事件
*	参数：（事件函数）
*/
$().extend('mousedown',function(fn){
	for(var i=0;i<this.elements.length;i++){
		myAddEvent(this.elements[i],'mousedown',fn);
	}
	return this;
});
/*
*	功能：鼠标弹起事件
*	参数：（事件函数）
*/
$().extend('mouseup',function(fn){
	for(var i=0;i<this.elements.length;i++){
		myAddEvent(this.elements[i],'mouseup',fn);
	}
	return this;
});
/*
*
*/
$().extend('jsonp',function(sUrl,success){
	var oScript = document.createElement('script');
	oScript.type = 'text/javascript';
	oScript.src = sUrl+'&callback=getJsonp';
	document.getElementsByTagName('head')[0].appendChild(oScript);
});