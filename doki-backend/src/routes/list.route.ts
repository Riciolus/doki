// Daftar Endpoint List yang Akan Dibuat:

//     PATCH /api/lists/:listId (OWNER / EDITOR)
//         Mengubah nama/title dari List.
//     PATCH /api/lists/:listId/reorder atau PATCH /api/boards/:boardId/lists/reorder (OWNER / EDITOR)
//         Mengubah urutan/posisi List (position).
//     DELETE /api/lists/:listId (OWNER / EDITOR)
//         Menghapus List (serta seluruh Task yang ada di dalamnya).

import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeListRole } from "../middlewares/rbac.middleware";
import { Role } from "../../generated/prisma/enums";
import {
  handleDeleteList,
  handleReorderList,
  handleUpdateList,
} from "../controllers/list.controller";

const router = Router();

router.use(authenticate);

router.patch(
  "/:listId",
  authorizeListRole([Role.OWNER, Role.EDITOR]),
  handleUpdateList,
);
router.patch(
  "/:listId/reorder",
  authorizeListRole([Role.OWNER, Role.EDITOR]),
  handleReorderList,
);
router.delete(
  "/:listId",
  authorizeListRole([Role.OWNER, Role.EDITOR]),
  handleDeleteList,
);

export default router;
