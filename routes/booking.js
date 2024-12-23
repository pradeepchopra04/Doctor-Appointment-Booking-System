import express from "express";
import { getCheckoutSession } from "../controllers/bookingController.js";

import { isAuthenticated } from "../auth/verifyToken.js";

const router = express.Router();

router.post("/checkout-session/:doctorId",isAuthenticated,getCheckoutSession);

export default router;

