const Validator = require('fastest-validator');
const models = require('../models');

const createComment = async (req, res) => {
     try {
          const comment = {
               content: req.body.content,
               postId: req.body.post_id,
               userId: req.user.userId
          };

          const schema = {
               content: { type: "string", optional: false, max: "500" },
               postId: { type: "number", optional: false }
          };

          const v = new Validator();
          const validationResponse = v.validate(comment, schema);

          if (validationResponse !== true) {
               return res.status(400).json({
                    message: "Validation failed",
                    errors: validationResponse
               });
          }

          else {
               const post = await models.Post.findByPk(req.body.post_id);
               if (!post) {
                    return res.status(404).json({
                         message: "Post not found"
                    });
               }

               else {
                    const result = await models.Comment.create(comment);
                    res.status(201).json({
                         message: "Comment created successfully",
                         comment: result
                    });
               }
          }
     } catch (error) {
          console.error(error);
          res.status(500).json({
               message: "Something went wrong",
               error: error.message || "Internal Server Error"
          });
     }
};

const showComment = async (req, res) => {
     try {
          const id = req.params.id;
          const comment = await models.Comment.findByPk(id);

          if (comment) {
               res.status(200).json(comment);
          } else {
               res.status(404).json({
                    message: "Comment not found!"
               });
          }
     } catch (error) {
          console.error(error);
          res.status(500).json({
               message: "Something went wrong!"
          });
     }
};

const allComments = async (req, res) => {
     try {
          const comments = await models.Comment.findAll();
          res.status(200).json({ success: true, comments: comments });

     } catch (error) {
          console.error(error);
          res.status(500).json({
               message: "Something went wrong!"
          });
     }
};

const updateComment = async (req, res) => {
     try {
          const id = req.params.id;
          const updatedComment = {
               content: req.body.content
          };

          const userId = req.user.userId;

          const schema = {
               content: { type: "string", optional: false, max: "500" },
          };

          const v = new Validator();
          const validationResponse = v.validate(updatedComment, schema);

          if (validationResponse !== true) {
               return res.status(400).json({
                    message: "Validation failed",
                    errors: validationResponse
               });
          }

          else {
               const updateResult = await models.Comment.update(updatedComment, { where: { id: id, userId: userId } });
               const updatedComment = await models.Comment.findByPk(id);

               res.status(200).json({
                    message: "Comment updated successfully",
                    comment: updatedComment
               });
          }
     } catch (error) {
          console.error(error);
          res.status(500).json({
               message: "Something went wrong",
               error: error.message || "Internal Server Error"
          });
     }
};

const deleteComment = async (req, res) => {
     try {
          const id = req.params.id;
          const userId = 1;

          const result = await models.Comment.destroy({ where: { id: id, userId: userId } });

          if (result) {
               res.status(200).json({
                    message: "Comment deleted successfully"
               });
          } else {
               res.status(404).json({
                    message: "Comment not found"
               });
          }
     } catch (error) {
          console.error(error);
          res.status(500).json({
               message: "Something went wrong",
               error: error.message || "Internal Server Error"
          });
     }
};

module.exports = {createComment,updateComment,deleteComment,allComments,showComment};
