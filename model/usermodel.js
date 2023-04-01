const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const UserModel = mongoose.Schema({


    name: { type: String, trim: true },
    email: { type: String, trim: true, unique: true },
    password: { type: String },
    pic: {
        type: String,
        default: "https://img.favpng.com/21/21/2/computer-icons-user-profile-password-login-png-favpng-a5KCGVCAsuair5v9BArYfpjLK.jpg",
    }

}, {
    timestamps: true
})

UserModel.pre('save', async function(next) {
    if (!this.isModified) { next() }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})
const User = mongoose.model("User", UserModel);
module.exports = User;