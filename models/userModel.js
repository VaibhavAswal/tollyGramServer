const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			require: true,
			min: 3,
			max: 20,
			unique: true,
		},
		password: {
			type: String,
			require: true,
			min: 6,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		profilePicture: {
			type: String,
			default: "",
		},
		coverPicture: {
			type: String,
			default: "",
		},
		followers: {
			type: Array,
			default: [],
		},
		following: {
			type: Array,
			default: [],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		desc: {
			type: String,
			max: 50,
		},
		city: {
			type: String,
			max: 50,
		},
		country: {
			type: String,
			max: 50,
		},
		relationship: {
			type: String,
			max: 50,
		},
		work: {
			type: String,
			max: 50,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
