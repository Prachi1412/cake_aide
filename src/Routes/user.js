import user from '../Controllers/user_controller';
import auth from '../Modules/auth';
import multer from 'multer';
import md5 from 'md5';
import express from 'express'
import path from 'path';
exports.getRouter = (app) => {
	let storage = multer.diskStorage({
	destination : function(req,file,callback){
		console.log(file)
        callback(null,'./src/uploads/user');
	},
	filename : function(req,file,callback){
		let fileUniqueName = md5(Date.now());
        callback(null,fileUniqueName+ path.extname(file.originalname));
    }
});
	let upload = multer({storage:storage});
	app.route("/user/login").post(user.login);
	app.route("/user/signup").post(user.signup);
	app.route("/user/forgotPassword").post(user.forgotPassword);
	app.route("/user/resetPassword").post(auth.requiresLogin, user.resetPassword);
	app.route("/user/createProfile").post(auth.requiresLogin,upload.any(), user.createProfile);
	app.route("/user/updateProfile").post(auth.requiresLogin,upload.any(), user.updateProfile);
	app.route("/user/verifyOtp").post(auth.requiresLogin, user.verifyOtp);
	app.route("/user/logOut").post(auth.requiresLogin,user.logOut);
	app.route("/user/getUserDetails").get(user.getUserDetails);
	
	return app;
}