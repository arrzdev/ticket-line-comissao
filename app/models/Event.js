const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  date: String, 
  time: String,
  location: String,
  price: Number,
  tickets_delivered: Boolean, //true if guests have received their tickets
});

export default mongoose.models.event || mongoose.model("event", eventSchema);