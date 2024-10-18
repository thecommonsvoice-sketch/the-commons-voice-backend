import express ,{Router} from "express";
import { createUser, getUsers } from "../controllers/userController.js";
const router:Router = express.Router();

router.get('/all',getUsers)

router.post('/create',createUser);

export default router;