import { Router } from "express";
const router: Router = Router();
import cors from "cors";
import * as PostController from "../Controllers/PostController";

//create post
router.post("/", cors(), PostController.CreatePost);

//get all posts for a single user
router.get("/:userName", cors(), PostController.getAllUserPosts);

export default router;
