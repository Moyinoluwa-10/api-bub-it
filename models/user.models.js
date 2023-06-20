const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: [true, "Email already exists"],
    },
    // phoneNumber: {
    //   type: String,
    //   required: [true, "Please provide a phone number"],
    //   unique: [true, "Phone number already exists"],
    // },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: String,
    passwordTokenExpirationDate: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  this.fullName = this.firstName + " " + this.lastName;
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
