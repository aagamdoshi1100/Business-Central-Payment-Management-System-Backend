import User from "../models/User.model.js";
import bcrypt from "bcrypt";
const createUser = async (req, res) => {
  try {
    const { name, email, accessType, status, password } = req.body;

    if (!name || !email || !accessType || !password) {
      return res.status(400).json({
        result: false,
        message: "All fields are required",
      });
    }

    // Check user exist or not
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email address",
        field: "email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Auto-enable access for the first user in the collection
    const usersCount = await User.countDocuments();

    const userCreation = await User.create({
      ...req.body,
      accessEnabled: usersCount === 0,
      password: hashedPassword,
    });
    return res.status(201).json({
      result: true,
      message: "User cereated successfully",
      user: userCreation.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Failed to create user",
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        result: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        result: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        result: false,
        message: "Invalid email or password",
      });
    }

    if (!user.accessEnabled) {
      return res.status(403).json({
        result: false,
        message: "Account is disabled. Please contact admin",
      });
    }
    const token = user.generateAuthToken();

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      result: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accessType: user.accessType,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Failed to login",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const users = await User.find({})
      .limit(options?.limit * 1)
      .skip(options?.page * options?.limit)
      .sort(options?.sort);

    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      result: true,
      message: "Fetched all users",
      users,
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Failed to fetch users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    return res.status(200).json({
      result: true,
      message: "Fetched all users",
      getUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Failed to fetch users",
    });
  }
};

const findUserAndDelete = async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      result: true,
      message: "User deleted",
      deleteUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Failed to fetch users",
    });
  }
};

const findUserAndUpdate = async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { accessEnabled: !req.body.status },
      {
        new: true,
      }
    );
    if (!updateUser) {
      throw new Error("Failed to update user account");
    }
    return res.status(200).json({
      result: true,
      message: "User account updated",
      user: {
        name: updateUser.name,
        _id: updateUser._id,
        accessEnabled: updateUser.accessEnabled,
        accessType: updateUser.accessType,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Failed to update user account",
    });
  }
};

export {
  createUser,
  getAllUsers,
  getUserById,
  findUserAndDelete,
  findUserAndUpdate,
  verifyUser,
};
