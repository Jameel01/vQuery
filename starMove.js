/*
*	starMove()移动框架,2个参数starMove(attr,iTarget)
*	功能：1.可以改变width、height、opacity、fontSize、border
*		  2.该运动框架为缓冲运动
*	注意事项：1.opacity，不支持IE8及以下版本
*			  2.border，FireFox/safair需加上具体方位，例borderLeftWidth	
*			  3.opacity，$().starMove('opacity',0-100);
*/
$().extend('starMove',function(attr,iTarget){
	var _this = this;
	clearInterval(_this.timer);

	_this.timer = setInterval(function(){
  if(attr == 'opacity'){
        var iCur = parseInt(parseFloat(getStyle(_this.elements[0],attr)*100));//opacity需将浮点数转为整数
      }else {
        var iCur = parseInt(getStyle(_this.elements[0],attr));
      }	

      var iSpeed = (iTarget-iCur)/8;//调节运动速度
      iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

      if((iTarget-iCur)==0){

        clearInterval(_this.timer);

      }else{
        if(attr == 'opacity'){

          _this.elements[0].style.opacity = (iCur+iSpeed)/100;

        }else {
          _this.elements[0].style[attr] = iCur+iSpeed +'px';
        }
      }
	},30);
});
