const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
// Profile model
const Profile = require("../../models/Profile");
// Post model
const Post = require("../../models/Post");
// Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests the posts route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts works!" }));

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ postsnotfound: "No posts were found" }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ postnotfound: "No post found with that id" }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });
  newPost.save().then(post => res.json(post));
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // Check for post owner because we only want th owner to be able to delete a post.
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized to delete that post" });
        }
        // Delete. Make sure post is lowercase post and not uppercase Post otherwise it delete everything in the Post model.
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  });
});

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post("/like/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if user has already liked the post
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
          return res.status(400).json({ alreadyliked: "User already liked this post" });
        }
        // Add user id to beginning of the likes array
        post.likes.unshift({ user: req.user.id });
        // Save to DB
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  });
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post("/unlike/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if user has liked the post
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
          return res.status(400).json({ notliked: "You have not yet liked this post" });
        }
        // Get index of user we want to remove from likes array
        const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

        // Splice out of array
        post.likes.splice(removeIndex, 1);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  });
});

module.exports = router;
