import { Router } from "express";
import { reviewController } from "./review.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewValidation } from "./review.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/browser";

const router = Router();

router.post("/",auth(Role.TENANT),validateRequest(reviewValidation.reviewValidationSchema) ,reviewController.createReview)
router.get("/", reviewController.getAllReviews)


export const reviewRoutes = router;