
var Upload = function(router, model) {
	var path = require('path');
	var fs = require('fs');
	var multer = require('multer');

	var database = require('../model/model');
	var dirPath = require('../path');

	var Pictures = database.pictures;
	var Project = database.project;

	var success;

	var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	  	//设置的文件夹不存在时，会自动创建
	    cb(null, dirPath + '/public/image')
	  },
	  filename: function (req, file, cb) {
	  	//获取文件后缀名
	  	var fileFormat = (file.originalname).split(".");
	    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
	  }
	});
	var upload = multer({ storage: storage });


	router.route('/upload') 
		.get(function(req, res) {
			if (!req.session.user) {
                req.session.error = "请先登录";
                res.redirect('/login');
            }
			res.render('upload', {
				title: '创建任务'
			});
		})
		.post(upload.fields(
			[{ name: 'NonShowedPhoto'},
			{ name: 'ShowedPhoto'}]), function(req, res) {
				console.log(req.files);
				console.log(req.body);

				var NonShowedPhoto = req.files.NonShowedPhoto;
				var ShowedPhoto = req.files.ShowedPhoto;
				var name = req.body.name;


				//重命名失败，为什么？
				// fs.rename(img.path, path, function(err) {
				// 	if(err)
				// 		console.log(err);
				// 	else{
				// 		Photo.create({name: name, path :img.name, PID: null})
				// 		.then(data=>{
				// 			res.redirect('/');
				// 		});
				// 	} 
				// });

				if(NonShowedPhoto || ShowedPhoto) {
					Project.create({pro_id: null, pro_name: name, pro_status:'undo'})
						.then(data=>{
							if(NonShowedPhoto){
								NonShowedPhoto.forEach(function(item) {
									Pictures.create({
										pic_id: null, 
										pic_path: item.filename, 
										pic_status: 'done', 
										pro_id: data.pro_id})
										.then(data=>{
											console.log('success');
											success = true;
										})
										//创建失败
										.catch(err=>{
											console.log(err);
											
										});
								});
							}
							if(ShowedPhoto) {
								ShowedPhoto.forEach(function(item) {
									Pictures.create({
										pic_id: null, 
										pic_path: item.filename, 
										pic_status: 'undo', 
										pro_id: data.pro_id})
										.then(data=>{
											console.log('success');
											success = true;
										})
										//创建失败
										.catch(err=>{
											console.log(err);
										});
								});
							}
						})
						.catch(err=>{
							console.log(err);
						});
					if(success)
						res.redirect('/home');
				}
				else{
					req.session.error = "请选择图片";
					res.redirect('/upload');
				}

		});
};


module.exports = Upload;

