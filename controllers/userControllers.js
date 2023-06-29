import { User } from "../models/User.js";
import { ReportPerson } from "../models/ReportPerson.js";
import { FoundPerson } from "../models/FoundPerson.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import { validateUsername } from "../utils/validateUsername.js";
import { sendToken } from "../utils/sendToken.js";

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, username } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    let combinedUsername = firstname + lastname;

    let newUsernames = await validateUsername(combinedUsername);

    user = await User.create({
      firstname,
      lastname,
      username: newUsernames,
      email,
      password,
    });

    // const accountVerficationToken = user.accountVerificationToken(
    //   { _id: user._id.toString() },
    //   "30m"
    // );

    // const url = `${process.env.FRONTEND_URL}/activate/${accountVerficationToken}`;
    // accountVerificationLink(user.email, user.firstName, url);

    sendToken(
      res,
      user,
      `${user.firstname} registered successfully. Activate your account by clicking on the link send to your Email.`,
      201
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    sendToken(res, user, `${user.firstname} logged in successfully`, 200);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// complete the profile
export const completeProfile = async (req, res) => {
  try {
    const { address, phone, state, city, pincode, gender, dob, adhaar } =
      req.body;

    if (
      !address ||
      !phone ||
      !state ||
      !city ||
      !pincode ||
      !adhaar ||
      !dob ||
      !gender
    ) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const completeinfo = await User.findByIdAndUpdate(
      req.user._id,
      {
        address,
        phone,
        state,
        city,
        pincode,
        gender,
        dob,
        adhaar,
      },
      { runValidators: true }
    );

    if (!completeinfo) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    res.status(200).json({
      success: true,
      message: "Information updated successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllMissingandFoundReports = async (req, res) => {
  try {
    const misssing = await ReportPerson.find({}).populate("user");
    const found = await FoundPerson.find({}).populate("user");

    const allAdminReports = [...misssing, ...found];

    // sort the allAdminReports array by createdAt time

    allAdminReports.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      success: true,
      allAdminReports,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      user.role = "user";
    }
    if (user.role === "user") {
      user.role = "admin";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    await user.remove();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
