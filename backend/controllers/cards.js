const Card = require('../models/card');

const getCards = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const cards = await Card.find({ owner: _id }).sort({ createdAt: -1 });
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await Card.create({ name, link, owner });
    res.status(201).send(newCard);
  } catch (err) {
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  try {
    const card = await Card.findById(cardId).orFail();

    if (card.owner.toString() !== _id) {
      const error = new Error('Usuário não autorizado');
      error.name = 'AuthorizationError';
      throw error;
    }

    await card.deleteOne();

    res.status(200).send(card);
  } catch (err) {
    next(err);
  }
};

const addLike = async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { returnDocument: 'after', runValidators: true },
    ).orFail();
    res.status(200).send(updatedCard);
  } catch (err) {
    next(err);
  }
};

const deleteLike = async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { returnDocument: 'after', runValidators: true },
    ).orFail();
    res.status(200).send(updatedCard);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
