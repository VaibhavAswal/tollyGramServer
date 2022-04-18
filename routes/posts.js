const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const authenticateToken = require("../middleware/authenticateToken");
const { request } = require("express");

//create a post
router.post("/", authenticateToken, async (req, res) => {
	const newPost = new Post({
		userId: req.userId,
		desc: req.body.desc,
		img: req.body.img,
	});
	try {
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (error) {
		res.status(500).json(error);
	}
});

//update a post
router.put("/:id", authenticateToken, async (req, res) => {
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
});

//delete a post
router.delete("/:id", authenticateToken, async (req, res) => {
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
});

//like/unlke a post
router.put("/:id/like", authenticateToken, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.userId)) {
			await post.updateOne({ $push: { likes: req.userId } });
			res.status(200).json("Post has been liked");
		} else {
			await post.updateOne({ $pull: { likes: req.userId } });
			res.status(200).json("The post has been disliked");
		}
	} catch (error) {
		res.status(500).json(error);
	}
});
//get a post
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json(error);
	}
});

//get timeline posts
router.get("/timeline/all", authenticateToken, async (req, res) => {
	try {
		const currentUser = await User.findById(req.userId);
		console.log(req.userId);
		console.log(currentUser);
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
});

module.exports = router;
