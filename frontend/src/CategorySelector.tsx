import { useState } from "react";
import type { Category } from "./types/note";

interface Props {
  categories: Category[];
  onSelect: (name: string) => void;
}

export default function CategorySelector({ categories, onSelect }: Props) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(input.toLowerCase()),
  );

  const handleSelect = (name: string) => {
    onSelect(name);
    setInput("");
    setOpen(false);
    setInputError(null);
  };

  return (
    <div style={{ position: "relative", flex: 1, minWidth: 120 }}>
      <input
        value={input}
        onChange={(e) => {
          const val = e.target.value;
          if (val.length > 15) {
            setInputError("Máximo 15 caracteres.");
            return;
          }
          setInputError(null);
          setInput(val);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Agregar categoría..."
        style={{
          background: "rgba(20,23,26,0.1)",
          border: `1px solid ${inputError ? "#c0392b" : "rgba(20,23,26,0.2)"}`,
          borderRadius: 8,
          outline: "none",
          color: "#4e545f",
          fontSize: 13,
          padding: "6px 10px",
          width: "100%",
          caretColor: "#4e545f",
          fontFamily: "inherit",
        }}
      />

      {/* Error mensaje */}
      {inputError && (
        <p
          style={{
            color: "#c0392b",
            fontSize: 11,
            margin: "4px 0 0",
            fontWeight: 600,
          }}
        >
          ⚠️ {inputError}
        </p>
      )}

      {/* Dropdown */}
      {open && (input || filtered.length > 0) && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "#1e2732",
            border: "1px solid #2f3e4e",
            borderRadius: 10,
            zIndex: 50,
            maxHeight: 160,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          {filtered.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.name)}
              style={{
                padding: "9px 12px",
                fontSize: 13,
                color: "#f7f9f9",
                cursor: "pointer",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#253341")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {cat.name}
            </div>
          ))}
          {input.trim() &&
            !categories.find(
              (c) => c.name.toLowerCase() === input.toLowerCase(),
            ) && (
              <div
                onClick={() => handleSelect(input.trim())}
                style={{
                  padding: "9px 12px",
                  fontSize: 13,
                  color: "#1d9bf0",
                  cursor: "pointer",
                  borderTop: filtered.length > 0 ? "1px solid #2f3e4e" : "none",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#253341")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                + Crear "{input.trim()}"
              </div>
            )}
        </div>
      )}
    </div>
  );
}
