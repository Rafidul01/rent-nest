import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/browser";

const router = Router();

router.post("/",auth(Role.TENANT), rentalController.createRentalRequest)
router.get("/",auth(Role.TENANT), rentalController.getRentalRequests)

export const rentalRoutes = router;
