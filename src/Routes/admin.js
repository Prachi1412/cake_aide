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
        callback(null,'./src/uploads/admin');
	},
	filename : function(req,file,callback){
		let fileUniqueName = md5(Date.now());
        callback(null,fileUniqueName+ path.extname(file.originalname));
    }
});
	let upload = multer({storage:storage});
	app.route("/admin/login").post(admin.login);
	app.route("/admin/forgotPassword").post(admin.forgotPassword);
	app.route("/admin/editProfile").post(upload.any(),auth.requiresLoginAdmin, admin.editProfile);
	app.route("/admin/verifyOtp").post(auth.requiresLoginAdmin, admin.verifyOtp);
	app.route("/admin/resetPassword").post(auth.requiresLoginAdmin, admin.resetPassword);
	app.route("/admin/logOut").post(auth.requiresLoginAdmin, admin.logOut);
	app.route("/admin/block_user").put(admin.block_user);
	app.route("/admin/addAdminIngredient").post(admin.addAdminIngredient);
	app.route("/admin/showIngredientName").get(admin.showIngredientName);
	app.route("/admin/adminDeleteIngredient").post(admin.adminDeleteIngredient);
;
	return app;
}