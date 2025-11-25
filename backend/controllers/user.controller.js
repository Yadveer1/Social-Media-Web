import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connections.model.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import { verifyGoogleToken } from "../services/google-auth.service.js";

const convertUserDataToPdf = async (userData) => {
  const doc = new PDFDocument({ margin: 50 });

  const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  // Header section with profile picture and basic info
  const startY = 50;

  // Profile picture
  if (userData.userId.profilePicture) {
    doc.image(`uploads/${userData.userId.profilePicture}`, 50, startY, {
      width: 80,
      height: 80,
    });
  }

  // Name and contact info
  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#2c3e50")
    .text(userData.userId.name, 150, startY + 10);

  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor("#34495e")
    .text(`Email: ${userData.userId.email}`, 150, startY + 45)
    .text(`Username: @${userData.userId.username}`, 150, startY + 60);

  // Horizontal line separator
  doc
    .moveTo(50, startY + 100)
    .lineTo(550, startY + 100)
    .strokeColor("#bdc3c7")
    .stroke();

  let currentY = startY + 120;

  // Professional Summary / Bio section
  if (userData.bio) {
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Professional Summary", 50, currentY);

    currentY += 25;

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#2c3e50")
      .text(userData.bio, 50, currentY, {
        width: 500,
        align: "justify",
      });

    currentY += doc.heightOfString(userData.bio, { width: 500 }) + 20;
  }

  // Current Position section
  if (userData.currentPosition) {
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Current Position", 50, currentY);

    currentY += 25;

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#27ae60")
      .text(userData.currentPosition, 50, currentY);

    currentY += 30;
  }

  // Work Experience section
  if (userData.pastWork && userData.pastWork.length > 0) {
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Work Experience", 50, currentY);

    currentY += 25;

    userData.pastWork.forEach((work, index) => {
      // Company name and position
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#2980b9")
        .text(work.position, 50, currentY);

      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#7f8c8d")
        .text(`at ${work.company}`, 50, currentY + 15);

      // Years
      doc
        .fontSize(11)
        .font("Helvetica-Oblique")
        .fillColor("#95a5a6")
        .text(work.years, 50, currentY + 30);

      currentY += 55;

      // Add some spacing between work experiences
      if (index < userData.pastWork.length - 1) {
        doc
          .moveTo(50, currentY - 10)
          .lineTo(200, currentY - 10)
          .strokeColor("#ecf0f1")
          .stroke();
        currentY += 10;
      }
    });
  }

  // Footer
  const pageHeight = doc.page.height;
  doc
    .fontSize(8)
    .font("Helvetica-Oblique")
    .fillColor("#bdc3c7")
    .text("Generated via Professional Resume Builder", 50, pageHeight - 50, {
      width: 500,
      align: "center",
    });

  doc.end();

  return outputPath;
};

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.status(200).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });

    return res.status(200).json({ token: token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    // Save only the filename, not the full path
    // req.file.path is 'uploads/filename.jpg', we need just 'filename.jpg'
    req.user.profilePicture = req.file.filename;
    await req.user.save();

    return res
      .status(200)
      .json({ 
        success: true, 
        message: "Profile picture uploaded successfully",
        profilePicture: req.file.filename
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const newUserData = req.body;
    const { username, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Username or email already in use" });
    }

    Object.assign(req.user, newUserData);
    await req.user.save();

    return res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email username profilePicture"
    );

    return res.status(200).json({ success: true, data: userProfile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const newProfileData = req.body;

    const userProfile = await Profile.findOne({ userId: req.user._id });

    if (!userProfile) {
      return res.status(404).json({ success: false, message: "Profile Not Found" });
    }

    Object.assign(userProfile, newProfileData);
    await userProfile.save();

    return res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    let { page, pageSize, keyword } = req.query;
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 50;

    const pipeline = [];

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userId",
      },
    });

    pipeline.push({
      $unwind: "$userId",
    });

    if (keyword && keyword.trim()) {
      const searchRegex = { $regex: keyword.trim(), $options: "i" };
      pipeline.push({
        $match: {
          $or: [
            { "userId.name": searchRegex },
            { "userId.username": searchRegex },
            { "userId.email": searchRegex },
            { bio: searchRegex },
            { currentPosition: searchRegex },
          ],
        },
      });
    }

    pipeline.push({
      $facet: {
        metadata: [{ $count: "totalCount" }],
        data: [
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
          {
            $project: {
              bio: 1,
              currentPosition: 1,
              pastWork: 1,
              skills: 1,
              education: 1,
              "userId._id": 1,
              "userId.name": 1,
              "userId.email": 1,
              "userId.username": 1,
              "userId.profilePicture": 1,
            },
          },
        ],
      },
    });

    const profiles = await Profile.aggregate(pipeline);

    const totalCount =
      profiles[0].metadata.length > 0 ? profiles[0].metadata[0].totalCount : 0;
    
    const lastPage = Math.ceil(totalCount / pageSize);

    return res.status(200).json({
      success: true,
      profiles: {
        metadata: { 
          totalCount, 
          page, 
          pageSize, 
          lastPage,
          keyword: keyword || "" 
        },
        data: profiles[0].data,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name email username profilePicture"
    );

    if (!userProfile) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    let outputPath = await convertUserDataToPdf(userProfile);

    return res.status(200).json({ success: true, data: outputPath });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.body;

    const connectionUser = await User.findById(connectionId);

    if (!connectionUser) {
      return res.status(404).json({ success: false, message: "Connection User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: req.user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Connection request already sent" });
    }

    const newRequest = new ConnectionRequest({
      userId: req.user._id,
      connectionId: connectionUser._id,
    });

    await newRequest.save();

    return res
      .status(200)
      .json({ success: true, message: "Connection request sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getConnectionRequests = async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      userId: req.user._id,
    }).populate("connectionId", "name username email profilePicture");

    if (!connections) {
      return res.status(404).json({ success: false, message: "no connection found" });
    }

    return res.status(200).json({ success: true, data: connections });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const myConnection = async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      connectionId: req.user._id,
    }).populate("userId", "name username email profilePicture"); 

    if (!connections) {
      return res.status(404).json({ success: false, message: "no connection found" });
    }

    return res.status(200).json({ success: true, data: connections });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId, accept_type } = req.body;

    const connectionRequest = await ConnectionRequest.findById(requestId);

    if (!connectionRequest) {
      return res.status(404).json({ success: false, message: "Connection request not found" });
    }

    if (accept_type === "accept") {
      connectionRequest.status = true;
    } else if (accept_type === "reject") {
      connectionRequest.status = false;
    } else {
      return res.status(400).json({ success: false, message: "Invalid accept_type" });
    }

    await connectionRequest.save();

    return res
      .status(200)
      .json({ success: true, message: "Connection request updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Handle Google OAuth login
 * Verifies Google token, creates user if doesn't exist, and returns JWT token
 */
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ 
        success: false, 
        message: "Google credential is required" 
      });
    }

    // Verify Google token
    const googleUserData = await verifyGoogleToken(credential);

    if (!googleUserData.emailVerified) {
      return res.status(400).json({ 
        success: false, 
        message: "Email not verified by Google" 
      });
    }

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: googleUserData.email },
        { googleId: googleUserData.googleId }
      ]
    });

    if (user) {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleUserData.googleId;
        user.authProvider = 'google';
      }
      
      // Update profile picture if Google provides one and user has default
      if (googleUserData.picture && user.profilePicture === 'default.png') {
        user.profilePicture = googleUserData.picture;
      }
    } else {
      // Create new user
      const username = googleUserData.email.split('@')[0] + '_' + crypto.randomBytes(4).toString('hex');
      
      user = new User({
        name: googleUserData.name,
        username: username,
        email: googleUserData.email,
        googleId: googleUserData.googleId,
        authProvider: 'google',
        profilePicture: googleUserData.picture || 'default.png',
        password: crypto.randomBytes(32).toString('hex'), // Random password for Google users
      });

      await user.save();

      // Create associated profile
      const profile = new Profile({ userId: user._id });
      await profile.save();
    }

    // Generate session token
    const token = crypto.randomBytes(32).toString('hex');
    user.token = token;
    await user.save();

    return res.status(200).json({ 
      success: true, 
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
      }
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
