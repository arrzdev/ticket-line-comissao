const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  mbway_number: String,
  time: String,
  amount: Number,
});

export default mongoose.models.payment || mongoose.model("payment", paymentSchema);