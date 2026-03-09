# Notes App

A full-stack Single Page Application (SPA) for creating, tagging, and filtering notes. A full-stack Single Page Application (SPA) for creating, tagging, and filtering notes. Built to practice full stack development with a clean REST API and a React frontend.

---

## Tech Stack

### Backend

- **Node.js** v24.11.1
- **npm** v11.10.1
- **NestJS** v11.0.16
- **TypeORM** — ORM for database interaction
- **PostgreSQL** v15 — relational database (via Docker)
- **class-validator** — DTO validation

### Frontend

- **React** v19
- **TypeScript**
- **Vite** — build tool and dev server

### Infrastructure

- **Docker** v28.5.1 — for running PostgreSQL locally

---

## Architecture

### Backend

The backend follows a layered architecture enforced by NestJS:

- **Controllers** — handle incoming HTTP requests and return responses
- **Services** — contain all business logic
- **Entities** — define the database schema via TypeORM decorators
- **DTOs** — validate and type incoming request data using class-validator

NestJS was chosen over plain Express because it provides this structure out of the box, making it ideal for building REST APIs quickly without spending time on boilerplate configuration.

The data model has two entities with a Many-to-Many relationship:

```
Note ──────────────── Category
  id                    id
  title                 name
  content
  isArchived
  fechaCreacion
  fechaActualizacion
  categories[]
```

PostgreSQL was chosen because the Many-to-Many relationship between notes and categories maps naturally to a relational model. TypeORM handles the join table automatically via the `@ManyToMany` and `@JoinTable` decorators.

### Frontend

The frontend is a React SPA built with Vite. State is managed entirely with React's built-in `useState` hook — no external state management library was needed given the scope of the app. All API communication is centralized in a `services/` layer, keeping components focused on rendering.

Vite was chosen over Create React App because it is the modern standard for React projects, offering near-instant startup and hot reload times.

---

## Requirements

Make sure you have the following installed:

| Tool       | Version  |
| ---------- | -------- |
| Node.js    | v24.11.1 |
| npm        | v11.10.1 |
| NestJS CLI | v11.0.16 |
| Docker     | v28.5.1  |

---

## Running the App

### Option 1 — One command (Linux/macOS)

From the root of the repository:

```bash
chmod +x start.sh
./start.sh
```

This will automatically:

1. Start a PostgreSQL container via Docker
2. Create the `.env` file for the backend
3. Install dependencies for both backend and frontend
4. Start both servers

### Option 2 — Manual setup

**1 — Start the database**

```bash
docker run -d \
  --name notes-db \
  -e POSTGRES_USER=user_notes \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=db_notes \
  -p 5432:5432 \
  postgres:15
```

**2 — Configure the backend**

Create a `.env` file inside the `backend/` folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user_notes
DB_PASSWORD=root
DB_DATABASE=db_notes
```

**3 — Start the backend**

```bash
cd backend
npm install --legacy-peer-deps
npm run start:dev
```

**4 — Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

Once running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

---

## API Endpoints

### Notes

| Method | Endpoint                                | Description                                |
| ------ | --------------------------------------- | ------------------------------------------ |
| GET    | `/notes`                                | Get all active notes                       |
| GET    | `/notes?isArchived=true`                | Get archived notes                         |
| GET    | `/notes?category=name`                  | Filter notes by category                   |
| POST   | `/notes`                                | Create a note                              |
| PATCH  | `/notes/:id`                            | Update a note (title, content, isArchived) |
| DELETE | `/notes/:id`                            | Delete a note                              |
| POST   | `/notes/:id/categories`                 | Add a category to a note                   |
| DELETE | `/notes/:noteId/categories/:categoryId` | Remove a category from a note              |

### Categories

The categories resource exposes basic CRUD endpoints, though category management is handled indirectly through the notes endpoints above — categories are created on the fly when added to a note.

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| GET    | `/categories` | Get all categories |

---

## Features

### Phase 1

- Create, edit, and delete notes
- Archive and unarchive notes
- List active and archived notes separately

### Phase 2

- Add and remove categories (tags) to notes
- Filter notes by category, respecting the active/archived view
- Create new categories on the fly when adding a tag
- Active tag is highlighted on each note card when filtering

---

## What I Would Add With More Time

- **Authentication** — user login with JWT so each user manages their own notes
- **Note colors** — allow users to customize the color of each note
- **Search** — full text search across note titles and content

---

## Technical Notes

- The database schema is auto-generated by TypeORM via `synchronize: true`. No manual migrations are needed.
- The backend requires `--legacy-peer-deps` during `npm install` due to a peer dependency conflict between `class-validator` versions.
