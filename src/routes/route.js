const express = require('express');
const router = express.Router();
const AuthorController= require("../controllers/authorController")
const BlogController= require("../controllers/blogController")
const Mw = require("../middleware/auth")





router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


// creating author
router.post("/BASE_URL/authors", AuthorController.createAuthor)
// login the author and creating jwt token
router.post("/login", BlogController.loginUser)
// creating the blog





module.exports = router;