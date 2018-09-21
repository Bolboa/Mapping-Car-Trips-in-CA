from app import app, mongo

import os
import json
from flask import jsonify
from flask_cors import CORS, cross_origin

CORS(app)


'''
Return all dates.
'''
@app.route('/dates', methods=['GET'])
def get_dates():

    # Find all dates.
    trips = list(mongo.db.trips.find())
    start_times = [trip["start_time"] for trip in trips]

    return jsonify({"names": start_times})



'''
Return the data recorded on a given date.
'''
@app.route('/trip/<id>')
def get_trip(id):

    # Look up a single date.
    trip = list(mongo.db.trips.find({"start_time":{"$in":[id]}}))

    # _id is not necessary.
    del trip[0]['_id']

    return jsonify(trip[0])