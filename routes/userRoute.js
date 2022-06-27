const router = require("express").Router();
const authenticateToken = require("../middleware/authenticateToken");
const {
	updateUser,
	deleteUser,
	getUser,
	followUser,
	unfollowUser,
	getAllUsers,
} = require("../controllers/userController");

router.put("/:id", updateUser);
router.delete("/:id", authenticateToken, deleteUser);
router.get("/:id", getUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow",unfollowUser);
router.get("/", getAllUsers);

module.exports = router;
