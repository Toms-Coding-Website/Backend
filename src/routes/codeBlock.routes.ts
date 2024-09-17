import { Router } from "express";
import codeBlockController from "../controllers/codeBlock.controller";
const codeBlockRouter: Router = Router();

codeBlockRouter.get("/", codeBlockController.getAllCodeBlocks);
codeBlockRouter.get("/:id", codeBlockController.getCodeBlockById);
export default codeBlockRouter;
