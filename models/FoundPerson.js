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
    landmark: {
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
    foundPlace: {
      type: String,
    },
    foundDate: {
      type: String,
    },
    foundTime: {
      type: String,
    },
    founddesc: {
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

export const FoundPerson = mongoose.model("FoundPerson", schema);
