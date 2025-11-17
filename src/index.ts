import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as dynamoose from "dynamoose";
import { createClerkClient } from "@clerk/express";
// ROUTE IMPORTS
import courseRoutes from "./routes/courseRoutes";
import userClerkRoutes from "./routes/userClerkRoutes";

// CONFIGURATIONS
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dynamoose.aws.ddb.local();
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/courses", courseRoutes);
app.use("/users/clerk", userClerkRoutes);

// SERVER
const port = process.env.PORT || 3000;
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
