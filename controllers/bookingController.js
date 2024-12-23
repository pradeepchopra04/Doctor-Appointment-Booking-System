import User from "../models/UserSchema.js";
// import { errorHandler } from "../utils/error.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
  try {
    // Finding currently booked doctor....

    const doctor = await Doctor.findById(req.params.doctorId);
    // Currently LoggedIn User...

    const user = await User.findById(req.user.id);

    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

    // Creating stripe checkout session...

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${String(process.env.CLIENT_URL)}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor._id}`,
      customer_email: user?.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "INR",
            unit_amount: doctor.ticketPrice * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    // Now create a new booking....

    const booking = await Booking.create({
      doctor: doctor?._id,
      user: user?._id,
      ticketPrice: doctor?.ticketPrice,
      session: session.id,
      appointmentDate: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    });

    await User.updateOne(
      { _id: user._id },
      { $push: { appointments: booking._id } }
    );

    await Doctor.updateOne(
      { _id: doctor._id },
      { $push: { appointments: booking._id } }
    );

    res.status(200).json({
      success: true,
      message: "Appointment Booked Successfully",
      session,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Creating Checkout Session",
    });
  }
};
