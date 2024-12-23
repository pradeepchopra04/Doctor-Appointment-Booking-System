import User from "../models/UserSchema.js";
import { errorHandler } from "../utils/error.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name,email,password,photo,gender,bloodType } = req.body;

    if(password == ""){
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
            email,
            photo,
            gender,
            bloodType,
          },
        },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "User Updated successfully",
        data: updatedUser,
      });
    }

    else{
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
            email,
            password,
            photo,
            gender,
            bloodType,
          },
        },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "User Updated successfully",
        data: updatedUser,
      });
    }


  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User Deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const singleUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) return next(errorHandler(404, "User Does Not Exists"));

    res.status(200).json({
      success: true,
      message: "User Found successfully",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const Users = await User.find({}).select("-password");

    if (!Users) return next(errorHandler(404, "No User Exists"));

    res.status(200).json({
      success: true,
      message: "All Users Fetched successfully",
      data: Users,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const userProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    } 

    const {password, ...rest} = user._doc;
    
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data : {...rest}
    });


  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

 
export const getMyAppointments = async (req, res, next) => {
  try {

    // Step 1 : Retrieve appointments from the booking data for a specific user..

    const bookings = await Booking.find({user : req.user.id});

    // Step 2 : Extract doctors ID from Appointment...

    const doctorsId = bookings.map(item => String(item.doctor._id));

    // Step 3 : Retrieve doctors information using the doctors ID...

    const doctors = await Doctor.find({_id : {$in : doctorsId}}).select("-password");

    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data : doctors
    });
    
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
