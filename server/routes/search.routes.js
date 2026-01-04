import express from "express";
import { searchWebsites } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/search", searchWebsites);

export default router;