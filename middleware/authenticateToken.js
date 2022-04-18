const jwt = require("jsonwebtoken");

module.exports = function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null)
		return res.sendStatus(401).json("Row Row your boat fuck away from me");

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err)
			return res.sendStatus(403).json("Row Row your boat fuck away from me");
		req.userId = user;
		next();
	});
};
