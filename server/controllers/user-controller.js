const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {
  async getSingleUser(req, res) {
    const { user = null, params } = req;
    const foundUser = await User.findOne({
      $or: [{ _id: user?.id ?? params.id }, { username: params.username }],
    });

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }

    res.json(foundUser);
  },
//  Create a user using the `User` model's `create` method  -- an example of a mutation method 
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      const token = signToken(user);
      res.json({ token, user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Something went wrong!' });
    }
  },

  // Login a user using the `User` model's `findOne` method and `correctPassword` instance method -- an example of a mutation method

  async login(req, res) {
    const { body } = req;
    try {
      const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });

      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        return res.status(400).json({ message: 'Wrong password!' });
      }
// If the user is found and the password is correct, sign a token and send it back to the client
// If there's an error with the password, respond with an error message
      const token = signToken(user);
      res.json({ token, user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Something went wrong!' });
    }
  },

  // Add a book to `savedBooks` for a logged in user and returns the updated user -- an example of a mutation method 
  async saveBook(req, res) {
    const { user, body } = req;
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Something went wrong!' });
    }
  },
//  Delete a book from `savedBooks`
  async deleteBook(req, res) {
    const { user, params } = req;
    try {

// Find the logged in user and update `savedBooks` by pulling the book with the matching `bookId` value from the array (the book's `_id` value, not the book's `bookId` value) -- an example of a mutation method
      
      const updatedUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );

// Update the user's `savedBooks` field by pulling the book with the matching `bookId` value from the array (the book's `_id` value, not the book's `bookId` value)
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Couldn't find user with this id!" });
      }

// If no user is found, send a 404 error back to the client and return from the function  below is an example of a query method that returns a single document  -- an example of a query method that returns a single document 
      
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Something went wrong!' });
    }
  },
};
