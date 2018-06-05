import user_setting from '../Controllers/user_setting_controller';
import auth from '../modules/auth';
import multer from 'multer';
import md5 from 'md5';
import express from 'express'
import path from 'path';
exports.getRouter = (app) => {
	let storage = multer.diskStorage({
	destination : function(req,file,callback){
        callback(null,'./src/uploads/images');
	},
	filename : function(req,file,callback){
		let fileUniqueName = md5(Date.now());
        callback(null,fileUniqueName+ path.extname(file.originalname));
    }
});
	let upload = multer({storage:storage});
	app.route("/user_setting/addthemes").post(upload.any(),user_setting.addthemes);
	app.route("/user_setting/getthemes").get(user_setting.getthemes);
	app.route("/user_setting/addwallpaper").post(upload.any(),user_setting.addwallpaper);
	app.route("/user_setting/getwallpaper").get(user_setting.getwallpaper);
	return app;
}