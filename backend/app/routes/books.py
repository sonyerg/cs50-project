from flask import Blueprint, jsonify, request

from ..utils import db, login_required

books_bp = Blueprint("books", __name__)


@books_bp.route("/")
def get_books():
    """Get books with pagination"""
    try:
        # Get page & limit from query params, default to page 1, 10 books per page
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 20))
        query = request.args.get("query", "")

        # Calculate offset
        offset = (page - 1) * limit

        # Fetch books for this page
        if query:
            books = db.execute(
                """
        SELECT * FROM top_books
        WHERE title LIKE ?
           OR author LIKE ?
           OR genre LIKE ?
        LIMIT ? OFFSET ?
        """,
                f"%{query}%",
                f"%{query}%",
                f"%{query}%",
                limit,
                offset,
            )
        else:
            books = db.execute(
                """
        SELECT * FROM top_books
        LIMIT ? OFFSET ?
        """,
                limit,
                offset,
            )

        return jsonify(books)

    except Exception as e:
        print(f"Error fetching books: {e}")
        return jsonify({"error": "Error fetching books"}), 400


@books_bp.route("/<book_id>")
def get_book(book_id):
    """Get a specific book by id"""
    try:
        book = db.execute("SELECT * FROM top_books WHERE id = ?", book_id)
    except ValueError:
        return jsonify({"error": "Error fetching book"}), 400

    if not book:
        return jsonify({"error": "Book not found"}), 404

    return jsonify(book[0])
