import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";
import { landlordController } from "./landload.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { landlordValidation } from "./landload.validation";

const route = Router();

route.post("/properties",auth(Role.LANDLORD), validateRequest(landlordValidation.createPropertyValidationSchema) ,landlordController.createProperty)
route.put("/properties/:id",auth(Role.LANDLORD), validateRequest(landlordValidation.updatePropertyValidationSchema), landlordController.updateProperty)
route.delete("/properties/:id",auth(Role.LANDLORD), landlordController.deleteProperty)
route.get("/requests", auth(Role.LANDLORD), landlordController.getRentalRequests)
route.patch("/requests/:id", auth(Role.LANDLORD), validateRequest(landlordValidation.statusUpdateValidationSchema), landlordController.updateRentalRequest)

export const landlordRoutes = route