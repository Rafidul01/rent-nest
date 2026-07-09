import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { authValidation } from "./auth.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post("/login", validateRequest(authValidation.loginValidationSchema) ,authController.loginUser); 
router.post("/register", validateRequest(authValidation.registerValidationSchema), authController.registerUser)
router.get("/me",auth() , authController.getCurrentUser)

export const authRoutes = router;