const User = require("../models/userModel");

//update a user
const updateUser = async (req, res) => {
	// if (req.userId === req.params.id) {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, {
			$set: req.body,
		});
		res.status(200).json(user);
	} catch (error) {
		return res.status(500).json(error);
	}
};
//  else {
// return res.status(403).json("row row your boat fuck away from me.");
// }
// };

//delete a user
const deleteUser = async (req, res) => {
	if (req.userId === req.params.id) {
		try {
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json("Account has been deleted");
		} catch (error) {
			return res.status(500).json(error);
		}
	} else {
		return res.status(403).json("row row your boat fuck away from me.");
	}
};

//get a user
const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, updatedAt, ...other } = user._doc;
		res.status(200).json(other);
	} catch (error) {
		res.status(500).json(error);
	}
};

//follow a user
const followUser = async (req, res) => {
	if (req.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.userId);
			if (!user.followers.includes(req.userId)) {
				await user.updateOne({ $push: { followers: req.userId } });
				await currentUser.updateOne({ $push: { following: req.userId } });
				res.status(200).json("User has been followed");
			} else {
				res.status(403).json("Already following user");
			}
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("Cannot follow self");
	}
};

//unfollow a user
const unfollowUser = async (req, res) => {
	if (req.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.userId);
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.userId } });
				await currentUser.updateOne({ $pull: { following: req.userId } });
				res.status(200).json("User has been unfollowed");
			} else {
				res.status(403).json("Dont follow user");
			}
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("cannot unfollow self");
	}
};

//get all users
const getAllUsers = async (req, res) => {
	try {
		let users = await User.find();
		users = users.map((user) => {
			const { password, ...otherDetails } = user._doc;
			return otherDetails;
		});
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json("error");
	}
};

module.exports = {
	updateUser,
	deleteUser,
	getUser,
	followUser,
	unfollowUser,
	getAllUsers,
};
