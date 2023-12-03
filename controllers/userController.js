const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

/**
 * Filters an object based on the allowed fields.
 *
 * @param {object} obj - The object to be filtered.
 * @param {...string} allowedFields - The fields that are allowed to remain in the object.
 * @return {object} The filtered object.
 */
const filterObj = (obj, ...allowedFields) => {
  // Loop through each key in the object
  const newObj = {};
  // Check if the key is included in the allowedFields array
  Object.keys(obj).forEach((el) => {
    // If it is, add the key-value pair to the new object
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// TODO: Use factory methods instead of controller functions
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
