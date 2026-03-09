export interface Category {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  isArchived: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  categories: Category[];
}

export interface CreateNoteDto {
  title: string;
  content: string;
  category?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  isArchived?: boolean;
}

export interface Category {
  id: number;
  name: string;
}
