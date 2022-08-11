import { Request, Response } from "express";
import User from "../Models/User";
import { Iuser } from "../Interfaces/Iuser";

/**
 * Function to save verified user to Database
 * @param data
 */
const saveUser = async (data: Iuser) => {
  try {
    const user = new User({ ...data });
    const savedUser = await user.save();

    return savedUser;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new user
 * @param req
 * @param res
 */
export const createUser = async (req: Request, res: Response) => {
  //check for duplicate User in database
  try {
    const isUsernameAvailable = await User.findOne({
      username: req.body.username,
    });
    if (isUsernameAvailable) {
      res.status(404).json({
        message: `Please select a different username, that one is already taken`,
      });
    } else {
      //Save User to database
      const newUser = await saveUser(req.body);
      if (newUser) {
        res.status(201).json({ newUser });
      } else {
        res.status(400).json({
          message: "There was an error, failed to save User to the database.",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "An unknown error occured",
    });
  }
};

/**
 * Find User by username
 * @param req
 * @param res
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const userName: string = req.params.userName;
    const userDetails = await User.findOne({
      username: userName,
    }).select("_id username firstname surname createdAt updatedAt");
    if (!userDetails) {
      res.status(404).json({
        message: `Sorry, That user is not registered`,
      });
    } else {
      res.status(200).json(userDetails);
    }
  } catch (error) {
    res.status(400).json({
      message: "An unknown error occured",
    });
  }
};
