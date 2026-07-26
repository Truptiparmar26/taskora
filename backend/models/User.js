// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     name : String,
//     email : {
//         type : String,
//         unique: true
//     },
//     password: String
// });

// module.exports = mongoose.model("User",userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique: true
    },
    password: String,
    img: { 
        type: String, 
        default: "" // Image ka URL ya Base64 string yahan hoga
    } 
});

module.exports = mongoose.model("User",userSchema);