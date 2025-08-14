from flask import Blueprint, request, jsonify, session

from ..utils import db, login_required

user_bp = Blueprint("user", __name__)


@user_bp.route("/")
@login_required
def user():
    try:
        user = db.execute(
            "SELECT username, id FROM users WHERE id = ?", session["user_id"]
        )

        return jsonify(user[0])
    except Exception as e:
        print(f"Error fetching user: {e}")
        return jsonify({"error": "Error fetching user"}), 400


@user_bp.route("/favorites", methods=["GET"])
@login_required
def get_favorites():
    try:
        favorites = db.execute(
            """
            SELECT b.*
            FROM top_books AS b
            JOIN favorites f ON f.book_id = b.id
            WHERE f.user_id = ?
            ORDER BY f.favorited_at DESC
        """,
            session["user_id"],
        )
        return jsonify(favorites), 200
    except Exception as e:
        print(f"Error fetching favorites: {e}")
        return jsonify({"error": "Error fetching favorites"}), 400


@user_bp.route("/favorites", methods=["POST"])
@login_required
def add_favorite():
    data = request.get_json()

    if not data or "book_id" not in data:
        return jsonify({"error": "Book id required"}), 400

    book_id = data["book_id"]
    user_id = session["user_id"]

    try:
        # Check if the favorite already exists
        existing = db.execute(
            "SELECT 1 FROM favorites WHERE user_id = ? AND book_id = ?",
            user_id,
            book_id,
        )

        if existing:
            return jsonify({"message": "Book is already in favorites"}), 200

        # Insert into favorites
        db.execute(
            "INSERT INTO favorites(user_id, book_id) VALUES (?, ?)", user_id, book_id
        )

        return jsonify({"message": "Successfully added book to favorites"}), 200
    except Exception as e:
        print(f"Error adding to favorites: {e}")
        return jsonify({"error": "Could not add to favorites"}), 400


@user_bp.route("/favorites/<book_id>", methods=["DELETE"])
@login_required
def remove_favorite(book_id):
    try:
        db.execute(
            "DELETE FROM favorites WHERE user_id = ? AND book_id = ?",
            session["user_id"],
            book_id,
        )
        return jsonify({"message": "Successfully removed favorite"}), 200
    except Exception as e:
        print(f"Error deleting favorite: {e}")
        return jsonify({"error": "Could not remove favorite"}), 400
