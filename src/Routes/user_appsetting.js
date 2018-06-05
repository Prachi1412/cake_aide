import user_appsetting from '../Controllers/user_appsetting_controller';
import auth from '../modules/auth';
import multer from 'multer';
import md5 from 'md5';
import express from 'express'
import path from 'path';

exports.getRouter = (app) => {
	app.route("/user_appsetting/add_reminder").post(user_appsetting.add_reminder);
	app.route("/user_appsetting/edit_reminder").post(user_appsetting.edit_reminder);
	app.route("/user_appsetting/delete_reminder").delete(user_appsetting.delete_reminder);
	app.route("/user_appsetting/get_reminder").get(user_appsetting.get_reminder);
}

