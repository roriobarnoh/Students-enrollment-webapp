# Standard library imports

# Remote library imports
import bcrypt
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from extentions import bcrypt, jwt
import os   


# Local 
load_dotenv()

# Instantiate app, set attributes
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("FLASK_SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = os.environ.get("FLASK_SQLALCHEMY_TRACK_MODIFICATIONS", False)
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)


# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

bcrypt.init_app(app)
jwt.init_app(app)