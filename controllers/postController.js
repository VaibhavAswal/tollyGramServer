const Post = require("../models/postModel");
const User = require("../models/userModel");

//create new post
const newPost = async (req, res) => {
	const newPost = new Post({
		userId: req.body.userId,
		userName: req.body.userName,
		desc: req.body.desc,
		image: req.body.image,
		userProfile: req.body.userProfile,
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
	try {
		const currentUser = await User.findById(req.params.id);
		// console.log(req.userId);
		// console.log(currentUser);
		const userPosts = await Post.find({ userId: currentUser._id });
		const friendPosts = await Promise.all(
			currentUser.following.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		res.json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	newPost,
	updatePost,
	deletePost,
	likePost,
	getPost,
	getTimelinePosts,
};
