//第一行的内容我们不需要做改变，只需要从第二行开始改变。
//而我们第二行的第一张图片要放在第一行图片高度最小的图片的下面

window.onload  = function() {

	waterfall('main','box');

	//模拟后台传递过来的数据
	var dataInt = {"data" : [{"src" : "0.jpg"},{"src" : "1.jpg"},{"src" : "2.jpg"}]};

	window.onscroll= function() {

		var oParent = document.getElementById("main");
			if(checkScrollSlide()) {
				//具备加载条件，这样我们准备加载数据块，也就是从后台传过来的数据

				//将数据块渲染到我们的数据底部
				for(var i = 0 ; i < dataInt.data.length ; i++){

					var  oBox = document.createElement('div');
					oBox.className = 'box';
					oParent.appendChild(oBox);  //讲一个元素添加到oParent的最底部

					var oPic = document.createElement('div');
					oPic.className = 'pic';
					oBox.appendChild(oPic);

					var oImg = document.createElement('img');
					oImg.src = 'images/'+dataInt.data[i].src;
					oPic.appendChild(oImg);
				}

			}
			waterfall('main','box');

	}

}
function waterfall(parent,box) {

	//将main下面所有class为box的元素取出来
	var oParent = document.getElementById(parent);

	var oBoxs = getByClass(oParent,box);

	// console.log(oBoxs.length);
	//计算整个页面显示的列数（页面宽度/box的宽度）
	var oBoxW = oBoxs[0].offsetWidth;

	// console.log(oBoxW)  237  一个盒子的宽
	var cols = Math.floor(document.documentElement.clientWidth / oBoxW);

	//设置容器的宽度

	oParent.style.cssText = 'width:'+ oBoxW * cols  + 'px ; margin: 0 auto;' ;

	var hArr = [];  //第一行所有图片的高

	for(var i =0 ;i<oBoxs.length ; i++) {

		if(i < cols) {
			hArr.push(oBoxs[i].offsetHeight);  //第一行所有盒子的高度放在数组中
		}else{  //这个时候图片放置已经到了第二行

			//Math.min不能对数组求最小值， 通过apply改变this指向
			var minH = Math.min.apply(null,hArr);

			//最小值我们已经知道了但是最小值在数组中的索引我们要知道
			//获取最小值高度对应的数组索引值
			var index = getMinhIndex( hArr , minH );

			oBoxs[i].style.position = 'absolute' ;
			oBoxs[i].style.top = minH + 'px' ;
			// oBoxs[i].style.left = index  * oBoxW + 'px'; 一种做法
			oBoxs[i].style.left = oBoxs[index].offsetLeft + 'px';

			//在这里改变数组,修改最矮的那一列对应的值。
			//已经有第二行了所以要重新计算数组的高度
			hArr[index] += oBoxs[i].offsetHeight;


		}

 		console.log(hArr);
	}

}


//根据class获取元素
function getByClass(parent,clsName) {

	var boxArr = []; //用来存储获取到所有class为box的元素

	var oElements = parent.getElementsByTagName('*');

	for(var i =0; i<oElements.length;i++) {

		if(oElements[i].className == clsName) {

			boxArr.push(oElements[i]);

		}
	}

	return boxArr;

}


function getMinhIndex(arr,val) {
	for( var i  in arr ){
		if(arr[i] == val) {
			return i ;
		}
	}
}


//监测是否具备了滚动条加载数据的条件
function checkScrollSlide() {
	var oParent = document.getElementById('main');
	var oBoxs = getByClass(oParent,'box');   //所有小盒子
	var lastBoxH = oBoxs[oBoxs.length -1 ].offsetTop + Math.floor(oBoxs[oBoxs.length - 1 ].offsetHeight) / 2;
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	var height = document.body.clientHeight || document.documentElement.clientHeight;

	// console.log(scrollTop + height); 这个值是一直在发生变化的。
	return lastBoxH <= (scrollTop + height) ? true : false;

}
