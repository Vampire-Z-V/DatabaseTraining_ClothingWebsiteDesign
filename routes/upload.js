
var Upload = function (router, model) {
	var path = require('path');
	var fs = require('fs');
	var multer = require('multer');

	var database = require('../model/model');
	var dirPath = require('../path');

	var Pictures = database.pictures;
	var Project = database.project;

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
		.get(function (req, res) {
			if (!req.session.user) {
				res.status(401).render('ejs/messege.ejs', { msg: "Please login first.", status: 401 }, function (error, string) {
					req.session.msg = string;
					res.redirect('/index');
				});
			}
			res.render('upload', {
				title: '创建任务'
			});
		})
		.post(upload.fields(
			[{ name: 'NonShowedPhoto' },
			{ name: 'ShowedPhoto' }]), function (req, res) {
				console.log(req.files);
				console.log(req.body);

				var NonShowedPhoto = req.files.NonShowedPhoto;
				var ShowedPhoto = req.files.ShowedPhoto;
				// var NonShowedPhoto = req.body.NonShowedPhoto;
				// console.log(typeof NonShowedPhoto);
				// console.log(NonShowedPhoto);
				// var ShowedPhoto = req.body.ShowedPhoto;
				// console.log(typeof ShowedPhoto);
				// console.log(ShowedPhoto);
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

				// if(NonShowedPhoto || ShowedPhoto) {
				// 	Project.create({pro_id: null, pro_name: name, pro_status:'undo'})
				// 		.then(data=>{
				// 			if(NonShowedPhoto){
				// 				NonShowedPhoto.forEach(function(item) {
				// 					Pictures.create({
				// 						pic_id: null, 
				// 						pic_path: item.filename, 
				// 						pic_status: 'done', 
				// 						pro_id: data.pro_id})
				// 						.then(data=>{
				// 							// success = true;
				// 							console.log('1');
				// 							console.log(success);
				// 						})
				// 						//创建失败
				// 						.catch(err=>{
				// 							console.log(err);

				// 						});
				// 				});
				// 			}
				// 			if(ShowedPhoto) {
				// 				ShowedPhoto.forEach(function(item) {
				// 					Pictures.create({
				// 						pic_id: null, 
				// 						pic_path: item.filename, 
				// 						pic_status: 'undo', 
				// 						pro_id: data.pro_id})
				// 						.then(data=>{
				// 							// success = true;
				// 							console.log('2');
				// 							console.log(success);
				// 						})
				// 						//创建失败
				// 						.catch(err=>{
				// 							console.log(err);
				// 						});
				// 				});
				// 			}
				// 			//不会被执行,因为上面的代码是异步回调
				// 			// if(success)
				// 			// {
				// 			// 	console.log('upload');
				// 			// 	res.redirect('/home');
				// 			// }
				// 		})
				// 		//因为使用了promise，所以这里也要用promise来调用
				// 		.then(data=>{
				// 			// if(success)
				// 			// {
				// 			// 	console.log('upload');
				// 			// 	res.redirect('/home');
				// 			// }
				// 			res.redirect('/home');
				// 		})
				// 		.catch(err=>{
				// 			console.log(err);
				// 		});					
				// }
				// else{
				// 	res.redirect('/upload');
				// 	req.session.error = "请选择图片";

				// }

				//必须上传走秀和非走秀图片
				Project.create({ pro_id: null, pro_name: name, pro_status: 'undo' })
					.then(data => {

						NonShowedPhoto.forEach(function (item) {
							Pictures.create({
								pic_id: null,
								pic_path: item.filename,
								pic_status: 'useless',
								pro_id: data.pro_id
							})
								.then(data => {
									// success = true;
									console.log('1');
									console.log(success);
								})
								//创建失败
								.catch(err => {
									console.log(err);

								});
						});

						ShowedPhoto.forEach(function (item) {
							Pictures.create({
								pic_id: null,
								pic_path: item.filename,
								pic_status: 'undo',
								pro_id: data.pro_id
							})
								.then(data => {
									// success = true;
									console.log('2');
									console.log(success);
								})
								//创建失败
								.catch(err => {
									console.log(err);
								});
						});

						//不会被执行,因为上面的代码是异步回调
						// if(success)
						// {
						// 	console.log('upload');
						// 	res.redirect('/home');
						// }
					})
					//因为使用了promise，所以这里也要用promise来调用
					.then(data => {
						// if(success)
						// {
						// 	console.log('upload');
						// 	res.redirect('/home');
						// }
						res.redirect('/home');
					})
					.catch(err => {
						console.log(err);
					});

			});
};


module.exports = Upload;

