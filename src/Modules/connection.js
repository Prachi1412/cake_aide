import mysql from 'mysql';
var db_config = {
	host: "localhost",
	user: "root",
	password: "",
	database: "db_cake",
	port : "3306"
};

const connection = mysql.createConnection(db_config);

// connection.connect( (err) => { 
// 	if( err ) {
// 		console.log('error when connecting to db:', err); 
// 	} else { 
// 		console.log("connection variable created "); 
// 	}
// });

module.exports = connection;