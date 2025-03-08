const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// SUV Booking Schema
const BookingSchema = new mongoose.Schema({
    from: String,
    to: String,
    time: String,
    customerName: String,
    phone: String,
    status: { type: String, default: "Pending" }
});
const Booking = mongoose.model("Booking", BookingSchema);

// Create a new booking
app.post("/api/book", async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.json({ message: "Booking successful!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all bookings (Admin)
app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a booking (Admin)
app.delete("/api/bookings/:id", async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Booking deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
