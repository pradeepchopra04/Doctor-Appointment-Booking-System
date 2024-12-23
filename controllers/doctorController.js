import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import { errorHandler } from "../utils/error.js";

export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id);

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Doctor Updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Doctor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Doctor Deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const singleDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).populate("reviews").select("-password");

    if (!doctor) return next(errorHandler(404, "Doctor Does Not Exists"));

    res.status(200).json({
      success: true,
      message: "Doctor Found successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getAllDoctors = async (req, res, next) => {
  try {
    const { query } = req.query;

    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    res.status(200).json({
      success: true,
      message: "All Doctors Fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


export const doctorProfile = async (req, res, next) => {
  try {
    const doctorId = req.user.id;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return next(errorHandler(404, "Doctor not found"));
    } 

    const {password, ...rest} = doctor._doc;

    const appointments = await Booking.find({doctor : doctorId});
    // console.log({...rest,appointments});

    
    res.status(200).json({
      success: true,
      message: "Doctor profile fetched successfully",
      data : {...rest, appointments}
    });

  } catch (error) {
    console.log(error.message);
    next(error);
  }
};