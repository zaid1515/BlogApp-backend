// in mongoose we can validate at the time of schema creation in the schema file
// in sequelize we can do that in the model file created after the command in terminal
// fatest-validator can be used in both context

const Validator = require('fastest-validator')
const models = require('../models');
const { Post } = require('../models');

const allPost = async (req, res) => {
     try {
          const posts = await Post.findAll();
          res.status(200).json({ success: true, posts: posts })
     } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, msg: error });
     }
};

const createPost = async (req, res) => {
     try {
          const newPost = {
               title: req.body.title,
               content: req.body.content,
               imageUrl: req.body.image_url,
               categoryId: req.body.category_id,
               userId: 1,
          };

          const schema = {
               /* title: {
                    type: Sequelize.STRING,
                    validate: {
                         notNull: {
                         msg: 'Title is required',
                         },
                         len: {
                              args: [1, 100],
                              msg: 'Title should be between 1 and 100 characters',
                         },
                    },
               }, this can be done in migration file if want to */
               title: { type: "string", optional: false, max: "100" },
               content: { type: "string", optional: false, max: "500" },
               categoryId: { type: "number", optional: false }

          }

          // we need to create instance of the Validator
          const v = new Validator();
          const validationResponse = v.validate(newPost, schema)

          if (validationResponse !== true) {
               res.status(400).json({ msg: "Validation failed", errors: validationResponse })
          }
          else {
               //const result = await models.Post.create(newPost);
               const result = await Post.create(newPost);
               res.status(200).json({ msg: "Post created successfully", post: result });
          }

     } catch (error) {
          console.error(error);
          res.status(500).json({ msg: error.message || "Internal Server Error" });
     }
};

const singlePost = async (req, res) => {
     try {
          const postId = req.params.postId;
          // for getting a single object with its primary , findByPk method is used.

          // we are avoiding the use of promises as below and using async await for better handling
          /*
          models.Post.findByPk(postId).then((result) => {
               res.status(200).json({ success: true, post: result })
          }).catch((err) => {
               res.status(500).json({ success: false, msg: err });
          });
          */
          console.log(postId);
          const post = await models.Post.findByPk(postId);
          console.log(post);

          if (!post) {
               res.status(404).json({ success: false, msg: `No post with id: ${postId}` })
          }
          else {
               res.status(200).json({ success: true, post: post });
          }

     } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, msg: error.message });
     }
};

const updatePost = async (req, res) => {
     try {
          const postId = req.params.postId;
          const currPost=await Post.findByPk(postId);

          const post = {
               title: req.body.title||currPost.title,
               content: req.body.content||currPost.content,
               imageUrl: req.body.image_url||currPost.imageUrl,
               categoryId: req.body.category_id||currPost.categoryId,
          }
          const userId = 1;
          // Model.update(
          // Data to be updated
          // { /* updated fields/values */ },

          // Options (e.g., where condition)
          // {
          // where: { /* condition to identify the records to be updated */ },
          /* other options, if applicable */
          // }
          // )
          console.log(postId);
          console.log(post);
          if (!postId) {
               res.status(404).json({ success: false, msg: `No post with id: ${postId}` })
          }
          else {
               const schema = {
                    title: { type: "string", optional: false, max: "100" },
                    content: { type: "string", optional: false, max: "500" },
                    categoryId: { type: "number", optional: false }
               }
               const v = new Validator();
               const validationResponse = v.validate(post, schema)

               if (validationResponse !== true) {
                    res.status(400).json({ msg: "Validation failed", errors: validationResponse })
               }
               else {
                    const updateResult = await Post.update(post, { where: { id: postId, userId: userId } })
                    console.log(updateResult);
                    // update returns a boolean.

                    const updatedPost = await Post.findByPk(postId)
                    res.status(200).json({ msg: "Post updated successfully", updatedPost: updatedPost })
               }
          }

     } catch (error) {
          console.log(error);
          res.status(500).json({ success: false, msg: error.message })
     }
}

const deletePost = async (req, res) => {
     try {
          const postId = req.params.postId
          const userId = 1
          if (!postId) {
               res.status(404).json({ success: false, msg: `No post with id: ${postId}` })
          }
          else {
               const deletedPost = await Post.destroy({ where: { id: postId, userId: userId } })
               res.status(200).json({ success: true, msg: "Post Deleted Successfully" })
          }
     } catch (e) {
          console.log(error);
          res.status(500).json({ success: false, msg: error.message })
     }
}
module.exports = { allPost, createPost, singlePost, updatePost, deletePost };
