import express from "express";
import {
  deleteDoctor,
  doctorProfile,
  getAllDoctors,
  singleDoctor,
  updateDoctor,
} from "../controllers/doctorController.js";
import { isAuthenticated, isAuthorized } from "../auth/verifyToken.js";
import ReviewRouter from "./review.js";

const router = express.Router();

// Nested Routes..
router.use("/:doctorId/reviews", ReviewRouter);
router.get("/profile/me",isAuthenticated,isAuthorized(["doctor"]),doctorProfile);

router.get("/:id", singleDoctor);
router.get("/", getAllDoctors);
router.put("/:id", isAuthenticated, isAuthorized(["doctor"]), updateDoctor);
router.delete("/:id", isAuthenticated, isAuthorized(["doctor"]), deleteDoctor);

export default router;
