import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import { errorHandler } from "../utils/error.js";

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    // console.log(token);

    if (!token) return next(errorHandler(401, "Login First!"));

    jwt.verify(token, String(process.env.JWT_SECRET), (err, user) => {
      if (err) return next(errorHandler(403, "Token is not valid!"));
      req.user = user;
      // console.log(req.user.id);
      next();
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


// A higher order function where roles is an array of roles...
export const isAuthorized = (roles)=>  async (req, res, next) => {
  try {
    let user;
    const userId = req.user.id;
    const patient = await User.findById({ _id : userId });
    const doctor = await Doctor.findById({ _id : userId });

    if(patient){
        user = patient;
    }

    if(doctor){
        user = doctor;
    }


    if(!roles.includes(req.user.role)) return next(errorHandler(401,"You are not authorized!"));
      // console.log(req.user.role);
    next();


  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
