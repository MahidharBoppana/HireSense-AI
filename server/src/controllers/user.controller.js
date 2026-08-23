import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if ([firstName, lastName, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: req.role,
    createdBy: req.user._id,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        `${req.role.replace("_", " ")} created successfully`,
      ),
    );
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: req.role,
  })
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        users,
        `${req.role.replace("_", " ")}s fetched successfully`,
      ),
    );
});

const getActiveHiringManagers = asyncHandler(async (req, res) => {
  const hiringManagers = await User.find({
    role: "hiring_manager",
    isActive: true,
  })
    .select("firstName lastName email")
    .sort({ firstName: 1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        hiringManagers,
        "Active hiring managers fetched successfully",
      ),
    );
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({
    _id: id,
    role: req.role,
  }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, `${req.role.replace("_", " ")} not found`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        `${req.role.replace("_", " ")} fetched successfully`,
      ),
    );
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  const user = await User.findOne({
    _id: id,
    role: req.role,
  });

  if (!user) {
    throw new ApiError(404, `${req.role.replace("_", " ")} not found`);
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: id },
    });

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    user.email = email.toLowerCase().trim();
  }

  if (firstName !== undefined) {
    user.firstName = firstName.trim();
  }

  if (lastName !== undefined) {
    user.lastName = lastName.trim();
  }

  user.updatedBy = req.user._id;

  await user.save();

  const updatedUser = await User.findById(id).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser,
        `${req.role.replace("_", " ")} updated successfully`,
      ),
    );
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive must be a boolean");
  }

  const user = await User.findOne({
    _id: id,
    role: req.role,
  });

  if (!user) {
    throw new ApiError(404, `${req.role.replace("_", " ")} not found`);
  }

  user.isActive = isActive;
  user.updatedBy = req.user._id;

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        `${req.role.replace("_", " ")} ${
          isActive ? "activated" : "deactivated"
        } successfully`,
      ),
    );
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({
    _id: id,
    role: req.role,
  });

  if (!user) {
    throw new ApiError(404, `${req.role.replace("_", " ")} not found`);
  }

  await user.deleteOne();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        `${req.role.replace("_", " ")} deleted successfully`,
      ),
    );
});

export {
  createUser,
  getUsers,
  getActiveHiringManagers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
};
