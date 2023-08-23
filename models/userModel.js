import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "UserName area is gerekli kardeş"],
        unique: true,
        lowercase: true,
        validate: [validator.isAlphanumeric, "sadece harfleri kullan kardeş"],
    },
    email: {
        type: String,
        required: [true, "E-mail area is also gerekli kardeş"],
        unique: true,
        validate: [validator.isEmail, "Sallama lan doğru düzgün yaz"],
    },
    password: {
        type: String,
        required: [true, "Password area is gerekli kardeş"],
        minLength: [4, "4 karakterden fazla olmalı hocam"],
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    followings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
},

    {
        timestamps: true
    }

);


userSchema.pre("save", function (next) {
    const user = this;

    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;

        next();
    });

});



const User = mongoose.model('User', userSchema);

export default User;
