import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    users: {
      type: Number,
      default: 0,
    },
    foundReport: {
      type: Number,
      default: 0,
    },
    missingReport: {
      type: Number,
      default: 0,
    },
    totalReports: {
      type: Number,
      default: 0,
    },
    totalReportSubmittedStatus: {
      type: Number,
      default: 0,
    },
    totalReportProcessingStatus: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model("Admin", schema);
