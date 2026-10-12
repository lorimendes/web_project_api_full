const jwt = require('jsonwebtoken');

// verificar o token do cabeçalho
const authenticateToken = (req, res, next) => {
  const { authorization } = req.headers;

  const error = new Error('Token inválido ou expirado');
  error.name = 'InvalidToken';

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw error;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      process.env.NODE_ENV === 'production'
        ? process.env.JWT_SECRET
        : 'dev-secret',
    );
  } catch (err) {
    throw error;
  }

  req.user = payload;

  next();
};

module.exports = { authenticateToken };
