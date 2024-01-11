const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('dataUser.json');
const db = lowdb(adapter);

const TABLENAME = 'users';

exports.getUser = async username => {
	try {
		const data = await db.get(TABLENAME).find({username: username}).value();
		return data;
	} catch {
		return null;
	}
};

exports.createUser = async user => {
	try {
		await db.get(TABLENAME).push(user).write();
		return true;
	} catch {
		return false;
	}
};

exports.updateRefreshToken = async (username, refreshToken) => {
	try {
		await db
			.get(TABLENAME)
			.find({username: username})
			.assign({refreshToken: refreshToken})
			.write();
		return true;
	} catch {
		return false;
	}
};
exports.updateAuthorization = async (username, authorization) => {
	try {
		await db
			.get(TABLENAME)
			.find({username: username})
			.assign({authorization: authorization})
			.write();
		return true;
	} catch {
		return false;
	}
};
exports.changePassword = async (username, password) => {
	try {
		await db
			.get(TABLENAME)
			.find({username: username})
			.assign({password: password})
			.write();
		return true;
	} catch {
		return false;
	}
};




// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const accountSchema = new Schema({
//     id:       String,
//     name:     String,
// 	email:    String,
// 	password: String,
// //	avatar: {type: String, default:'/images/user.jpg'},
// 	bio: String,
// 	time_join: String
// },{
//     collection: 'accountModel'
// });
// const accountModel = mongoose.model('accountModel', accountSchema);

// module.exports = accountModel;