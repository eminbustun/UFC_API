const ErrorResponse = require("../error/error-response");
const User = require("../models/User");

//* Get All Users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users || users.length == 0) {
      return next(new ErrorResponse("No fighters are found.", 400));
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(new ErrorResponse("An error occured while getting users.", 400));
  }
};

//* Get single user
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse("No user is found with this id.", 400));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(new ErrorResponse("An error occured while getting a user.", 400));
  }
};

//* Create user
exports.addUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(new ErrorResponse("An error occured while adding a user.", 400));
  }
};

//* Update user
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new ErrorResponse("No user is found with this id.", 400));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(new ErrorResponse("An error occured while updating a user.", 400));
  }
};

//* Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new ErrorResponse("No user is found with this id."), 400);
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(new ErrorResponse("An error occured while deleting a user.", 400));
  }
};
