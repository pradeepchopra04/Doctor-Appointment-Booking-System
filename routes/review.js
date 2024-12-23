import express from "express";
import { getAllReviews, postReview } from "../controllers/reviewController.js";
import {isAuthenticated,isAuthorized} from "../auth/verifyToken.js";

const router = express.Router({mergeParams : true});


// router.route("/:doctorId/reviews").get(getAllReviews).post(isAuthenticated, isAuthorized(["patient"]), postReview);

router.route("/").get(getAllReviews).post(isAuthenticated, isAuthorized(["patient"]), postReview);







export default router;