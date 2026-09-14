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
    }).select("+password");

    if (existingSuperAdmin) {
      existingSuperAdmin.firstName = process.env.SUPER_ADMIN_FIRST_NAME;

      existingSuperAdmin.lastName = process.env.SUPER_ADMIN_LAST_NAME;

      existingSuperAdmin.email =
        process.env.SUPER_ADMIN_EMAIL.toLowerCase().trim();

      existingSuperAdmin.password = process.env.SUPER_ADMIN_PASSWORD;

      existingSuperAdmin.isActive = true;

      await existingSuperAdmin.save();

      console.log("✅ Super Admin updated successfully");
      process.exit(0);
    }

    await User.create({
      firstName: process.env.SUPER_ADMIN_FIRST_NAME,
      lastName: process.env.SUPER_ADMIN_LAST_NAME,
      email: process.env.SUPER_ADMIN_EMAIL.toLowerCase().trim(),
      password: process.env.SUPER_ADMIN_PASSWORD,
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
