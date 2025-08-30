import mongoose from "mongoose";

const DB_CONNECTION = async () => {
  try {
    const DB = await mongoose.connect(process.env.MONGODB_URL);
    console.log("DATABASE IS CONNECTED SUCCESSFULLY 🎉🎉🎉");
    return DB;
  } catch (error) {
    console.log("DATABASE Connection Failed ❌", error.message);
  }
};

export { DB_CONNECTION };
