const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Book {
  id: number;
  title: string;
  genre: string;
  author: string;
  description?: string;
  image_url?: string;
}

export interface User {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: { id: number; username: string };
}

export interface RegisterUser {
  username: string;
  password: string;
  confirmation: string;
}

// Get books with pagination and query
export async function getBooks(
  page: number = 1,
  limit: number = 20,
  query: string = ""
): Promise<Book[]> {
  const res = await fetch(
    `${API_BASE_URL}/books?page=${page}&limit=${limit}&query=${encodeURIComponent(
      query
    )}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return await res.json();
}

// Get a specific book using book_id
export async function getBook(book_id: string): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books/${book_id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return await res.json();
}

// Post a favorite book
export async function postFavorite(
  book_id: number
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/user/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ book_id }),
  });

  if (!res.ok) throw new Error("Failed to add favorites");

  return await res.json();
}

// Get user's favorites
export async function getFavorites(): Promise<Book[]> {
  const res = await fetch(`${API_BASE_URL}/user/favorites`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Fetch favorites failed");
  }

  return await res.json();
}

// Remove a favorited book from user's favorite list
export async function deleteFavorite(
  book_id: number
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/user/favorites/${book_id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to remove favorite");

  return await res.json();
}

// Login user
export async function login(user: User): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Login failed");
  }

  return await res.json();
}

// Register user
export async function register(user: RegisterUser): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Registration failed");
  }

  return await res.json();
}

// Logout user
export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Logout failed");
}

// Check if user is logged in
export async function isLoggedIn(): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/auth/check`, {
    credentials: "include",
  });

  if (!res.ok) return false;

  const data = await res.json();
  return data.logged_in === true;
}

// Get user info
export async function getUser(): Promise<{ username: string; id: string }> {
  const res = await fetch(`${API_BASE_URL}/user`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    const error = data;
    throw new Error(error?.error || "Fetching user failed");
  }

  return data;
}
