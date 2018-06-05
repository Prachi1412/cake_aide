import user_equipment from '../Controllers/user_equipment_controller';
import auth from '../modules/auth';

exports.getRouter = (app) => {

	app.route("/user_equipment/addEquipment").post(user_equipment.addEquipment);
	app.route("/user_equipment/editEquipment").post(user_equipment.editEquipment);
	app.route("/user_equipment/deleteEquipment").delete(user_equipment.deleteEquipment);
	app.route("/user_equipment/getEquipment").get(user_equipment.getEquipment);
	return app;
}