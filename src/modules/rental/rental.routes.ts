import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/browser";
import { validateRequest } from "../../middlewares/validateRequest";
import { rentalValidation } from "./rental.validation";

const router = Router();

router.post("/",auth(Role.TENANT),validateRequest(rentalValidation.createRentalValidationSchema), rentalController.createRentalRequest)
router.get("/",auth(Role.TENANT), rentalController.getRentalRequests)
router.get("/:id",auth(Role.TENANT), rentalController.getSingleRentalRequest)

export const rentalRoutes = router;
