import admin from '../Controllers/admin_controller';
import auth from '../modules/auth';
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
	app.route("/admin/login").post(admin.login);
	app.route("/admin/forgotPassword").post(admin.forgotPassword);
	app.route("/admin/verifyOtp").post(auth.requiresLoginAdmin, admin.verifyOtp);
	app.route("/admin/resetPassword").post(auth.requiresLoginAdmin, admin.resetPassword);
	app.route("/admin/logOut").post(auth.requiresLoginAdmin, admin.logOut);
;
	return app;
}