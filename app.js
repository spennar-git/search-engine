import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import searchRoutes from "./server/routes/search.routes.js";
import adminRoutes from "./server/routes/admin.routes.js";
import authRoutes from "./server/routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);

// ROUTES
app.use("/api", searchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// HEALTH CHECK (IMPORTANT)
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

export default app;