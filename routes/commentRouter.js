const express = require('express');

const { authenticateToken } = require('../middlewares/auth');
const { allComments, createComment, showComment, updateComment, deleteComment } = require('../controllers/comments');
const commentRouter = express.Router();

commentRouter.route('/')
  .get(allComments)
  .post(createComment);

commentRouter.route('/:id')
  .get(showComment)
  .patch(updateComment)
  .delete(deleteComment);

module.exports = commentRouter;
