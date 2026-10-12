const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getLoggedUser = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).orFail();
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userFromId = await User.findById(req.params.userId).orFail();
    res.send(userFromId);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, //
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { returnDocument: 'after', runValidators: true },
    ).orFail();
    res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
};

const updateUserAvatar = async (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { returnDocument: 'after', runValidators: true },
    ).orFail();
    res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { _id } = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id },
      process.env.NODE_ENV === 'production'
        ? process.env.JWT_SECRET
        : 'dev-secret',
      {
        expiresIn: '7d',
      },
    );
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLoggedUser,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
};
