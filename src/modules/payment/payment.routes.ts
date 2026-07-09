import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();

router.post("/create",auth(Role.TENANT), paymentController.createPayment);

export const paymentRoutes = router;