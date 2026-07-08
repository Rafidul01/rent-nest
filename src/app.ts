import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import {authRoutes} from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandeler";
import { userRoutes } from "./modules/user/user.routes";
import { landlordRoutes } from "./modules/landlord/landload.route";
import { categoryRoutes } from "./modules/category/category.routes";
import { propertyRoutes } from "./modules/property/property.routes";


const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/landlord", landlordRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/properties", propertyRoutes)




app.use(globalErrorHandler)


export default app;