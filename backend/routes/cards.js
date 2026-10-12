const router = require('express').Router();

const { createCardValidator } = require('../middlewares/cardValidator');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCardValidator, createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', addLike);

router.delete('/:cardId/likes', deleteLike);

module.exports = router;
