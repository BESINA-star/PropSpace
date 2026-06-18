const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET || "supersecretkey",
    {
      expiresIn: "2h",
    }
  );
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email and password are required" });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: "Username or email already in use" });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    passwordHash,
  });

  return res.status(201).json({
    id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user),
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("username email avatarUrl contactPhone");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
};

const updateProfile = async (req, res) => {
  const { username, email, avatarUrl, contactPhone } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }
    user.username = username;
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }
    user.email = email;
  }

  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (contactPhone !== undefined) user.contactPhone = contactPhone;

  await user.save();

  return res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    contactPhone: user.contactPhone,
  });
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Old and new passwords are required" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Old password is incorrect" });
  }

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  await user.save();

  return res.status(200).json({ message: "Password updated successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
};
