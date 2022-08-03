const router = require("express").Router();
const authenticateToken = require("../middleware/authenticateToken");
const {
	updateUser,
	deleteUser,
	getUser,
	followUser,
	unfollowUser,
	getAllUsers,
	getFollowing,
	getUserBasic,
} = require("../controllers/userController");

router.put("/:id", updateUser);
router.delete("/:id", authenticateToken, deleteUser);
router.get("/:id", getUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/:id/following", getFollowing);
router.get("/", getAllUsers);
router.get("/:id/getUserBasic", getUserBasic);

module.exports = router;
