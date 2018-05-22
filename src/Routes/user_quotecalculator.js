import user_quotecalculator from '../Controllers/user_quotecalculator_controller';
import auth from '../modules/auth';
import md5 from 'md5';
import express from 'express'
import path from 'path';
exports.getRouter = (app) => {
	app.route("/user_quotecalculator/addQuoteCalculator").post(user_quotecalculator.addQuoteCalculator);
	app.route("/user_quotecalculator/editQuoteCalculator").post(auth.requiresLogin,user_quotecalculator.editQuoteCalculator);
	app.route("/user_quotecalculator/deleteQuoteCalculator").delete(user_quotecalculator.deleteQuoteCalculator);
	app.route("/user_quotecalculator/getQuoteCalculator").get(user_quotecalculator.getQuoteCalculator);
	return app;
}