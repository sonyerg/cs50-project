from flask import Blueprint, jsonify, request, session
from cs50 import SQL
from werkzeug.security import check_password_hash, generate_password_hash

from ..utils import db


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.get_json()

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password are required"}), 400

    username = data["username"]
    password = data["password"]
    confirmation = data["confirmation"]

    existing_user = db.execute("SELECT * FROM users WHERE username = ?", username)
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    if password != confirmation:
        return jsonify({"error": "Password does not match"}), 400

    hashed_password = generate_password_hash(password)

    try:
        db.execute(
            "INSERT INTO users(username, hash) VALUES (?, ?)",
            username,
            hashed_password,
        )

        return jsonify({"message": "User registered succesfully"}), 201
    except ValueError:
        return jsonify({"error": "Error registration"}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login user"""
    data = request.get_json()

    # Validate client input
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password are required"}), 400

    username = data["username"]
    password = data["password"]

    # Check password if correct and if user exists
    user = db.execute("SELECT * FROM users WHERE username = ?", username)
    if not user or not check_password_hash(user[0]["hash"], password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Set session
    session["user_id"] = user[0]["id"]

    return jsonify({"message": "Login successful", "username": username}), 200


@auth_bp.route("/logout")
def logout():
    """Logout user"""
    session.clear()

    return jsonify({"message": "Logout successful"}), 200


@auth_bp.route("/check")
def check_login():
    if session.get("user_id"):
        return jsonify({"logged_in": True})
    return jsonify({"logged_in": False})

# Add change password feature that requires email confirmation