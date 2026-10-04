import { Router, type IRouter } from "express";
import healthRouter from "./health";
import writingRouter from "./writing";

const router: IRouter = Router();

router.use(healthRouter);
router.use(writingRouter);

export default router;
