import { CreateBoardInput } from "@/schemas/board.schema";
import { CreateListInput } from "@/schemas/list.schema";
import { CreateTaskInput } from "@/schemas/task.schema";
import { boardService } from "@/services/board.service";
import { listService } from "@/services/list.service";
import { taskService } from "@/services/task.service";
import { Board, Task } from "@/types";
import { AxiosError } from "axios";
import { create } from "zustand";

interface BoardState {
  // state
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;

  // actions
  fetchBoards: (workspaceId: string) => Promise<void>;
  createBoard: (
    workspaceId: string,
    payload: CreateBoardInput,
  ) => Promise<void>;

  fetchBoardById: (id: string) => Promise<void>;
  createList: (boardId: string, payload: CreateListInput) => Promise<void>;
  createTask: (listId: string, payload: CreateTaskInput) => Promise<void>;

  // local actions
  moveListLocally: (payload: { listId: string; newOrderIndex: string }) => void;
  moveTaskLocally: (payload: {
    taskId: string;
    targetListId: string;
    newOrderIndex: string;
  }) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  currentBoard: null,
  isLoading: true,
  error: null,

  fetchBoards: async (workspaceId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await boardService.getBoards(workspaceId);
      const boardsData = Array.isArray(response.data)
        ? response.data
        : response.data?.boards || [];

      set({ isLoading: false, boards: boardsData });
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Failed to fetch boards";
      set({ error: message, isLoading: false });
    }
  },

  createBoard: async (workspaceId, payload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await boardService.createBoard(workspaceId, payload);
      set((state) => ({
        isLoading: false,
        boards: [...state.boards, response.data],
      }));
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Failed to create board";
      set({ error: message, isLoading: false });
    }
  },

  fetchBoardById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await boardService.getBoardById(id);
      set({ currentBoard: response.data, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Failed to fetch board";
      set({ error: message, isLoading: false });
    }
  },

  createList: async (boardId: string, payload: CreateListInput) => {
    try {
      set({ isLoading: true, error: null });
      const response = await listService.createList(boardId, payload);
      set((state) => {
        if (!state.currentBoard) return { isLoading: false };

        return {
          isLoading: false,
          currentBoard: {
            ...state.currentBoard,
            lists: [...(state.currentBoard.lists || []), response.data],
          },
        };
      });
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Failed to create list";
      set({ error: message, isLoading: false });
    }
  },

  createTask: async (listId, payload: CreateTaskInput) => {
    try {
      set({ isLoading: true, error: null });
      const response = await taskService.createTask(listId, payload);
      const newTask = response.data;

      set((state) => {
        if (!state.currentBoard) return { isLoading: false };

        const updatedLists = state.currentBoard.lists?.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              tasks: [...(list.tasks || []), newTask],
            };
          }

          return list;
        });

        return {
          isLoading: false,
          currentBoard: { ...state.currentBoard, lists: updatedLists },
        };
      });
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Failed to create task";
      set({ error: message, isLoading: false });
    }
  },

  moveListLocally: ({ listId, newOrderIndex }) => {
    set((state) => {
      if (!state.currentBoard || !state.currentBoard.lists) return state;

      const movedLists = state.currentBoard.lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            orderIndex: newOrderIndex,
          };
        }

        return list;
      });

      const sortedLists = [...movedLists].sort((a, b) =>
        a.orderIndex.localeCompare(b.orderIndex),
      );

      return { currentBoard: { ...state.currentBoard, lists: sortedLists } };
    });
  },

  moveTaskLocally: ({ taskId, targetListId, newOrderIndex }) => {
    set((state) => {
      if (!state.currentBoard || !state.currentBoard.lists) return state;

      let movedTask: Task | null = null;

      // 1. Cari task & buat array list baru tanpa task tersebut
      const listsWithoutTask = state.currentBoard.lists.map((list) => {
        const found = list.tasks?.find((t) => t.id === taskId);
        if (found) {
          // Buat salinan task dengan targetListId & newOrderIndex baru
          movedTask = {
            ...found,
            listId: targetListId,
            orderIndex: newOrderIndex,
          };
        }

        return {
          ...list,
          // Filter/hapus task ini dari list asalnya
          tasks: (list.tasks || []).filter((t) => t.id !== taskId),
        };
      });

      // Jika task tidak ditemukan di list manapun, batalkan
      if (!movedTask) return state;

      // 2. Masukkan movedTask ke list tujuan & urutkan (sort)
      const finalLists = listsWithoutTask.map((list) => {
        if (list.id === targetListId) {
          const newTasks = [...list.tasks, movedTask!].sort((a, b) =>
            a.orderIndex.localeCompare(b.orderIndex),
          );
          return { ...list, tasks: newTasks };
        }
        return list;
      });

      return {
        currentBoard: {
          ...state.currentBoard,
          lists: finalLists,
        },
      };
    });
  },
}));
