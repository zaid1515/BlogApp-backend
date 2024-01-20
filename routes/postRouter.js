const express = require('express');
const { allPost, createPost, singlePost, updatePost, deletePost } = require('../controllers/posts');
const { authenticateToken } = require('../middlewares/auth');
const postRouter = express.Router();

postRouter.route('/')
  .get(allPost)
  .post(authenticateToken, createPost);

postRouter.route('/:postId')
  .get(singlePost)
  .patch(authenticateToken, updatePost)
  .delete(authenticateToken, deletePost);

module.exports = postRouter;
