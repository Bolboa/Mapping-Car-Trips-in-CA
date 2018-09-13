from flask import Flask
from flask_pymongo import PyMongo
from flask_migrate import Migrate
from config import Config


app = Flask(__name__)
app.config.from_object(Config)
mongo = PyMongo(app)


from app import routes