import { Router } from "express";
const router: Router = Router();
import cors from "cors";
import * as UserController from "../Controllers/UserController";

//create user
router.post("/", cors(), UserController.createUser);

//get user details
router.get("/:userName", cors(), UserController.getUser);

export default router;
