const { Thought, User } = require('../models');

module.exports = {
    // GET all thoughts
    getThoughts(req, res) {
        Thought.find()
        .select('-__v')
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    // GET a thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No thought with that id' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // CREATE a thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: thought._id } },
            { new: true }
            );
        })
        .then((user) =>
            !user
            ? res.status(404).json({
                message: 'thought created, but found no user with that id',
            })
            : res.json('thought created')
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    // UPDATE a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No thought found with this id' })
            : res.json(thought)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    // DELETE a thought
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No thought found with this id' })
            : User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            )
        )
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'thought created, but found no user with that id' })
            : res.json({ message: 'Thought deleted' })
        )
        .catch((err) => res.status(500).json(err));
    },

    // REACTIONS

    // CREATE a reaction and add to thought by id
    addReaction(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No thought found with this id' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // DELETE a reaction
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No thought found with this id' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
};