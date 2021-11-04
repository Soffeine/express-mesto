const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  userIdValidation,
  updateUserInfoValidation,
  updateAvatarValidation,
} = require('../middlewares/validation');

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUser);

userRouter.get('/:_id', userIdValidation, getUser);

userRouter.patch('/me', updateUserInfoValidation, updateProfile);

userRouter.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = userRouter;
