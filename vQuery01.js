/*
* @Author: youngjm
* @Date:   2017-08-09 20:55:04
* @Last Modified by:   youngjm
* @Last Modified time: 2017-08-11 21:30:29
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
function vQuery(vArg){
	this.elements=[];//保存获取对象
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
vQuery.prototype.css = function(attr,value){
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
	return this;//vQuery链式操作
};


/*点击事件*/
vQuery.prototype.click = function(fn){
	for(var i=0; i<this.elements.length; i++){
		myAddEvent(this.elements[i],'click',fn);
	}
	return this;//vQuery链式操作
};


/*
*	添加执行任意事件
*	$('input').bind('contextmenu',function(){
	//事件动作
});
*/
vQuery.prototype.bind= function(sEv,fn){
	for(var i=0; i<this.elements.length; i++){
		myAddEvent(this.elements[i],sEv,fn);
	}
	return this;//vQuery链式操作
};


/*元素对象个数*/
vQuery.prototype.size = function(){
	return this.elements.length;
};


/*
*	obj深拷贝：1个参数 $().deepCopy(object);
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
vQuery.prototype.deepCopy =function(obj){
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
*	快速排序：2个参数$().quickSort(Array,boolean);
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
*					vQuery.prototype.quickSort = (function sort(){
*									return shor();
*								})//使用命名函数表达式达到相同目的
*		4.return left+basevalue+right
*		示例：
*		alert($().quickSort(arr,true));//6,1,8,69,44,35,15
*		alert($().quickSort(arr,false));//69,44,35,15,8,6,1
*/
vQuery.prototype.quickSort = (function sort(arr,boo){
	if(arr.length<=1){
		return arr;
	}
	var num = Math.floor(arr.length/2);
	var baseValue = arr.splice(num,1);
	var left = [];
	var rigth = [];
	for(var i=0;i<arr.length;i++){
		if(arr[i]<baseValue){
			left.push(arr[i]);
		}
		else{
			rigth.push(arr[i]);
		}
	}
	if (boo == true) {
		return sort(left).concat(baseValue,sort(rigth));
	}else {
		return sort(rigth).concat(baseValue,sort(left));
	}
});


/*
*	插件:2个参数 $().extend('extendName',fn);
*	$().extend('size',function(){
	return this.elements.length;
});
*/
vQuery.prototype.extend = function(name,fn){
	vQuery.prototype[name] = fn;
};


/*套个$*/
function $(vArg){
	return new vQuery(vArg);
}
/*
*	显示元素函数
*/
$().extend('show',function(){
      		for(var i=0;i<this.elements.length;i++){
        		this.elements[i].style.display= 'block';
        	}
        	return this;//链式操作
      	});
/*
*	隐藏元素函数
*/
$().extend('hidden',function(){
      		for(var i=0;i<this.elements.length;i++){
        		this.elements[i].style.display= 'none';
        	}
        	return this;//链式操作
      	});
/*
*	切换键:n>=1个参数，循环执行arguments内的函数 toggle（fn1.fn2,fn3....）;
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
$().extend('toggle',function(){
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
      	});
/*
*	hover事件:2个参数$().hover(fnover,fnout);
	思路：
		给没个元素绑定mouseover和mouseout事件
*/
$().extend('hover',function(fnover,fnout){
      		for(var i=0;i<this.elements.length;i++){
      			myAddEvent(this.elements[i],'mouseover',fnover);
      			myAddEvent(this.elements[i],'mouseout',fnout);
      		}
      		return this;//链式操作
      	});

$().extend('find',function(str){
      		var aResult = [];
      		for(var i=0;i<this.elements.length;i++){
      			switch (str.charAt(0)) {
      				case '.':
      					var aEle = getClass(this.elements[i],str.substring(1));
      					aResult = aResult.concat(aEle);
      					break;
      				default:
      					var aEle = this.elements[i].getElementsByTagName(str);
      					//aResult = aResult.concat(aEle);//会出错，原因是aEle是个集合不能进行数组操作
      					appendArr(aResult,aEle);
      					break;
      			}
      		}
      		function appendArr(arr1,arr2){
				for(var i=0;i<arr2.length;i++){
					arr1.push(arr2[i]);
				}
			}
      		var newQuery = $();
      		newQuery.elements = aResult;
      		return newQuery;
      	});

