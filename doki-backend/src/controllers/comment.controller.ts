import { type NextFunction, type Request, type Response } from "express";
import { taskIdParamSchema } from "../schemas/task.schema";
import { createCommentSchema } from "../schemas/comment.schema";
import { createComment, getComments } from "../services/comment.service";
import { AccessTokenPayload } from "../lib/token";

export async function handleCreateComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.user as AccessTokenPayload;
    const { taskId } = taskIdParamSchema.parse(req.params);
    const payload = createCommentSchema.parse(req.body);

    const newComment = await createComment(userId, taskId, payload);

    res.status(201).json({
      success: true,
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetComments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { taskId } = taskIdParamSchema.parse(req.params);

    const comments = await getComments(taskId);

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
}
