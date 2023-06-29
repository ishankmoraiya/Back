import express from "express";
import upload from "../middlewares/multer.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  addMoreFoundImages,
  addSearchedMissingToHistory,
  deleteSearchMissingHistory,
  foundPersonDetails,
  getAllFoundReport,
  getAllFoundReportAdmin,
  getFoundReportById,
  getSearchMissingHistory,
  searchMissingPerson,
} from "../controllers/foundControllers.js";

const router = express.Router();

router.route("/foundreport").post(upload, isAuthenticated, foundPersonDetails);

router
  .route("/addmorefoundimage/:id")
  .post(upload, isAuthenticated, addMoreFoundImages);

router.route("/allfoundreports").get(isAuthenticated, getAllFoundReport);

router.route("/singlefoundreport/:id").get(isAuthenticated, getFoundReportById);

router
  .route("/missingsearch/:fullname")
  .post(isAuthenticated, searchMissingPerson);

router
  .route("/addmissinghistory/:id")
  .put(isAuthenticated, addSearchedMissingToHistory);

router
  .route("/displaymissinghistory")
  .get(isAuthenticated, getSearchMissingHistory);

router
  .route("/deletemissingserchhistory/:id")
  .put(isAuthenticated, deleteSearchMissingHistory);

router
  .route("/getallfoundreports")
  .get(isAuthenticated, isAdmin, getAllFoundReportAdmin);

export default router;
