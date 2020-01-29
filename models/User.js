const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"]
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//Encrypt password using bcrypt
UserSchema.pre("save", async function(next) {
  if(!this.isModified("passowrd")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Sign JWT and Return
UserSchema.methods.getSignedJwtTOken = function() {
  return jwt.sign(
    {
      id: this._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// Match user entered Password to Hashed password in DB
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generate and Hash password token
UserSchema.methods.getResetPasswordToken = function() {
  //Generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hash Token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    //Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
