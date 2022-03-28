const express = require('express');
const router = express.Router();
const UserController= require("../controllers/userController")
const BookController= require("../controllers/bookController")
//const Mw = require("../middleware/auth")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


// creating User
router.post("/register", UserController.createUser)

// login the User and creating jwt token
router.post("/login", UserController.loginUser)

// creating the book
router.post("/books", BookController.createBook)

// get all the books
router.get("/books", BookController.getBook)

module.exports = router;