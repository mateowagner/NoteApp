import type {
  Category,
  CreateNoteDto,
  Note,
  UpdateNoteDto,
} from "../types/note";

const BASE_URL = "http://localhost:3000/notes";
const CATEGORIES_URL = "http://localhost:3000/categories";

export const getNotes = async (
  isArchived = false,
  category?: string,
): Promise<Note[]> => {
  const params = new URLSearchParams();
  params.append("isArchived", String(isArchived));
  if (category) params.append("category", category);
  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  return res.json();
};

export const createNote = async (data: CreateNoteDto): Promise<Note> => {
  const body: Partial<CreateNoteDto> = {
    title: data.title,
    content: data.content,
  };

  if (data.category && data.category.trim()) {
    body.category = data.category.trim();
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const updateNote = async (
  id: number,
  data: UpdateNoteDto,
): Promise<Note> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteNote = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};

export const addCategoryToNote = async (
  noteId: number,
  categoryName: string,
): Promise<Note> => {
  const res = await fetch(`${BASE_URL}/${noteId}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: categoryName }),
  });
  return res.json();
};

export const removeCategoryFromNote = async (
  noteId: number,
  categoryId: number,
): Promise<Note> => {
  const res = await fetch(`${BASE_URL}/${noteId}/categories/${categoryId}`, {
    method: "DELETE",
  });
  return res.json();
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(CATEGORIES_URL);
  return res.json();
};
