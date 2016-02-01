window.baidu =  window.baidu || {};

window.baidu.Slider=function(){
	var oSilder;
	var aMove;
	var oWrapper;
	var oli;
	var WindowWidth;//屏幕宽度
	var index = 0;//页码
	var autoTimer;//自动轮播计时器
	var autoMove;//自动轮播函数

	//初始化
	function init(option){
		defaultOption(option);
		getDom(option.id);
		utils.putHTML();
		addEvent();
		//是否需要自动轮播
		if(option.auto){
			autoMove=utils.autoMoveCreator(option);
			autoMove();
		}
	}
	//初始化默认值
	function defaultOption(option){
		option.auto=option.auto || false;
		option.interval =option.interval || 1100;
	}
	//获取元素节点
	function getDom(id){
		oSilder=document.getElementById(id);
		aMove=oSilder.getElementsByClassName('move');
		oWrapper=oSilder.getElementsByClassName('wrapper')[0];
		oli=document.getElementsByTagName('li');
	}
	
	//给oSilder绑定事件
	function addEvent(){
		var startpoint, //起始点
		  	endpoint, //终止点
		  	deltaX,//手指的水平滑动距离
		  	wrapperLeft;//轮播图的left值

		//手指接触屏幕,记住位置
		oSilder.addEventListener('touchstart',touchStartHandle,false);
		//手指滑动,计算手指滑动距离
		oSilder.addEventListener('touchmove',touchMoveHandle,false);
		//手指离开屏幕,加入动画     
		oSilder.addEventListener('touchend',touchEndHandle,false);
		//添加窗体变化事件
		window.addEventListener('resize',resizeHandle,false);

		//初始化窗体大小
		resizeHandle();

		//touchstart事件的处理函数
		function touchStartHandle(e){
			e.preventDefault && e.preventDefault(); 

			var touch = e.touches[0];
			startpoint={
				x: touch.pageX,
                y: touch.pageY
			}
			utils.stopMove(oWrapper);
			wrapperLeft=parseInt(oWrapper.style.left);
			clearInterval(autoTimer);

			return false;
		}
		//touchmove事件的处理函数
		function touchMoveHandle(e){
			e.preventDefault && e.preventDefault(); 
			var touch = e.touches[0];
			var targ;
            endpoint = {
                x: touch.pageX,
                y: touch.pageY
            }
            deltaX = endpoint.x - startpoint.x;
            targ=wrapperLeft+deltaX;
            //手指右移
            if(targ > 0){
            	targ=-WindowWidth*3+targ;
            	index=3;
            }else if(targ < -WindowWidth*3){
            	index=0;
				targ=targ+WindowWidth*3;
            }
            oWrapper.style.left=targ+'px';

            return false;
		}
		//touchend事件的处理函数
		function touchEndHandle(e){
			e.preventDefault && e.preventDefault(); 
			var absDel=Math.abs(deltaX);
			//当手指滑动距离小于屏幕1/3
			if(absDel*3 < WindowWidth){
				utils.returnTo();
				return;
			}
			
            if(deltaX > 0) {
            	//right
            	utils.turnRight();
            }else{
            	//left
            	utils.turnLeft();
            	
            }
            autoMove && autoMove();

            return false;
		}
		//resize事件的处理函数
		function resizeHandle(){
			//===========网上找的兼容写法======================
			if (window.innerWidth)
			WindowWidth = window.innerWidth;
			else if ((document.body) && (document.body.clientWidth))
			WindowWidth = document.body.clientWidth;
			//===================================================
			//WindowWidth= document.body.clientwidth ||window.screen.width;
			utils.returnTo();
			return false;
		}
	}
	//将复制的代码段放入html
	function putHTML(){
		oWrapper.innerHTML+=utils.CopyHTML(aMove[0]);
	}
	//里面放各种杂函数
	var utils={
		//复制传入节点的代码
		CopyHTML:function(obj){
			var oDiv = document.createElement('div');
			oDiv.appendChild(obj.cloneNode(true));
			return oDiv.innerHTML;
		},
		//将复制的代码段放入wrapper节点中
		putHTML:function(){
			oWrapper.innerHTML+=utils.CopyHTML(aMove[0]);
		},
		//右移页码变化
		turnRight:function(){
			--index;
			index=index<0?3:index;
			if(index == 3){
				oWrapper.style.left=-3*WindowWidth+'px';
				utils.turnRight();
			}else{
				utils.moveTo(oWrapper,'left',-index*WindowWidth);	
			}
			utils.setActive();	
		},
		//左移页码变化
		turnLeft:function(){
			++index;
			index%=4;
			utils.moveTo(oWrapper,'left',-index*WindowWidth);

			utils.setActive();	
		},
		//获得样式
		getStyle:function (obj,attr)
		{
			if(obj.currentStyle)
			{
				return obj.currentStyle[attr];
			}
			else
			{
				return getComputedStyle(obj,false)[attr];
			}
		},
		//动画
		moveTo:function(obj,attr,iTarget){
			clearInterval(obj.timer);
			obj.timer=setInterval(function(){
				
				var iVal=utils.getStyle(obj,attr);

				iVal=parseInt(iVal);
								
				if(iVal == iTarget)
				{
					clearInterval(obj.timer);
					return;
				}
				
				var speed=(iTarget-iVal)/8;
				
				speed=speed>0?Math.ceil(speed):Math.floor(speed);
				iVal+=speed;

				obj.style[attr]=(iVal)+'px';
				
			},30);
		},
		//阻止动画
		stopMove:function(obj){
			clearInterval(obj.timer);
		},
		//返回到上一个页码位置
		returnTo:function(){
			utils.moveTo(oWrapper,'left',-index*WindowWidth);
		},
		//自动轮播
		autoMoveCreator:function(option){	
			return function(){
				clearInterval(autoTimer);
				autoTimer=setInterval(utils.turnRight,option.interval);
			}	
		},
		//设置active样式
		setActive:function () {
			var qiuckIndex=index%3;
			for(var i=0;i<oli.length;++i){
				oli[i].className='inactive';
			}
			oli[qiuckIndex].className='active';
		}		
	}

	return init;
}