const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const validate = require('validator');
//const { request } = require('express');

const isValid = (value) => {

    if (typeof (value) === 'undefined' || typeof (value) === 'null') {
        return false;
    }
    if (typeof (value) === "string" && value.trim().length === 0) {
        return false;
    }
    return true
}


const isValidTitle = (title) => {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}

// const isValidEmail = (email) => {
//     if (validate.isEmail(email)) {
//         return true
//     }
// }


const isValidRequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}

const createUser = async function (req, res) {
    try {

        let requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request Parameters. Please provide User Details" })
        }

        // Extracting Parameters

        const { title, name, phone, email, password, address } = requestBody;

        // Validating....

        if (!isValid(title)) {
            res.status(400).send({ status: false, message: "Title is required" })
            return
        }

        if (!isValidTitle(title)) {
            res.status(400).send({ status: false, message: "Title Should Be Among Mr , Mrs , Miss" })
            return
        }

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: "User Name is required" })
            return
        }

        if (!isValid(phone)) {
            res.status(400).send({ status: false, message: "User phone number is required" })
            return
        }

        if (!isValid(email)) {
            res.status(400).send({ status: false, message: "User email is required" })
            return
        }

        if (!validate.isEmail(email)) {
            return res.status(400).send({ status: false, msg: "Invalid Email" })
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, message: "User password is required" })
            return
        }

        if (password.trim().length < 8 || password.trim().length > 15) {
            res.status(400).send({ status: false, message: "password should be 8 to 15 characters" })
            return
        }

        // if(!isValidRequestBody(address))
        //   return res.status(400).send({ status : false, msg : "address" })

        if (!isValid(address)) {
            res.status(400).send({ status: false, message: "User address is required" })
            return
        }

        if(!isValid(address.street))
        return res.status(400).send({ status : false, msg : "street is required" })
 
        
        if(!isValid(address.city))
        return res.status(400).send({ status : false, msg : "city is required" })

        
        if(!isValid(address.pincode))
        return res.status(400).send({ status : false, msg : "pincode is required" })
        

        const isPhoneAlreadyUsed = await UserModel.findOne({ phone });

        if (isPhoneAlreadyUsed) {
            res.status(400).send({ status: false, message: `${phone} is Already Registered` })
            return
        }

        const isEmailAlreadyUsed = await UserModel.findOne({ email });

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} is Already Registered` })
            return
        }


        const userData = await UserModel.create( requestBody );
        return res.status(201).send({ status: true, message: 'User Created Successfully', user: userData })
        

    } catch (err) {
        //if(SyntaxError == true)
        //res.send()
        return res.status(500).send({ status: false, message: err.message })
        
    }
}




////   login_Part   ////
const loginUser = async function (req, res) {
    try {

        const requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Invalid request parameters . Please Provide login Details" })
        }

        const { email, password } = requestBody

        if (!isValid(email)) {
            res.status(400).send({ status: false, message: "Email is required" })
            return
        }

        if (!validate.isEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is required" })
        }

        let user = await UserModel.findOne({ email, password });

        if (!user)
            return res.status(404).send({ status: false, message: "User Not Found , plz check Credentials", });


        const token = jwt.sign({
            user : user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        }, 'Book-Management')

        res.header('x-api-key', token)
        res.status(200).send({ status: true, message: `User login successfully`, data: { token } })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
        return
    }

};


module.exports.createUser = createUser;

module.exports.loginUser = loginUser








// const loginUser = async function(req,res) {
//     try {

//     const {email, password } = data

//     const req3 = isValid(email)
//     if (!req3) {
//         return res.status(400).send("email is required")
//     }

//     const req4 = isValid(password)
//     if (!req4) {
//         return res.status(400).send("password is required")
//     }

//       const findEmail= await UserModel.find({email:email})
//       if(!findEmail){ return res.status(400).send("email is not registered")}


//       const findPassword= await UserModel.find({password:password})
//       if(!findPassword){ return res.status(400).send("Password is invalid")}


// if(findEmail && findPassword)
// {

//     const  token =  jwt.sign({
//         userId:findEmail._id,
//         iat:Math.floor(Date.now() /1000),
//         exp:Math.floor(Date.now() /1000)+ 10*60*60
//      },'Book-Management')
//      res.header('x-api-key',token)
//      return res.status(200).send({ status: true, message: 'User login successfully', token: token })
// }}
// catch(err) {
// res.status(500).send({ status : false , message : err.message})
// return
// }}


