const router = require("express").Router();
const authenticateToken = require("../middleware/authenticateToken");
const {
	newPost,
	updatePost,
	deletePost,
	likePost,
	getPost,
	getTimelinePosts,
	addComment,
} = require("../controllers/postController");

router.post("/", newPost);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);
router.put("/:id/like", likePost);
router.get("/:id", getPost);
router.get("/:id/timeline", getTimelinePosts);
router.post("/:id/comment", addComment);

module.exports = router;
