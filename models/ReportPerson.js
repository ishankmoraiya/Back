import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    mobileno: {
      type: Number,
      maxlength: [10, "Mobile number must be of 10 digits"],
      minlength: [10, "Mobile number must be of 10 digits"],
    },
    adhaar: {
      type: Number,
      required: true,
      maxlength: [12, "Adhaar number must be of 12 digits"],
      minlength: [12, "Adhaar number must be of 12 digits"],
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    incidentPlace: {
      type: String,
    },
    incidentDate: {
      type: String,
    },
    incidentTime: {
      type: String,
    },
    incidentdesc: {
      type: String,
    },
    picture: [
      {
        public_id: {
          type: String,
          default: "public_id",
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    status: {
      type: String,
      default: "Processing",
    },
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

export const ReportPerson = mongoose.model("ReportPerson", schema);
