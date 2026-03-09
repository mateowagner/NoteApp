import { useEffect, useState } from "react";
import {
  addCategoryToNote,
  createNote,
  deleteNote,
  getCategories,
  getNotes,
  removeCategoryFromNote,
  updateNote,
} from "./services/noteService";
import type { Category, CreateNoteDto, Note } from "./types/note";
import CategorySelector from "./CategorySelector";

// Paleta de colores
const C = {
  bg: "#15202b",
  surface: "#1e2732",
  surfaceHov: "#253341",
  border: "#2f3e4e",
  borderHov: "#3d5468",
  textPrim: "#f7f9f9",
  textSec: "#8899a6",
  note: "#fef9c3",
  noteBorder: "#e9d84a",
  noteHov: "#fdf5a0",
  noteText: "#14171a",
  accent: "#1d9bf0",
  accentHov: "#1a8cd8",
  error: "#f4212e",
};

// Iconos SVG
const IconTrash = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const IconPencil = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconCheck = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconNote = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconArchive = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

// Componente ActionBtn
function ActionBtn({
  onClick,
  title,
  children,
  danger = false,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={title}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h
          ? danger
            ? "rgba(244,33,46,0.12)"
            : "rgba(20,23,26,0.12)"
          : "none",
        border: "none",
        cursor: "pointer",
        padding: 6,
        borderRadius: "50%",
        color: h && danger ? C.error : C.noteText,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

//CategoryFilter
function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", marginBottom: 28 }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          backgroundColor: selectedCategory ? C.accent : C.surface,
          color: selectedCategory ? "#fff" : C.textSec,
          border: `1px solid ${selectedCategory ? C.accent : C.border}`,
          borderRadius: 20,
          padding: "6px 16px",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {selectedCategory ? `Tag: ${selectedCategory}` : "Filtrar por tag"}
        <span style={{ fontSize: 10, opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
        {selectedCategory && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onSelect(selectedCategory);
            }}
            style={{ marginLeft: 2, opacity: 0.8, fontWeight: 700 }}
          >
            ×
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            zIndex: 50,
            minWidth: 180,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelect(cat.name);
                setOpen(false);
              }}
              style={{
                padding: "9px 16px",
                fontSize: 13,
                color: selectedCategory === cat.name ? C.accent : C.textPrim,
                cursor: "pointer",
                fontWeight: selectedCategory === cat.name ? 600 : 400,
                backgroundColor:
                  selectedCategory === cat.name
                    ? "rgba(29,155,240,0.08)"
                    : "transparent",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = C.surfaceHov)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedCategory === cat.name
                    ? "rgba(29,155,240,0.08)"
                    : "transparent")
              }
            >
              {cat.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

//NoteCard
function NoteCard({
  note,
  categories,
  selectedCategory,
  onArchive,
  onAddCategory,
  onRemoveCategory,
  onDelete,
  onEdit,
}: {
  note: Note;
  categories: Category[];
  selectedCategory: string | null;
  onArchive: () => void;
  onAddCategory: (category: string) => void;
  onRemoveCategory: (categoryId: number) => void;
  onDelete: () => void;
  onEdit: (title: string, content: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editError, setEditError] = useState<string | null>(null);

  const handleConfirmEdit = () => {
    if (!editTitle.trim()) {
      setEditError("El título no puede estar vacío.");
      return;
    }
    if (editTitle.trim().length > 30) {
      setEditError("El título no puede superar los 30 caracteres.");
      return;
    }
    if (!editContent.trim()) {
      setEditError("El contenido no puede estar vacío.");
      return;
    }
    setEditError(null);
    onEdit(editTitle, editContent);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditError(null);
    setEditing(false);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowSelector(false);
      }}
      style={{
        backgroundColor: hovered && !editing ? C.noteHov : C.note,
        borderRadius: 12,
        padding: "16px",
        width: 260,
        boxShadow: hovered
          ? "0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px #e9d84a"
          : "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px #d4c73a",
        transition: "all 0.2s ease",
        position: "relative",
        zIndex: hovered ? 10 : 1,
      }}
    >
      {/* Título */}
      {editing ? (
        <input
          value={editTitle}
          onChange={(e) => {
            setEditTitle(e.target.value);
            setEditError(null);
          }}
          style={{
            width: "100%",
            background: "rgba(20,23,26,0.08)",
            border: "none",
            borderRadius: 6,
            outline: "none",
            color: C.noteText,
            fontSize: 15,
            fontWeight: 700,
            padding: "4px 8px",
            marginBottom: 8,
            boxSizing: "border-box",
            caretColor: C.noteText,
            fontFamily: "inherit",
          }}
        />
      ) : (
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 15,
            fontWeight: 700,
            color: C.noteText,
            lineHeight: 1.3,
          }}
        >
          {note.title}
        </h3>
      )}

      {/* Contenido */}
      {editing ? (
        <textarea
          value={editContent}
          onChange={(e) => {
            setEditContent(e.target.value);
            setEditError(null);
          }}
          rows={3}
          style={{
            width: "100%",
            background: "rgba(20,23,26,0.08)",
            border: "none",
            borderRadius: 6,
            outline: "none",
            color: C.noteText,
            fontSize: 13,
            padding: "4px 8px",
            marginBottom: 8,
            boxSizing: "border-box",
            resize: "vertical",
            lineHeight: 1.5,
            caretColor: C.noteText,
            fontFamily: "inherit",
          }}
        />
      ) : (
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 13,
            color: "#3d4146",
            lineHeight: 1.6,
          }}
        >
          {note.content}
        </p>
      )}

      {/* Error edición */}
      {editError && (
        <p
          style={{
            color: "#c0392b",
            fontSize: 11,
            margin: "0 0 8px",
            fontWeight: 600,
          }}
        >
          ⚠️ {editError}
        </p>
      )}

      {/* Categorías */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}
      >
        {(note.categories ?? []).map((cat) => (
          <span
            key={cat.id}
            style={{
              backgroundColor:
                cat.name === selectedCategory
                  ? C.noteText
                  : "rgba(20,23,26,0.1)",
              color: cat.name === selectedCategory ? C.note : C.noteText,
              border: `1px solid ${cat.name === selectedCategory ? C.noteText : "rgba(20,23,26,0.2)"}`,
              borderRadius: 20,
              padding: "2px 10px",
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 4,
              letterSpacing: 0.2,
            }}
          >
            {cat.name}
            {hovered && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCategory(cat.id);
                }}
                style={{
                  cursor: "pointer",
                  fontSize: 11,
                  lineHeight: 1,
                  opacity: 0.5,
                  fontWeight: 700,
                }}
              >
                ×
              </span>
            )}
          </span>
        ))}
        {hovered && !showSelector && !editing && (
          <span
            onClick={() => setShowSelector(true)}
            style={{
              backgroundColor: "transparent",
              color: "#5a6472",
              border: "1px dashed #a0a8b0",
              borderRadius: 20,
              padding: "2px 10px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: 0.2,
            }}
          >
            + tag
          </span>
        )}
      </div>

      {showSelector && (
        <div style={{ marginBottom: 10 }}>
          <CategorySelector
            categories={categories}
            onSelect={(name) => {
              onAddCategory(name);
              setShowSelector(false);
            }}
          />
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: note.isArchived ? "#b08800" : "#7a8691",
            fontWeight: 500,
            letterSpacing: 0.3,
            textTransform: "uppercase",
          }}
        >
          {note.isArchived ? "Archivada" : "Activa"}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            opacity: hovered || editing ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        >
          {editing ? (
            <>
              <ActionBtn onClick={handleConfirmEdit} title="Guardar">
                <IconCheck />
              </ActionBtn>
              <ActionBtn onClick={handleCancelEdit} title="Cancelar">
                <IconX />
              </ActionBtn>
            </>
          ) : (
            <>
              <ActionBtn onClick={() => setEditing(true)} title="Editar">
                <IconPencil />
              </ActionBtn>
              <ActionBtn onClick={onDelete} title="Eliminar" danger>
                <IconTrash />
              </ActionBtn>
              <button
                onClick={() => onArchive()}
                style={{
                  backgroundColor: "rgba(20,23,26,0.1)",
                  color: C.noteText,
                  border: "1px solid rgba(20,23,26,0.2)",
                  borderRadius: 20,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <IconArchive />
                {note.isArchived ? "Desarchivar" : "Archivar"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

//Main
export default function NotesExample() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newNote, setNewNote] = useState<CreateNoteDto>({
    title: "",
    content: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formFocused, setFormFocused] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getNotes(showArchived, selectedCategory ?? undefined),
      getCategories(),
    ])
      .then(([notesData, categoriesData]) => {
        setNotes(notesData);
        setCategories(categoriesData);
      })
      .finally(() => setLoading(false));
  }, [showArchived, selectedCategory]);

  const toggleArchive = async (id: number, currentValue: boolean) => {
    await updateNote(id, { isArchived: !currentValue });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const addNote = async () => {
    if (!newNote.title.trim()) {
      setFormError("El título no puede estar vacío.");
      return;
    }
    if (newNote.title.trim().length > 30) {
      setFormError("El título no puede superar los 30 caracteres.");
      return;
    }
    if (!newNote.content.trim()) {
      setFormError("El contenido no puede estar vacío.");
      return;
    }
    setFormError(null);
    const created = await createNote(newNote);
    setNotes((prev) => [created, ...prev]);
    if (newNote.category) getCategories().then(setCategories);
    setNewNote({ title: "", content: "", category: "" });
    setFormFocused(false);
  };

  const handleAddCategory = async (noteId: number, categoryName: string) => {
    const updated = await addCategoryToNote(noteId, categoryName);
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
    getCategories().then(setCategories);
  };

  const handleRemoveCategory = async (noteId: number, categoryId: number) => {
    const updated = await removeCategoryFromNote(noteId, categoryId);
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
  };

  const handleDelete = async (id: number) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleEdit = async (id: number, title: string, content: string) => {
    const updated = await updateNote(id, { title, content });
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...updated, categories: n.categories } : n,
      ),
    );
  };

  if (loading)
    return (
      <div
        style={{
          backgroundColor: C.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              border: `3px solid ${C.border}`,
              borderTopColor: C.accent,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: C.textSec, fontSize: 14 }}>Cargando notas...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: C.bg,
        minHeight: "100vh",
        fontFamily: "'Georgia', serif",
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <header
        style={{
          backgroundColor: C.bg,
          borderBottom: `1px solid ${C.border}`,
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(12px)",
        }}
      >
        <span style={{ color: C.note, display: "flex" }}>
          <IconNote />
        </span>
        <h1
          style={{
            color: C.textPrim,
            fontSize: 18,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          Notes
        </h1>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Formulario */}
        {!showArchived && (
          <div style={{ marginBottom: 36, animation: "fadeIn 0.3s ease" }}>
            <div
              style={{
                backgroundColor: C.surface,
                borderRadius: 16,
                border: `1px solid ${formFocused ? C.accent : C.border}`,
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: formFocused
                  ? `0 0 0 3px rgba(29,155,240,0.1)`
                  : "none",
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              {formFocused && (
                <input
                  value={newNote.title}
                  onChange={(e) => {
                    setNewNote((prev) => ({ ...prev, title: e.target.value }));
                    setFormError(null);
                  }}
                  placeholder="Título"
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    borderBottom: `1px solid ${C.border}`,
                    outline: "none",
                    color: C.textPrim,
                    fontSize: 15,
                    fontWeight: 700,
                    padding: "14px 16px 12px",
                    caretColor: C.accent,
                    fontFamily: "inherit",
                  }}
                />
              )}
              <input
                value={newNote.content}
                onChange={(e) => {
                  setNewNote((prev) => ({ ...prev, content: e.target.value }));
                  setFormError(null);
                }}
                onFocus={() => setFormFocused(true)}
                placeholder="¿Qué tenés en mente?"
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: C.textPrim,
                  fontSize: 14,
                  padding: formFocused ? "12px 16px" : "16px",
                  caretColor: C.accent,
                  fontFamily: "inherit",
                }}
              />
              {formFocused && (
                <div
                  style={{
                    borderTop: `1px solid ${C.border}`,
                    padding: "10px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <CategorySelector
                    categories={categories}
                    onSelect={(name) =>
                      setNewNote((prev) => ({ ...prev, category: name }))
                    }
                  />
                  {newNote.category && (
                    <span
                      style={{
                        backgroundColor: "rgba(29,155,240,0.15)",
                        color: C.accent,
                        border: `1px solid rgba(29,155,240,0.3)`,
                        borderRadius: 20,
                        padding: "2px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        alignSelf: "flex-start",
                      }}
                    >
                      {newNote.category}
                      <span
                        onClick={() =>
                          setNewNote((prev) => ({ ...prev, category: "" }))
                        }
                        style={{ cursor: "pointer", opacity: 0.7 }}
                      >
                        ×
                      </span>
                    </span>
                  )}

                  {/* Error formulario */}
                  {formError && (
                    <p
                      style={{
                        color: C.error,
                        fontSize: 12,
                        margin: 0,
                        fontWeight: 600,
                      }}
                    >
                      ⚠️ {formError}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() => {
                        setFormFocused(false);
                        setNewNote({ title: "", content: "", category: "" });
                        setFormError(null);
                      }}
                      style={{
                        background: "none",
                        border: `1px solid ${C.border}`,
                        borderRadius: 20,
                        padding: "6px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        color: C.textSec,
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={addNote}
                      style={{
                        backgroundColor: C.accent,
                        color: "#fff",
                        border: "none",
                        borderRadius: 20,
                        padding: "6px 20px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = C.accentHov)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = C.accent)
                      }
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controles */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              color: C.textSec,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {selectedCategory
              ? `${showArchived ? "Archivadas" : "Activas"} · ${selectedCategory}`
              : showArchived
                ? "Notas Archivadas"
                : "Notas Activas"}
          </p>
          <button
            onClick={() => {
              setShowArchived((prev) => !prev);
              setSelectedCategory(null);
            }}
            style={{
              backgroundColor: showArchived ? C.accent : "transparent",
              color: showArchived ? "#fff" : C.textSec,
              border: `1px solid ${showArchived ? C.accent : C.border}`,
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <IconArchive />
            {showArchived ? "Ver Activas" : "Ver Archivadas"}
          </button>
        </div>

        {/* Filtro categorías */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={(name) =>
              setSelectedCategory(selectedCategory === name ? null : name)
            }
          />
        )}

        {/* Notas */}
        {notes.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <div
              style={{
                color: C.border,
                marginBottom: 12,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IconNote />
            </div>
            <p style={{ color: C.textSec, fontSize: 15 }}>No hay notas acá</p>
          </div>
        ) : (
          <div style={{ columns: "3 240px", columnGap: 16 }}>
            {notes.map((note) => (
              <div
                key={note.id}
                style={{
                  breakInside: "avoid",
                  marginBottom: 16,
                  animation: "fadeIn 0.25s ease",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <NoteCard
                  note={note}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onArchive={() => toggleArchive(note.id, note.isArchived)}
                  onAddCategory={(name) => handleAddCategory(note.id, name)}
                  onRemoveCategory={(categoryId) =>
                    handleRemoveCategory(note.id, categoryId)
                  }
                  onDelete={() => handleDelete(note.id)}
                  onEdit={(title, content) =>
                    handleEdit(note.id, title, content)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
