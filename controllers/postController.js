const Post = require("../models/postModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

//create new post
const newPost = async (req, res) => {
	const newPost = new Post({
		userId: req.body.userId,
		userName: req.body.userName,
		desc: req.body.desc,
		image: req.body.image,
		userProfile: req.body.userProfile,
		location: req.body.location,
		fullName: req.body.fullName,
	});
	try {
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (error) {
		res.status(500).json(error);
	}
};

//update a post
const updatePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.userId) {
			const newPost = {
				desc: req.body.desc,
				img: req.body.img,
			};
			await post.updateOne({ $set: newPost });
			res.status(200).json("the post has ben updated");
		} else {
			res.status(403).json("Row Row your boat fuck away from me");
		}
	} catch (error) {
		res.status(500).json(error);
	}
};

//delete a post
const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.userId) {
			await post.deleteOne();
			res.status(200).json("the post has been deleted");
		} else {
			res.status(403).json("Row Row your boat fuck away from me");
		}
	} catch (error) {
		res.status(500).json(error);
	}
};

//like or unlike a post
const likePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json("Post has been liked");
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json("The post has been disliked");
		}
	} catch (error) {
		res.status(500).json(error);
	}
};

//get post
const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json(error);
	}
};

//get all timeline posts
const getTimelinePosts = async (req, res) => {
	const userId = req.params.id;
	try {
		const currentUserPosts = await Post.find({ userId: userId });

		const followingPosts = await User.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(userId),
				},
			},
			{
				$lookup: {
					from: "posts",
					localField: "following",
					foreignField: "userId",
					as: "followingPosts",
				},
			},
			{
				$project: {
					followingPosts: 1,
					_id: 0,
				},
			},
		]);

		res.status(200).json(
			currentUserPosts
				.concat(...followingPosts[0].followingPosts)
				.sort((a, b) => {
					return new Date(b.createdAt) - new Date(a.createdAt);
				})
		);
	} catch (error) {
		res.status(500).json(error);
	}
};

//add comment
const addComment = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		await post.updateOne({ $push: { comments: req.body.comment } });
		res.status(200).json("sucess");
	} catch (error) {
		res.status(500).json(error);
	}
};

module.exports = {
	newPost,
	updatePost,
	deletePost,
	likePost,
	getPost,
	addComment,
	getTimelinePosts,
};
