const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		userProfile: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			max: 400,
		},
		image: {
			type: String,
		},
		location: {
			type: String,
		},
		likes: {
			type: Array,
			default: [],
		},
		comments: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
