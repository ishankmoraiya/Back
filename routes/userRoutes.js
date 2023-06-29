import express from "express";
// import upload from "../middlewares/multer.js";
import {
  completeProfile,
  deleteUser,
  getAllMissingandFoundReports,
  getAllUsers,
  getSingleUser,
  login,
  logout,
  myProfile,
  registerUser,
  updateUserRole,
} from "../controllers/userControllers.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(login);

router.route("/me").get(isAuthenticated, myProfile);

router.route("/completeinfo").post(isAuthenticated, completeProfile);

router.route("/logout").post(isAuthenticated, logout);

router.route("/allusers").get(isAuthenticated, isAdmin, getAllUsers);

router
  .route("/alladminreports")
  .get(isAuthenticated, isAdmin, getAllMissingandFoundReports);

router.route("/updaterole/:id").put(isAuthenticated, isAdmin, updateUserRole);

router.route("/deleteuser/:id").delete(isAuthenticated, isAdmin, deleteUser);

router.route("/getsingleuser/:id").get(isAuthenticated, isAdmin, getSingleUser);

export default router;
