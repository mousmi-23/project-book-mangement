const UserModel = require('../models/userModel')
const BookModel = require('../models/bookModel')
const { default: mongoose } = require('mongoose')

const isValid = function (value) {

    if (typeof (value) == 'undefined' || typeof (value) == 'null') { return false }
    if (typeof (value) == 'string' && value.trim().length == 0) { return false }
    return true

}
const isValidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const createBook = async function (req, res) {

    try {
        const data = req.body
        console.log(data)

        if (Object.keys(data) == 0) { return res.status(400).send('data  is missing') }

        // const title=data.title.trim()
        // const excerpt=data.excerpt.trim()
        // const ISBN=data.ISBN.trim()
        // const category=data.category.trim()
        // const subcategory=data.subcategory.trim()
        const { title, excerpt, ISBN, category, subcategory, releasedAt, userId } = data
        //if(!userId){return res.status(400).send("userID is required")} (by this trim is not handled)



        // title is required
        const req0 = isValid(title)
        if (!req0) { return res.status(400).send('title is required') }

        // title should be unique
        const titleAlreadyUsed = await BookModel.findOne({ title: title })
        if (titleAlreadyUsed) { return res.status(400).send('title should be unique') }


        // excerpt is required
        const req1 = isValid(excerpt)
        if (!req1) { return res.status(400).send('excerpt is required') }

        // userId is required
        const req8 = isValid(userId)
        if (!req8) { return res.status(400).send('userId is required') }

        // userId validation
        // const userId=data.userId.trim()
        const User = await UserModel.findById(userId)
        if (!User) { return res.status(400).send("invalid userId") }



        // ISBN is required
        const req3 = isValid(ISBN)
        if (!req3) { return res.status(400).send('ISBN is required') }

        // ISBN should be unique
        const ISBNisAlreadyUsed = await BookModel.findOne({ ISBN })
        if (ISBNisAlreadyUsed) { return res.status(400).send('ISBN should be unique') }


        const req4 = isValid(category)
        if (!req4) { return res.status(400).send('category is required') }


        const req5 = isValid(subcategory)
        if (!req5) { return res.status(400).send('subcategory is required') }

        const req6 = isValid(releasedAt)
        if (!req6) { return res.status(400).send('releasedAt is required') }



        const saveData = await BookModel.create(data);
        res.status(201).send({ status: true, data: saveData })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}


const getBook = async function (req, res) {
    try {
        const queryParams = req.query
        console.log(queryParams)
        const filterQueryParams = { isDeleted: false }

        if (isValidRequestBody(queryParams)) {
            const { userId, category, subcategory } = queryParams

            if (isValid(userId) && isValidObjectId(userId)) {
                filterQueryParams["userId"] = userId.trim()
            }

            if (isValid(category)) {
                filterQueryParams["category"] = category.trim()
            }

            if (isValid(subcategory)) {
                filterQueryParams["subcategory"] = subcategory.trim()
            }
        }
        const findBook = await BookModel.find(filterQueryParams).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 }).count()
        const findBook1 = await BookModel.find(filterQueryParams).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
        
        if (Array.isArray(findBook1) && findBook1.length == 0) {
            return res.status(404).send({ status: false, message: "No Books Found" })
        }
        return res.status(201).send({ status: true, message: "Books Find Successfully", count: findBook, data: findBook1 })
    }

    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports.createBook = createBook
module.exports.getBook = getBook



// const getBook = async function (req, res) {
//     try {
//         const data = req.body
//         console.log(req.body)

//         const findBook = await BookModel.find(data).find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
//         if (findBook.length == 0) {
//             return res.status(404).send({ status: false, message: "No Books Found" })
//         }
//         return res.status(201).send({ status: true, message: "Books Find Successfully", data: findBook })
//     }

//     catch (err) {
//         res.status(500).send({ error: err.message })
//     }
// }
