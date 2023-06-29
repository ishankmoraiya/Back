import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";

const schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: [true, "Your first name is required"],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, "Your last name is required"],
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Your email is required"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Your password is required"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        default: "public_id",
      },
      url: {
        type: String,
        trim: true,
        default:
          "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE=",
      },
    },
    address: { type: String },
    phone: {
      type: String,
      trim: true,
      maxlength: [10, "Phone number must be of 10 digits"],
      minlength: [10, "Phone number must be of 10 digits"],
    },
    state: {
      type: String,
    },
    city: { type: String },
    pincode: {
      type: String,
      trim: true,
      maxlength: [6, "Pincode must be of 6 digits"],
      minlength: [6, "Pincode must be of 6 digits"],
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    adhaar: {
      type: String,
      trim: true,
      maxlength: [12, "Adhaar number must be of 12 digits"],
      minlength: [12, "Adhaar number must be of 12 digits"],
    },
    searchFoundPersonHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoundPerson",
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],

    searchReportPersonHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ReportPerson",
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
    localTime: {
      type: String,
      default: new Date().toLocaleTimeString(),
    },
    localDate: {
      type: String,
      default: new Date().toLocaleDateString(),
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

schema.methods.getJWTtoken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", schema);
