import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();

router.post("/create",auth(Role.TENANT), paymentController.createPayment)
router.post("/confirm", paymentController.confirmPayment)
router.get("/", auth(Role.TENANT), paymentController.getPaymentHistory)
router.get("/:id", auth(Role.TENANT), paymentController.getSinglePayment)

export const paymentRoutes = router;