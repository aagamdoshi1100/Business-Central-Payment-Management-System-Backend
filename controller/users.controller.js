import User from "../models/User.model.js";

const createUser = async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body;
    if (!name || !email || !role || !password) {
      return res.status(400).json({
        result: false,
        message: "All fields are required",
      });
    }
    const userCreation = await User.create(req.body);
    return res.status(201).json({
      result: true,
      message: "User cereated successfully",
      userCreation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Failed to create user",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({
      result: true,
      message: "Fetched all users",
      users,
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
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      result: true,
      message: "Fetched all users",
      updateUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Failed to fetch users",
    });
  }
};

export {
  createUser,
  getAllUsers,
  getUserById,
  findUserAndDelete,
  findUserAndUpdate,
};
