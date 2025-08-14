from cs50 import SQL
from functools import wraps
from flask import session, jsonify

# Shared database connection
db = SQL("sqlite:///books.db")

def login_required(f):
    """Decorator to require login for protected routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated_function