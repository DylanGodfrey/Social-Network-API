const { User, Thought } = require('../models');

module.exports = {
    // GET all users
    getUsers(req, res) {
        User.find()
        .select('-__v')
        .then((users) => res.json(users))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err)
        }); 
    }, 
    // GET a single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        // Subdoc population to see inside
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No user found with that id' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // CREATE User
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },
  
    // UPDATE User
    updateUser(req, res) {
        User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
        )
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No user found with that id' })
            : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // DELETE User and associated thoughts
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No user found with that id' })
            : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: 'User and associated thoughts deleted' }))
        .catch((err) => res.status(500).json(err));
    },

    // Add a friend to User by id
    addFriend(req, res) {
        User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { runValidators: true, new: true }
        )
        .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that id' })
          : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Remove a friend from User
    removeFriend(req, res) {
        User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
        )
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No user found with that id' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
};