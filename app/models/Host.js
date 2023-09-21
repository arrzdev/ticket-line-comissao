const mongoose = require("mongoose");

const hostSchema = new mongoose.Schema({
  username: String,
  password: String, 
});

export default mongoose.models.host || mongoose.model("host", hostSchema);