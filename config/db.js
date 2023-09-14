const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI_UFC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.blue.bold);
};

module.exports = connectDB;
