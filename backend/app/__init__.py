from flask import Flask
from flask_cors import CORS
from flask_session import Session

from .routes.books import books_bp
from .routes.auth import auth_bp
from .routes.user import user_bp

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

Session(app)
CORS(app, supports_credentials="true", origins=["http://localhost:5173"])

app.register_blueprint(books_bp, url_prefix="/api/books")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(user_bp, url_prefix="/api/user")