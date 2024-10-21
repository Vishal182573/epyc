import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoute from "./routes/uploadRoutes.ts"
import fileshare from "./routes/fileshareRoutes.ts"
import connectDB from "./config/mongodb.ts"

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Replace with your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

// Routes
app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

app.use("/api", uploadRoute);
app.use("/api/file-share", fileshare);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});