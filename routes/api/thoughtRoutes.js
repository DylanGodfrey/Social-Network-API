const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtsController');

// GET and CREATE Thoughts
router
    .route('/')
    .get(getThoughts)
    .post(createThought);

// GET, UPDATE, DELETE Thought
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

// CREATE Reaction on ThoughtID
router
    .route('/:thoughtId/reactions')
    .post(addReaction);

// DELETE Reaction on ThoughtID
router
    .route('/:thoughtId/:reactionId')
    .delete(removeReaction);

module.exports = router;