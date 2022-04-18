const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Register
router.post("/register", async (req, res) => {
	try {
		//generate password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		//create new user
		const newuser = await new User({
			username: req.body.username.toLowerCase(),
			email: req.body.email.toLowerCase(),
			password: hashedPassword,
		});

		//save user to database and return response
		await newuser.save();
		res.status(200).json("success");
	} catch (error) {
		console.log(error);
		res.status(500).json("error");
	}
});

//login
router.post("/login", async (req, res) => {
	try {
		const user = req.body.email
			? await User.findOne({ email: req.body.email.toLowerCase() })
			: await User.findOne({ username: req.body.username.toLowerCase() });
		if (!user) {
			!user && res.status(404).json("user not found");
		} else {
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);
			!validPassword
				? res.status(400).json("wrong password")
				: res.status(200).json({
						accessToken: jwt.sign(
							user._id.toString(),
							process.env.ACCESS_TOKEN_SECRET
						),
				  });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json("error");
	}
});

module.exports = router;
