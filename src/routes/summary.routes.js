import express from "express";
import summaryController from "../controllers/summary.controller.js";

const router = express.Router();

router.get("/today", summaryController.getTodaySummary);
router.get("/monthly", summaryController.getMonthlySummary);

export default router;
