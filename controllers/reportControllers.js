import { User } from "../models/User.js";
import { ReportPerson } from "../models/ReportPerson.js";
import { FoundPerson } from "../models/FoundPerson.js";
import { Admin } from "../models/Admin.js";
import getDataUri from "../utils/dataUri.js";
// import moment from "moment";
import cloudinary from "cloudinary";

export const reportPersonDetails = async (req, res) => {
  const user = await User.findById(req.user._id);
  try {
    const {
      fullname,
      age,
      gender,
      height,
      mobileno,
      adhaar,
      address,
      city,
      state,
      pincode,
      incidentPlace,
      incidentDate,
      incidentTime,
      incidentdesc,
    } = req.body;

    const file = req.file;

    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: `Finder/${user.username}/ReportedPerson`,
    });

    const report = await ReportPerson.create({
      user: user,
      fullname,
      age,
      gender,
      height,
      mobileno,
      adhaar,
      address,
      city,
      state,
      pincode,
      incidentPlace,
      incidentDate,
      incidentTime,
      incidentdesc,
      picture: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    if (!report) {
      return res.status(400).json({ message: "Something went Wrong" });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Report Submitted Successfully. We will contact you soon.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// add more images of lost person only after 30 minutes when report is submitted
export const addMoreImages = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const report = await ReportPerson.findById(req.params.id);

    if (!report) {
      return res.status(400).json({ message: "Report not found" });
    }

    const file = req.file;

    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: `Finder/${user.username}/ReportedPerson`,
    });

    report.picture.push({
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    });

    await report.save();

    res.status(200).json({
      success: true,
      message: "Image added successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all report of user
export const getAllReport = async (req, res) => {
  try {
    const reports = await ReportPerson.find({ user: req.user._id })
      .populate(
        "user",
        "firstname lastname email username mobileno adhaar address city state pincode"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await ReportPerson.findById(req.params.id);

    if (!report) {
      res.status(400).json({ message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// search found person by fullname in input field
export const searchFoundPerson = async (req, res) => {
  try {
    const foundPerson = req.params.fullname;
    const { cretedatefilter } = req.body;

    const found = await FoundPerson.find({
      fullname: { $regex: foundPerson, $options: "i" },
      // filter by days ago
      // createdAt: {
      //   $gte: moment().subtract(Number(cretedatefilter), "d").toDate(),
      // },
    });

    if (!found) {
      res.status(400).json({ message: "Sorry! Person not found" });
    }

    res.status(200).json({
      success: true,
      found,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addSearchedFoundToHistory = async (req, res) => {
  try {
    // push serched found person to history by _id
    const user = await User.findById(req.user._id);
    const found = await FoundPerson.findById(req.params.id);

    if (!found) {
      res.status(400).json({ message: "Sorry! Person not found" });
    }

    const isFound = user.searchFoundPersonHistory.find(
      (r) => r.user.toString() === found._id.toString()
    );

    if (isFound) {
      // update createdAt
      await User.updateOne(
        {
          _id: req.user._id,
          "searchFoundPersonHistory.user": found._id,
        },
        {
          $set: {
            "searchFoundPersonHistory.$.createdAt": new Date(),
          },
        }
      );
    } else {
      await user.searchFoundPersonHistory.push({
        user: found._id,
        createdAt: new Date(),
      });

      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Added to history",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSearchFoundHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("searchFoundPersonHistory")
      .populate("searchFoundPersonHistory.user");

    res.status(200).json({
      success: true,
      displayhistory: user.searchFoundPersonHistory,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSearchFoundHistory = async (req, res) => {
  try {
    await User.updateOne(
      {
        _id: req.user._id,
      },
      {
        $pull: {
          searchFoundPersonHistory: {
            user: req.params.id,
          },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Removed from history",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllMissingReportAdmin = async (req, res) => {
  try {
    const missingreports = await ReportPerson.find({}).populate("user");

    res.status(200).json({
      success: true,
      missingreports,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatemissingReportStauts = async (req, res) => {
  try {
    const report = await ReportPerson.findById(req.params.id);

    if (!report) {
      return res.status(400).json({ message: "Report not found" });
    }

    if (report.status === "Processing") {
      report.status = "Submitted";
    } else {
      return res.status(400).json({ message: "Report is already submitted" });
    }

    // if (report.status === "Submitted") {
    //   return res.status(400).json({ message: "Report is already submitted" });
    // }

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report status updated successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
