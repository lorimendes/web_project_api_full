const router = require('express').Router();
const {
  updateUserValidator,
  updateUserAvatarValidator,
} = require('../middlewares/userValidator');

const {
  getLoggedUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/me', getLoggedUser);

router.patch('/me', updateUserValidator, updateUser);

router.patch('/me/avatar', updateUserAvatarValidator, updateUserAvatar);

router.get('/:userId', getUserById);

module.exports = router;
