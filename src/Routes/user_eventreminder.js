import user_eventreminder from '../Controllers/user_eventreminder_controller';
exports.getRouter = (app) => {

	app.route("/user_eventreminder/addReminder").post(user_eventreminder.addReminder);
	return app;
}