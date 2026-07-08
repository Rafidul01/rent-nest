import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";
import { landlordController } from "./landload.controller";

const route = Router();

route.post("/properties",auth(Role.LANDLORD), landlordController.createProperty)
route.put("/properties/:id",auth(Role.LANDLORD), landlordController.updateProperty)

export const landlordRoutes = route