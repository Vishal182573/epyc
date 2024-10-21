// server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoute from "./routes/uploadRoutes.ts"
import fileshare from "./routes/fileshareRoutes.ts"
import connectDB from "./config/mongodb.ts"

connectDB();
dotenv.config();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors()); 

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});
app.use("/api",uploadRoute)
app.use("/api/file-share",fileshare)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});