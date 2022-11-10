const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers/usersController');

// GET and CREATE User
router
    .route('/')
    .get(getUsers)
    .post(createUser);

// GET, UPDATE, DELETE User
router
  .route('/:userId')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

// ADD or DELETE as Friend from User
router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);



module.exports = router;