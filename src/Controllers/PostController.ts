import { Request, Response } from "express";
import User from "../Models/User";
import { Ipost } from "../Interfaces/Ipost";

/**
 * Create a new post and save it to the database
 * @param req
 * @param res
 */
export const CreatePost = async (req: Request, res: Response) => {
  try {
    const toSave: Ipost = {
      title: req.body.title,
      description: req.body.description,
    };
    const userName: string = req.body.username;
    const createdPost = await User.findOneAndUpdate(
      { username: userName },
      { $push: { posts: toSave } }
    );
    if ({ createdPost }) {
      res.status(201).json({ createdPost });
    } else {
      res.status(400).json({
        message: "User not found. Please create the user first",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An unknown error occured",
    });
  }
};

/**
 * Get all posts associated with a single user
 * @param req
 * @param res
 */
export const getAllUserPosts = async (req: Request, res: Response) => {
  try {
    const allPosts = await User.findOne({ username: req.params.userName })
      .select("_id username firstname surname")
      .populate("posts", "title description");

    if ({ allPosts }) {
      res.status(200).json({ allPosts });
    } else {
      res.status(404).json({
        message: "Not found.",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An unknown error occured",
    });
  }
};
