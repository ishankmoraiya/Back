import express from "express";
import {
  addMoreImages,
  addSearchedFoundToHistory,
  deleteSearchFoundHistory,
  getAllMissingReportAdmin,
  getAllReport,
  getReportById,
  getSearchFoundHistory,
  reportPersonDetails,
  searchFoundPerson,
  updatemissingReportStauts,
} from "../controllers/reportControllers.js";
import upload from "../middlewares/multer.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/report").post(upload, isAuthenticated, reportPersonDetails);

router.route("/addmoreimage/:id").post(upload, isAuthenticated, addMoreImages);

router.route("/allreports").get(isAuthenticated, getAllReport);

router.route("/singlereport/:id").get(isAuthenticated, getReportById);

router.route("/foundsearch/:fullname").post(isAuthenticated, searchFoundPerson);

router
  .route("/addfoundtohistory/:id")
  .put(isAuthenticated, addSearchedFoundToHistory);

router
  .route("/displayfoundhistory")
  .get(isAuthenticated, getSearchFoundHistory);

router
  .route("/deletefoundserchhistory/:id")
  .put(isAuthenticated, deleteSearchFoundHistory);

router
  .route("/getallmissingreports")
  .get(isAuthenticated, isAdmin, getAllMissingReportAdmin);

router
  .route("/updatemissingstatus/:id")
  .put(isAuthenticated, isAdmin, updatemissingReportStauts);

export default router;
