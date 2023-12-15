import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt";
import validator from "validator";

const { Schema } = mongoose;

const username = 'suleyman';

User.findOneAndUpdate(
  { username: username },
  { isVerified: true },
  { new: true },
  (err, user) => {
    if (err) {
      console.error('Hata:', err);
    } else {
      console.log('Kullanıcı doğrulandı:', user);
      // Kullanıcı doğrulandıktan sonra ilgili işlemleri gerçekleştirebilirsiniz.
    }
  }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "lütfen username alanını doldurunuz!"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          return !/\s/.test(value);
        },
        message: "Kullanıcı adında boşluk karakteri kullanamazsınız",
      },
      isVerified: {
      type: Boolean,
      default: false // Yeni kullanıcılar için varsayılan olarak doğrulanmamış
    },
    },
    itsname: {
      type: String,
      required: [true, "Lütfen isminizi yazınız!"],
      lowercase: true,
      validate: {
        validator: (value) => {
          return /^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/.test(value) && !/\s/.test(value);
        },
        message: "Sadece harfleri kullanmalısınız",
      },
    },
    itssurname: {
      type: String,
      required: [true, "Lütfen soyadınızı yazınız!"],
      lowercase: true,
      validate: {
        validator: (value) => {
          return /^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/.test(value) && !/\s/.test(value);
        },
        message: "Sadece harfleri kullanmalısınız",
      },
    },

    email: {
      type: String,
      required: [true, "Lütfen E-mail alanını doldurunuz!"],
      unique: true,
      validate: [
        {
          validator: validator.isEmail,
          message: "Lütfen geçerli bir e-mail adresi giriniz",
        },
        {
          validator: (value) => {
            return !/\s/.test(value);
          },
          message: "E-posta adresinde boşluk karakteri kullanamazsınız",
        },
      ],
    },

    password: {
      type: String,
      required: [true, "lütfen password alanını doldurunuz!"],
      minLength: [
        8,
        "Password en az 8 karakter uzunluğunda olmalı, en az bir büyük harf ve bir sayı içermelidir.",
      ],
      validate: {
        validator: (value) => {
          return !/\s/.test(value);
        },
        message: "Parolada boşluk kullanamazsınız!!",
      },
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }
  
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;

    next();
  });
});

const User = mongoose.model("User", userSchema);

export default User;
