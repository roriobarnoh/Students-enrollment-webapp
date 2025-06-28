# server/wsgi.py
from app import app  # adjust if your app file is named differently

if __name__ == "__main__":
    app.run()
