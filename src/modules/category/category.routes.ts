import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";
import { categoryController } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";

const router = Router();


router.post("/create",auth(Role.ADMIN),validateRequest(categoryValidation.createValidationSchema),categoryController.createCategory)
router.get("/",categoryController.getAllCategories)


export const categoryRoutes = router;