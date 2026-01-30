import express from "express";
import energyRouter from "./routes/energy.routes.js";
import summaryRouter from "./routes/summary.routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/energy", energyRouter);
app.use("/api/v1/summary", summaryRouter);

export default app;
