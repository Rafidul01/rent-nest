import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";
import { adminController } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminValidation } from "./admin.validation";

const router = Router();

router.get("/users",auth(Role.ADMIN), adminController.getAllUsers)
router.patch("/users/:id",auth(Role.ADMIN), validateRequest(adminValidation.userUpdateValidationSchema), adminController.updateUser)


export const adminRoutes = router;