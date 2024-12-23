import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";



// To get all reviews..

export const getAllReviews = async (req, res, next) =>{
    try {

        const reviews = await Review.find({});

        res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data : reviews
        });
        
    } catch (error) {
        console.log(error);
        next(error);
    }
}


// Post a new review...

export const postReview = async(req, res, next) => {
    try {

        if(!req.body.doctor) req.body.doctor = req.params.doctorId;  // Doctor ID..
        if(!req.body.user) req.body.user = req.user.id; // User ID..

        const postedReview = await Review.create(req.body);

        await Doctor.findByIdAndUpdate(req.body.doctor, {
            $push : { reviews : postedReview._id}
        })

        res.status(200).json({
            success: true,
            message: "Review posted successfully",
        })

        
    } catch (error) {
        console.log(error);
        next(error);
    }
};