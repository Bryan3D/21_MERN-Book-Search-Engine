const router = require('express').Router();
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require('../../controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user
router.post('/', createUser);
router.put('/', authMiddleware, saveBook);

router.post('/login', login);

router.get('/me', authMiddleware, getSingleUser);

router.delete('/books/:bookId', authMiddleware, deleteBook);

module.exports = router;

