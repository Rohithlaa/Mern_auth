const mongoose = require('mongoose')

const schema = mongoose.Schema;

let UserModel = new schema({
    username :{
        type: String
    },
    password:{
        type: String
    }
})

module.exports = UserModel = mongoose.model("User", UserModel);