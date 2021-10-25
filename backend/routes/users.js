const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  userIdValidation,
  updateUserInfoValidation,
  updateAvatarValidation,
} = require('../middlewares/validation');

userRouter.get('/users', getUsers);

userRouter.get('/users/me', getUser);

userRouter.get('/users/:_id', userIdValidation, getUser);

userRouter.patch('/users/me', updateUserInfoValidation, updateProfile);

userRouter.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = userRouter;
