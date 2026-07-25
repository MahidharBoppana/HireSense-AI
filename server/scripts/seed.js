import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../src/config/db.js";
import User from "../src/models/User.model.js";

dotenv.config({
  path: "./.env",
});

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    const existingSuperAdmin = await User.findOne({
      role: "super_admin",
    });

    if (existingSuperAdmin) {
      console.log("✅ Super Admin already exists");
      process.exit(0);
    }

    await User.create({
      firstName: process.env.SUPER_ADMIN_FIRST_NAME,
      lastName: SUPER_ADMIN_LAST_NAME,
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      role: "super_admin",
      isActive: true,
    });

    console.log("✅ Super Admin created successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedSuperAdmin();
