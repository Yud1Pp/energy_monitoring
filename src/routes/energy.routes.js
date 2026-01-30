import express from "express";
import energyController from "../controllers/energy.controller.js";

const energyRouter = express.Router();

energyRouter.get("/realtime", energyController.getRealtimeAllPanels);
energyRouter.get("/:panelId/realtime", energyController.getRealtimeByPanel);
energyRouter.get("/:panelId/today", energyController.getTodayUsageByPanel);

export default energyRouter;
