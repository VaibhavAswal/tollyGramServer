const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Register
const register = async (req, res) => {
	try {
		const { username, password, email } = req.body;
		const firstname =
			req.body.firstname.charAt(0).toUpperCase() +
			req.body.firstname.slice(1).toLowerCase();
		const lastname =
			req.body.lastname.charAt(0).toUpperCase() +
			req.body.lastname.slice(1).toLowerCase();
		//generate password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		//create new user
		const newUser = await new User({
			username: username.toLowerCase(),
			email: email.toLowerCase(),
			firstname,
			lastname,
			password: hashedPassword,
		});
		try {
			const oldUser = await User.findOne({ username });
			if (oldUser) return res.status(400).json("username already taken");
			const user = await newUser.save();
			res.status(200).json({
				accessToken: jwt.sign(
					user._id.toString(),
					process.env.ACCESS_TOKEN_SECRET
				),
				user,
			});
		} catch (error) {
			res.status(500).json("error");
		}

		//save user to database and return response
	} catch (error) {
		console.log(error);
		res.status(500).json("error");
	}
};

//login
const login = async (req, res) => {
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
						user,
				  });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json("error");
	}
};


const resetPassword = async (req,res) => {
	try {
		const { email, password, newpassword } = req.body;
		const user = await User.findOne({email:email.toLowerCase()});
		const verified = await bcrypt.compare(password,user.password);
		console.log(verified);
		/*if(verified){
			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(newpassword, salt);
			const newPassword = await User.findByIdAndUpdate(user._id,{password:hashed,},{new:true,},);
			res.json(newPassword);
		}else{
			throw new Error("Wrong Password");
		}*/
	} catch (error) {
		console.log(error);
		res.status(500).json("error");
	}

}

module.exports = {
	register,
	login,
	resetPassword
};
