from app import app
from flask import render_template, jsonify

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello from Flask!"})