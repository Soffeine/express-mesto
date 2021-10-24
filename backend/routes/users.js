const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get('/users/:_id', getUser);

userRouter.get('/users/me', getUser);

userRouter.patch('/users/me', updateProfile);

userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
