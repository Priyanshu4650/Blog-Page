const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/Blog");

// Creating an app
const app = express();

// Register view engine
app.set("view engine", "ejs");
app.set("views", "myViews");

// Middleware $ static files
app.use(express.static("publicfiles"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Connecting database
const dbURI =
	"mongodb+srv://bloguser:test1234@nodelearning.lvzfb5p.mongodb.net/?retryWrites=true&w=majority";
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log("Error connecting to MongoDB:", err);
	});

// Routing and HTML
app.get("/", (req, res) => {
	res.redirect("/blog");
});

app.get("/blog", (req, res) => {
	Blog.find()
		.sort({ createdAt: -1 })
		.then((result) => {
			res.render("index", { blogs: result, title: "Blogs" });
		})
		.catch((err) => {
			console.log(err);
		});
});

app.post("/blog", (req, res) => {
	// const body = req.body;
	const blog = new Blog(req.body);

	blog.save()
		.then((result) => {
			res.redirect("/blog");
		})
		.catch((err) => console.log(err));
});

app.get("/blog:id", (req, res) => {
	const id = req.params.id;
	console.log(id);
	Blog.findById(id)
		.then((result) =>
			res.render("details", { title: `${result.title}` , blogs: result})
		)
		.catch((err) => console.log(err));
});

app.get("/about", (req, res) => {
	res.render("about", { title: "About" });
});

app.get("/blogs/create", (req, res) => {
	res.render("create", { title: "Create" });
});

// 404 Pagecle
app.use((req, res) => {
	res.status(404).render("404", { title: "Not Found" });
});
