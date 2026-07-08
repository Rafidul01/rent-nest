import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";
import { categoryController } from "./category.controller";

const router = Router();


router.post("/create",auth(Role.ADMIN),categoryController.createCategory)
router.get("/",categoryController.getAllCategories)


export const categoryRoutes = router;