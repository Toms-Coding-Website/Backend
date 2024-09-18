import CodeBlockService from "../models/CodeBlock.model";

const getAllCodeBlocks = async () => {
  try {
    return await CodeBlockService.find();
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

const getCodeBlockById = async (id: string) => {
  if (!id) throw new Error("CodeBlock ID is required");
  try {
    const codeBlock = await CodeBlockService.findById(id);
    if (codeBlock) return codeBlock;
    throw new Error("CodeBlock not found");
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export default {
  getAllCodeBlocks,
  getCodeBlockById,
};
