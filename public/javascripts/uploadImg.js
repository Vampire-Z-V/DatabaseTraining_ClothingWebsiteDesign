var NonShowedPhoto = [], ShowedPhoto = [];
var idFile;
$(function(){
	var delParent;
	var max = 5;
	var defaults = {
		fileType         : ["jpg","png","bmp","jpeg"],   // 上传文件的类型
		fileSize         : 1024 * 1024 * 10                  // 上传文件的大小 10M
	};
	/*点击图片的文本框*/
	$(".file").change(function(){
		//获取当前节点的id值，也就是file	 
		idFile = $(this).attr("id");
		console.log(idFile);
		var file = document.getElementById(idFile);
		//返回class为.z_photo的父类标签
		//存放图片的父亲元素
		var imgContainer = $(this).parents(".z_photo"); 
		//获取的图片文件
		//也就是每次点击上传文件文本框之后选择的图片
		//files对象是只读的
		var fileList = file.files;
		console.log(file.files);
		//每次更改添加图片
		if(idFile === 'NonShowedPhoto'){
			for(var i = 0;i<fileList.length;i++){
				NonShowedPhoto.unshift(fileList[i]);
			}
		}
		if(idFile === 'ShowedPhoto'){
			for(var i = 0;i<fileList.length;i++){
				ShowedPhoto.unshift(fileList[i]);
			}
		}
		//文本框的直接父亲元素
		var input = $(this).parent();

		var imgArr = [];
		//遍历得到的图片文件
		var numUp = imgContainer.find(".up-section").length;
		var totalNum = numUp + fileList.length;  //总的数量
		if(fileList.length > max || totalNum > max ){
			//一次选择上传超过max个 或者是已经上传和这次上传的到的总数也不可以超过max个
			alert(`上传图片数目不可以超过${max}个，请重新选择`);  
		}
		else if(numUp < max){
			//判断上传的文件是否符合要求
			fileList = validateUp(fileList);

			for(var i = 0;i<fileList.length;i++){
				//获取上传图片的url，实现预览
				//使用HTML5的File API,获取file在电脑上的url，实现预览
				var imgUrl;
				if (window.createObjectURL!=undefined) { // basic
			        imgUrl = window.createObjectURL(fileList[i]);
			    } else if (window.URL!=undefined) { // mozilla(firefox)
			        imgUrl = window.URL.createObjectURL(fileList[i]);
			    } else if (window.webkitURL!=undefined) { // webkit or chrome
			        imgUrl = window.webkitURL.createObjectURL(fileList[i]);
			    }
			    imgArr.push(imgUrl);

				//创建一个secton标签，并返回相应的Jquery对象
				var $section = $("<section class='up-section fl loading'>");
				 	//prepend是在被选元素的开头(里面)插入指定的内容
				    imgContainer.prepend($section);

				var $span = $("<span class='up-span'>");
					//在section后面(仍在内部)插入span
				    $span.appendTo($section);
				
			    var $img0 = $("<img class='close-upimg'>").on("click",function(event){
					    event.preventDefault();
						event.stopPropagation();
						$(".works-mask").show();
						delParent = $(this).parent();
					});   
					$img0.attr("src","/image/used/delete.png").appendTo($section);

			    var $img = $("<img class='up-img up-opcity'>");
			        $img.attr("src",imgArr[i]);
			        $img.appendTo($section);
			    

			    var $input = $("<input id='taglocation' name='taglocation' value='' type='hidden'>");
			        $input.appendTo($section);
			    var $input2 = $("<input id='tags' name='tags' value='' type='hidden'/>");
			        $input2.appendTo($section);
		   }
		}
		setTimeout(function(){
             $(".up-section").removeClass("loading");
		 	 $(".up-img").removeClass("up-opcity");
		 },450);
		 numUp = imgContainer.find(".up-section").length;
		if(numUp >= max){
			//隐藏显示图片的按钮
			$(this).parent().hide();
		}
	});
	
	
   
    $(".z_photo").delegate(".close-upimg","click",function(){
     	  $(".works-mask").show();
     	  delParent = $(this).parent();
	});
		
	$(".wsdel-ok").click(function(){
		$(".works-mask").hide();
		var numUp = delParent.siblings().length;
		if(numUp < 6){
			//显示添加图片的框
			delParent.parent().find(".z_file").show();
		}
		delParent.remove();
		//这里是删除的地方
		var prevNum = delParent.prevAll().length;
		if(idFile === 'NonShowedPhoto'){
			NonShowedPhoto.splice(prevNum, 1);
		}
		if(idFile === 'ShowedPhoto'){
				ShowedPhoto.splice(prevNum, 1);
		}
	});
	
	$(".wsdel-no").click(function(){
		$(".works-mask").hide();
	});
	
	$("#button").click(function(){
		
		var text = $('#name').val();
		var year=$("#year option:selected").val();
		var seasion=$("#seasion option:selected").val();
		NonShowedPhoto.forEach(function(elem){
			console.log(elem);
		});
		ShowedPhoto.forEach(function(elem){
			console.log(elem);
		});
		//只有同时选中NonShowedPhoto和ShowedPhoto，并且填写了任务名才能上传
		if(NonShowedPhoto.length !== 0 && ShowedPhoto.length !== 0 && text !== ''){
			var formData = new FormData();
			var name = year + ' ' + seasion + ' ' + text;
			formData.append('name', name);
			//每次append一个文件对象，模拟使用文件上传控件添加文件
			NonShowedPhoto.forEach(function(elem){
				formData.append('NonShowedPhoto', elem);
			});
			ShowedPhoto.forEach(function(elem){
				formData.append('ShowedPhoto', elem);
			});

			$.ajax({
		        url: "/upload",
		        type: "POST",
		        data: formData,
		        processData: false, 
		        contentType: false,
		        success: function(){
		        	location.href ='/home';
		        }
		    });
		}
		if(NonShowedPhoto.length === 0){
			alert('请选择非走秀图片')
		}
		if(ShowedPhoto.length === 0){
			alert('请选择走秀图片')
		}
	});

	function validateUp(files){
		var arrFiles = [];//替换的文件数组
		for(var i = 0, file; file = files[i]; i++){
			//获取文件上传的后缀名
			var newStr = file.name.split("").reverse().join("");
			if(newStr.split(".")[0] != null){
					var type = newStr.split(".")[0].split("").reverse().join("");
					console.log(type+"===type===");
					if(jQuery.inArray(type, defaults.fileType) > -1){
						// 类型符合，可以上传
						if (file.size >= defaults.fileSize) {
							alert(file.size);
							alert('您这个"'+ file.name +'"文件大小过大');	
						} else {
							// 在这里需要判断当前所有文件中
							arrFiles.push(file);	
						}
					}else{
						alert('您这个"'+ file.name +'"上传类型不符合');	
					}
				}else{
					alert('您这个"'+ file.name +'"没有类型, 无法识别');	
				}
		}
		return arrFiles;
	}
});