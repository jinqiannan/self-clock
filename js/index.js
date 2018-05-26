/**
 * 
 * @authors ${瑾谦}
 * @date    2018-03-30 08:42:58
 * @version $Id$
 */

/*
*
*
*PS : 并非独立完成
*
*
*/


(function(){

	//获取标签节点
	var wrap = document.getElementById('wrap'),
		time = document.getElementById('time'),
		oLi = time.getElementsByTagName('li'),
		arr = ['img/0.png','img/1.png','img/2.png','img/3.png','img/4.png','img/5.png','img/6.png','img/7.png','img/8.png','img/9.png'],
		len = oLi.length,
		oldTime = '',
		nowTime = '';

	//alert(1)

	getTime() // 执行一次函数 避免第一次进入时有时间间隔 以及避免oldTime(上一秒钟不能取到值)
	//console.log(oldTime)

	//设置定时器,设置每秒执行一次
	setInterval(function(){
		getTime(); // 通过getTime来记录当前的时间和上一秒钟的时间
		last(); // 通过last来取出上一秒钟对应的img
		for(var i=0;i<nowTime.length;i++){
			if(nowTime[i] !== oldTime[i]){
				frush(i,oLi[i].getElementsByTagName('img'));
			}
		}
	},1000)

	// 改变图片定位，动画执行
	function frush (n,m){
		var num = nowTime[n] // n是形参接受的是nowtime的下标 m接受的是对应li里的img标签
		tMove(m[0],{top:'-61px'},500,function(){ // 更改img的定位
			m[0].src = arr[num % 10]; // 通过num / 10 的余数来获取arr数组中的路径
			m[0].style.top = '0';
			})
		tMove(m[1],{top:'-61px'},500,function () {
			m[1].src = arr[num % 10];
			m[1].style.top = '0';
		})
	}
	//将上一秒的数字存入
	function last(){
		for(var i=0; i < len; i++) {
			var liImg = oLi[i].getElementsByTagName('img');
			var num = Number(oldTime[i]);
			liImg[0].src = arr[num];
			liImg[1].src = arr[(num+1) % 10];
		}
	}
	//console.log(len)

	//获取当前的时间 将其保存为一个字符串
	function getTime (){
		var nowDate = new Date(),
			nowHour = nowDate.getHours(),
			nowMinute = nowDate.getMinutes(),
			nowSecond = nowDate.getSeconds();
		//var nowTime = nowHour + nowMinute + nowSecond + '';
		
		//将上一秒的时间存起来
		oldTime = nowTime;

		nowTime = zeroFill(nowHour) + zeroFill(nowMinute) + zeroFill(nowSecond); // 定义变量用于存储时分秒
		//console.log(nowTime)
		// for(var i = 0; i < len; i++){
		// 	Img[i].src = 'img/'+nowTime[i]+'.png' //通过下标返回当前nowTime中的数值，
		// }
	}
	//补零
	function zeroFill (n) {
		return n < 10 ? '0' + n : n + '';
	}

	//运动框架
	window.requestAnimationFrame = window.requestAnimationFrame || function(fn){
		return setTimeout(fn,1000/60)
	};
	window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

	function getStyle(ele){
		return ele.currentStyle || getComputedStyle(ele);
	}

	/*
		t : 当前时间 === 1000
		d ：持续时间
		b : 起始位置
		c ：变化量  target - start
	*/
	// tMove(box,{
	// 	width : '500px',
	// 	height : 300
	// },2000,function(){
	// 	this.style.background = '#f60'
	// })

	function tMove(ele,json,time,callback){
		var startValue = {}, // 存放需要改变的值的属性
			changeValue = {}, // 存放需要运动的总路程
			startTime; // 起始时间 
		for (var key in json) {
			startValue[key] = parseFloat(getStyle(ele)[key])
			changeValue[key] = parseFloat(json[key]) - startValue[key];
			if (!changeValue[key]) { // 值为0
				delete startValue[key]
				delete changeValue[key]
			}
		}
		startTime = new Date();
		fn();
		function fn(){
			var nowTime = new Date() - startTime, // 当前时间
				num = nowTime / time; // 已用时间跟总时间的比例值
			if (num >= 1) { // 	100 + 900*1 = 1000
				//当前时间大于等于总时间则应该到终点了
				num = 1;

			}else{//0.6 100 + 900*0.6
				requestAnimationFrame(fn)
			}
			for (var key in changeValue) {
				var val = num * changeValue[key] + startValue[key];
				if (key.toLowerCase() === "opacity") { 
					// 是来控制透明度
					ele.style[key] = val;
					ele.style.filter = "alpha(opacity="+ val*100 +")"
				}else {
					ele.style[key] = val + "px";
				}
			}
			if(num === 1){callback && callback.call(ele)}
		}
		
	}
})()