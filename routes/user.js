import express from "express";
import {
  deleteUser,
  getAllUsers,
  singleUser,
  updateUser,
  userProfile,
  getMyAppointments
} from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/:id", isAuthenticated, isAuthorized(["patient"]), singleUser);
router.get("/", isAuthorized(["admin"]), getAllUsers);
router.put("/:id", isAuthenticated, isAuthorized(["patient"]), updateUser);
router.delete("/:id", isAuthenticated, isAuthorized(["patient"]), deleteUser);

router.get("/profile/me", isAuthenticated, isAuthorized(["patient"]), userProfile);
router.get("/appointments/my-appointments", isAuthenticated, isAuthorized(["patient"]), getMyAppointments);


export default router;
