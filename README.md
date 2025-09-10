# 📚 Digital Library Web App

A full-stack web application containing arguably the top 100 greatest book of all time and for managing your personal favorites. This project was inspired by [thegreatestbook.com](https://thegreatestbooks.org/).
Built with a **Vite + TypeScript frontend** and a **Flask backend** using **SQLite**.  
Includes search, authentication (login/signup), save favorite books, infinite scroll / load more functionality, and book detail cards.

---

## 🚀 Features

- **Frontend** (Vite + TypeScript + Tailwind CSS)
  - Responsive grid layout for books
  - Search books by title, author, or genre
  - "Load More" pagination
  - Skeleton loading states
  - Scroll-to-top button for easy navigation
  - Clean UI built with Tailwind + shadcn/ui components

- **Backend** (Flask + SQLite)
  - REST API for fetching books, user, and authentication
  - Query parameters for filtering (title, author, genre)
  - Returns JSON responses
  - Error handling for failed fetches

- **Database** (SQLite)
  - Stores book data (title, author, genre, image URL, and description)
  - Easily portable, file-based database

---

## 🛠️ Tech Stack

### Frontend
- **[Vite](https://vitejs.dev/)** — lightning-fast dev server and bundler
- **[TypeScript](https://www.typescriptlang.org/)** — type safety
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** — accessible UI components
- **[Lucide React](https://lucide.dev/)** — icons

### Backend
- **[Flask](https://flask.palletsprojects.com/)** — Python web framework
- **[SQLite](https://www.sqlite.org/)** — lightweight database
- **[Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)** — enable cross-origin requests

---

## 📂 Project Structure

```plaintext
final-project/
│
├── backend/
|   ├── run.py                  # App entry point
|   ├── books.db                # SQLite database
|   ├── requirements.txt        # Python dependencies
|   ├── requirements.txt        # Python dependencies
|   ├── .gitignore              # Gitignore configs
│   └── app/                    
│       ├── routes/
│       │   ├── books.py        # Books API routes
│       │   ├── auth.py         # Authentication API routes
│       │   └── user.py         # User API routes
│       ├── utils.py            # Utilities
│       └── __init__.py         # Initializes app
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   |   |   ├── ui/               # Installed shadcn ui components
│   │   │   ├── LibraryGrid.tsx   # Book grid with load more functionality
│   │   │   ├── BookCard.tsx      # Displays a single book
│   │   │   ├── GridSkeleton.tsx  # Loading state
│   │   │   └── LibraryHeader.tsx # Header of homepage
│   │   ├── pages/
│   |   |   ├── BookDetails.tsx   # Page for displaying a specifi book
|   |   |   ├── HomePage.tsx      # Home page
│   |   |   ├── LoginPage.tsx     # Page for logging in
|   |   |   ├── ProfilePage.tsx   # Page for User profile 
│   |   |   └── SignupPage.tsx    # Page for signing up
│   │   ├── lib/utils.ts          # A utility function for tailwind and shadcn ui integration
│   │   ├── services/api.ts       # API calls to Flask backend
│   │   ├── index.css             # Root React component
│   │   └── main.tsx              # App entry point
│   │   ├── App.tsx               # Root React component
│   │   ├── App.css               
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 📂 Installation Setup

**Backend:**
```
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python run.py
```

**Frontend:**
```
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

### Get all books
```
GET /books
```
Query Parameters:
- page (number) — page number for pagination
- limit (number) — number of results per page
- query (string, optional) - query by author, genre, or title

### Example:
```
GET /api/books/?page=1&limit=20&query=ulysses
```
### Response:
```
[
    {
        "id": 1,
        "title": "Ulysses",
        "author": "James Joyce",
        "genre": "Fiction",
        "description": "Ulysses has been the subject of..."
        "image_url": "https://example.com/image.jpg"
    }
]
```

### Get a single book by ID
```
GET /api/books/<book_id>
```

Path Parameters:

book_id (integer) — The unique ID of the book

### Example:
```
GET /api/books/1
```
Response:
```
{
    "id": 1,
    "title": "Ulysses",
    "author": "James Joyce",
    "genre": "Fiction",
    "description": "Ulysses has been the subject of...",
    "image_url": "https://example.com/image.jpg"
}
```

### Authentication

### Register
```
POST /api/auth/register
```
### Body (JSON):
```
{
    "username": "john_doe",
    "password": "secret123",
    "confirmation": "secret123"
}
```
### Response:
```
{"message": "User registered succesfully"}
```
### Errors:

400 — Missing fields, username exists, or password mismatch

### Login
```
POST /api/auth/login
```

Body (JSON):
```
{
    "username": "john_doe",
    "password": "secret123"
}
```

### Response:
```
{"message": "Login successful", "username": "john_doe"}
```

### Errors:

400 — Missing credentials

401 — Invalid username or password

### Logout
```
GET /api/auth/logout
```

### Response:
```
{"message": "Logout successful"}
```
### Check login status
```
GET /api/auth/check
```

### Response (logged in):
```
{"logged_in": true}
```

### Response (not logged in):
```
{"logged_in": false}
```

### User

### Get current user
```
GET /api/user
```

### Authentication: Required (session-based)

### Response:
```
{
    "username": "john_doe",
    "id": 1
}
```
### Get user favorites
```
GET /api/user/favorites
```

### Authentication: Required
Response:
```
[
    {
        "id": 2,
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "genre": "Fiction",
        "description": "A classic novel...",
        "image_url": "https://example.com/image.jpg"
    }
]
```

### Add a book to favorites
```
POST /api/user/favorites
```

### Authentication: Required
Body (JSON):
```
{"book_id": 2}
```

### Response:
```
{"message": "Successfully added book to favorites"}
```
### Remove a book from favorites
```
DELETE /api/user/favorites/<book_id>
```

### Authentication: Required

### Response:
```
{"message": "Successfully removed favorite"}
```

---
## 🖼 UI Overview
- **LibraryGrid**
    - Fetches books from the API
    - Displays results in a responsive grid
    - "Load More" button appends more results
    - Search bar filters books by title, author, or genre

- **Library Header**
    - Login/Sign up button
    - Profile button to navigate to profile page (if authenticated)

- **Scroll to Top**
    - Appears when the user scrolls near the bottom
    - Smoothly scrolls the page back to the top

- **Profile page**
    - Fetches User profile and favorite books

- **Book Details page**
    - Fetches specific book's details
    - Has a button that enables user to add current book to favorites

---

## 📌 Future Improvements
- Add Ratings system
- Include more books and be ranked based on  (monthly?) ratings.
- Deploy frontend and backend to production
- Add unit and integration tests
- Add books suggestions
