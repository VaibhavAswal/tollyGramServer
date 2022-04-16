const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

const app = express();

const PORT = process.env.PORT || 5000;

//mongoose mongoDb connection
const connectDb = function () {
	return mongoose.connect(
		"mongodb+srv://vaibhav:9456114101v@gangland.koahg.mongodb.net/test?retryWrites=true&w=majority",
		(error) => {
			if (error) {
				console.error(
					`Failed to connect to mongo on startup - retrying in 5 sec\n${error}`
				);
				setTimeout(connectDb, 5000);
			}
		}
	);
};

mongoose.connection.on("connected", () => {
	console.log("Connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
	console.log("Lost MongoDB connection Retrying...");
});

connectDb();

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(PORT, () => {
	console.log(`server listening on ${PORT}`);
});
