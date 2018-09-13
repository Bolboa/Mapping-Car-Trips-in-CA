from flask import Flask
from flask_pymongo import PyMongo
from flask_migrate import Migrate

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://XXX:XXX@ds255332.mlab.com:55332/car-routes"
mongo = PyMongo(app)


from app import routes