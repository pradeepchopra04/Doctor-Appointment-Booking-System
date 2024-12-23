import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
import AuthRouter from "./routes/auth.js";
import UserRouter from "./routes/user.js";
import DoctorRouter from "./routes/doctor.js";
import ReviewRouter from "./routes/review.js";
import BookingRouter from "./routes/booking.js";


const app = express();


// Database Connection...
mongoose
  .connect(String(process.env.MONGO))
  .then((c) => {
    console.log('Connected to MongoDB on: ' + c.connection.host);
  })
  .catch((err) => {
    console.log(err);
  });



// Adding Middlewares...  
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin : "https://doctor-appointment-client-taupe.vercel.app",
    methods : ['GET', 'POST', 'PUT', 'DELETE'],
    credentials : true
}));


// Routes Configuration...

app.use("/api/v1/auth", AuthRouter );
app.use("/api/v1/users", UserRouter );
app.use("/api/v1/doctors", DoctorRouter );
app.use("/api/v1/reviews", ReviewRouter );
app.use("/api/v1/bookings", BookingRouter );





// Testing API...

app.get("/", ( req, res ) => {
    res.json({
        success : true,
        message : "Api is working properly"
    })
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      message,
      statusCode,
    });
  });

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log('App listening on port:' + PORT);
});