const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/", (req, res) => {
	res.send("user is a bhoot");
});

//update user
router.put("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				const salt = await bcrpyt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (error) {
				return res.status(500).json(error);
			}
		}
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			res.status(200).json("Account has been update");
		} catch (error) {
			return res.status(500).json(error);
		}
	} else {
		return res.status(403).json("row row your boat fuck away from me.");
	}
});
//delete user
router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			const user = await User.findByIdAndDelete(req.params.id);
			res.status(200).json("Account has been deleted");
		} catch (error) {
			return res.status(500).json(error);
		}
	} else {
		return res.status(403).json("row row your boat fuck away from me.");
	}
});
//get a user
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, updatedAt, ...other } = user._doc;
		res.status(200).json(other);
	} catch (error) {
		res.status(500).json(error);
	}
});
//follow a user
router.put("/:id/follow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({ $push: { following: req.body.userId } });
				res.status(200).json("User has been followed");
			} else {
				res.status(403).json("Already following user");
			}
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("Following self");
	}
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.body.userId } });
				await currentUser.updateOne({ $pull: { following: req.body.userId } });
				res.status(200).json("User has been unfollowed");
			} else {
				res.status(403).json("Dont follow user");
			}
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("Unfollowing self");
	}
});

module.exports = router;
