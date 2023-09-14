const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  mbway_number: String, //owner of the ticket
  used: Boolean,
  read_on: Date,
});

export default mongoose.models.ticket || mongoose.model("ticket", ticketSchema);