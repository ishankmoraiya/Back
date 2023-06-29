import { User } from "../models/User.js";
import { FoundPerson } from "../models/FoundPerson.js";
import { ReportPerson } from "../models/ReportPerson.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

export const foundPersonDetails = async (req, res) => {
  const user = await User.findById(req.user._id);
  try {
    const {
      fullname,
      age,
      gender,
      height,
      landmark,
      city,
      state,
      pincode,
      foundPlace,
      foundDate,
      foundTime,
      founddesc,
    } = req.body;

    const file = req.file;

    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: `Finder/${user.username}/FoundPerson`,
    });

    const report = await FoundPerson.create({
      user: user,
      fullname,
      age,
      gender,
      height,
      landmark,
      city,
      state,
      pincode,
      foundPlace,
      foundDate,
      foundTime,
      founddesc,
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
export const addMoreFoundImages = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const report = await FoundPerson.findById(req.params.id);

    if (!report) {
      return res.status(400).json({ message: "Report not found" });
    }

    const file = req.file;

    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: `Finder/${user.username}/FoundPerson`,
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
export const getAllFoundReport = async (req, res) => {
  try {
    const reports = await FoundPerson.find({ user: req.user._id })
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

export const getFoundReportById = async (req, res) => {
  try {
    const report = await FoundPerson.findById(req.params.id);

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

// search missing person report by fullname in input field
export const searchMissingPerson = async (req, res) => {
  try {
    const reportPerson = req.params.fullname;

    const missing = await ReportPerson.find({
      fullname: { $regex: reportPerson, $options: "i" },
    }).sort({ createdAt: -1 });

    if (!missing) {
      res.status(400).json({ message: "Sorry! Person not found" });
    }

    res.status(200).json({
      success: true,
      missing,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addSearchedMissingToHistory = async (req, res) => {
  try {
    // push serched found person to history by _id
    const user = await User.findById(req.user._id);
    const missing = await ReportPerson.findById(req.params.id);

    if (!missing) {
      res.status(400).json({ message: "Sorry! Person not found" });
    }

    const isMissing = user.searchReportPersonHistory.find(
      (r) => r.user.toString() === missing._id.toString()
    );

    if (isMissing) {
      // update createdAt
      await User.updateOne(
        {
          _id: req.user._id,
          "searchReportPersonHistory.user": missing._id,
        },
        {
          $set: {
            "searchReportPersonHistory.$.createdAt": new Date(),
          },
        }
      );
    } else {
      await user.searchReportPersonHistory.unshift({
        user: missing._id,
        createdAt: Date.now(),
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

export const getSearchMissingHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("searchReportPersonHistory")
      .populate("searchReportPersonHistory.user");

    res.status(200).json({
      success: true,
      displayhistory2: user.searchReportPersonHistory,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSearchMissingHistory = async (req, res) => {
  try {
    await User.updateOne(
      {
        _id: req.user._id,
      },
      {
        $pull: {
          searchReportPersonHistory: {
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

export const getAllFoundReportAdmin = async (req, res) => {
  try {
    const foundreports = await FoundPerson.find({}).populate("user");

    res.status(200).json({
      success: true,
      foundreports,
    })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}