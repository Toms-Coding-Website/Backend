import { Request, Response } from "express";
import codeBlockService from "../services/codeBlock.service";

const getAllCodeBlocks = async (req: Request, res: Response) => {
  try {
    const codeBlocks = await codeBlockService.getAllCodeBlocks();
    return res.json(codeBlocks);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "error in getAllCodeBlocks " + error.message });
  }
};

const getCodeBlockById = async (req: Request, res: Response) => {
  try {
    const codeBlock = await codeBlockService.getCodeBlockById(req.params.id);
    if (codeBlock) return res.json(codeBlock);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "error in getCodeBlockById " + error.message });
  }
};

export default {
  getAllCodeBlocks,
  getCodeBlockById,
};
