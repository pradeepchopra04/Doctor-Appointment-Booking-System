import { errorHandler } from "../utils/error.js";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const Register = async (req, res, next) => {
  try {
    const { name, email, password, photo, role, gender } = req.body;

    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    // To check if the user exists..
    if (user) return next(errorHandler(409, "User Already Exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "patient") {
      await User.create({
        name,
        email,
        password: hashedPassword,
        photo,
        role,
        gender,
      });
    }

    if (role === "doctor") {
      await Doctor.create({
        name,
        email,
        password: hashedPassword,
        photo,
        role,
        gender,
      });
    }

    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = null;

    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    } else if (doctor) {
      user = doctor;
    } else return next(errorHandler(404, "User not found"));

    // Comparing the password...

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) return next(errorHandler(401, "wrong credentials"));

    const expiryDate = new Date(Date.now() + 86400000); // 24 hour

    const token = jwt.sign(
      { id: user._id, role: user.role },
      String(process.env.JWT_SECRET),

    );


    res.cookie("access_token", token, { httpOnly: true, expires: expiryDate, secure : true, sameSite : "none" }).status(200).json({
      success: true,
      message: "Logged in successfully",
      data: user,
      expiryDate
    });

  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


export const Logout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Logged Out successfully!");
};
