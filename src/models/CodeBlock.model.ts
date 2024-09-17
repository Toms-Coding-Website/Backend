import mongoose, { Document } from "mongoose";

export interface ICodeBlock extends Document {
  title: string;
  description: string;
  hint: string;
  solution: string;
}

const CodeBlockSchema = new mongoose.Schema<ICodeBlock>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  hint: { type: String, required: true },
  solution: { type: String, required: true },
});

const CodeBlock = mongoose.model<ICodeBlock>("codeblock", CodeBlockSchema, "codeblocks");
export default CodeBlock;
