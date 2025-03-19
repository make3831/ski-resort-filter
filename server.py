from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
import json

app = Flask(__name__)
CORS(app)  # Allows React frontend to access Flask API

# Securely store API key in environment variables
API_KEY = os.getenv("TOMTOM_API_KEY", "cDPlHucHEwrfSsyg9wATfPzr4T9FKeI5")

# Load ski resort details from ski_resorts.json
def load_ski_resorts():
    try:
        with open("ski_resorts.json", "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}

ski_resorts_data = load_ski_resorts()  # Load resort data

# List of ski resorts for distance calculations
ski_resorts = [
    {"name": "Eldora", "lat": 39.9495, "lon": -105.5702},
    {"name": "Breckenridge", "lat": 39.4817, "lon": -106.0384},
    {"name": "Winter Park", "lat": 39.886, "lon": -105.762}
]

# Conversion factors
KM_TO_MILES = 0.621371
SECONDS_TO_HOURS = 1 / 3600

# Base URL for TomTom Routing API
ROUTING_API_URL = "https://api.tomtom.com/routing/1/calculateRoute"

# Function to format time into hours and minutes
def format_time(seconds):
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    return f"{hours} hr {minutes} min" if hours > 0 else f"{minutes} min"

# Function to fetch traffic-aware route data
def get_traffic_data(user_lat, user_lon):
    results = []
    for resort in ski_resorts:
        url = f"{ROUTING_API_URL}/{user_lat},{user_lon}:{resort['lat']},{resort['lon']}/json"
        params = {
            "key": API_KEY,
            "routeType": "fastest",
            "traffic": "true",
            "travelMode": "car",
            "departAt": "now"
        }

        response = requests.get(url, params=params)

        if response.status_code == 200:
            data = response.json()
            if "routes" in data and len(data["routes"]) > 0:
                route = data["routes"][0]
                summary = route["summary"]

                # Convert to miles and mph
                distance_miles = summary["lengthInMeters"] / 1000 * KM_TO_MILES
                travel_time_hours = summary["travelTimeInSeconds"] * SECONDS_TO_HOURS
                avg_speed_mph = distance_miles / travel_time_hours if travel_time_hours > 0 else 0

                results.append({
                    "name": resort["name"],
                    "travelTime": format_time(summary["travelTimeInSeconds"]),
                    "delay": format_time(summary["trafficDelayInSeconds"]),
                    "distance": round(distance_miles, 1),
                    "speed": round(avg_speed_mph, 1)
                })
            else:
                results.append({"name": resort["name"], "error": "No route found"})
        else:
            results.append({"name": resort["name"], "error": "Error fetching data"})

    return results

# **NEW API ENDPOINT: Serve all ski resort data**
@app.route("/api/resorts", methods=["GET"])
@app.route("/api/resorts", methods=["GET"])
def get_all_resorts():
    """Return all ski resorts in a proper format"""
    
    if isinstance(ski_resorts_data, dict):  # ✅ If JSON is a dictionary
        formatted_resorts = [
            {
                "name": name,  # Resort name from dictionary key
                "Total Lifts": details.get("Total Lifts", 0),
                "Total Runs": details.get("Total Runs", 0),
                "Beginner Terrain": details.get("Beginner Terrain", "0%"),
                "Intermediate Terrain": details.get("Intermediate Terrain", "0%"),
                "Advanced/Expert Terrain": details.get("Advanced/Expert Terrain", "0%"),
                "Terrain Parks": int(details.get("Terrain Parks", "0")),
                "Skiable Terrain": details.get("Skiable Terrain", "0 acres"),
            }
            for name, details in ski_resorts_data.items()
        ]
    
    elif isinstance(ski_resorts_data, list):  # ✅ If JSON is already a list
        formatted_resorts = ski_resorts_data  # No need to convert

    else:
        return jsonify({"error": "Invalid ski resort data format"}), 500

    return jsonify(formatted_resorts)

# **NEW API ENDPOINT: Get details of a specific resort**
@app.route("/api/resorts/<resort_name>", methods=["GET"])
def get_resort(resort_name):
    """Return a specific ski resort by name"""
    resort_name = resort_name.replace("-", " ").title()  # Convert URL-friendly name
    if resort_name in ski_resorts_data:
        return jsonify(ski_resorts_data[resort_name])
    else:
        return jsonify({"error": "Resort not found"}), 404

# **NEW API ENDPOINT: Filter resorts based on criteria**
@app.route("/api/filterResorts", methods=["GET"])
def filter_resorts():
    """Filter ski resorts based on user preferences"""
    filters = {
        "total_runs": request.args.get("totalRuns", type=int),
        "beginner": request.args.get("beginner", type=float),
        "intermediate": request.args.get("intermediate", type=float),
        "advanced_expert": request.args.get("advancedExpert", type=float),
        "skiable_terrain": request.args.get("skiableTerrain"),
        "terrain_parks": request.args.get("terrainParks", type=int)
    }

    filtered_resorts = []
    
    for resort_name, resort_data in ski_resorts_data.items():
        match = False  # Start with no match

        # Convert values where necessary
        resort_total_runs = resort_data.get("Total Runs", 0)
        resort_beginner = float(resort_data.get("Beginner Terrain", "0%").replace("%", ""))
        resort_intermediate = float(resort_data.get("Intermediate Terrain", "0%").replace("%", ""))
        resort_advanced_expert = float(resort_data.get("Advanced/Expert Terrain", "0%").replace("%", ""))
        resort_skiable_terrain = resort_data.get("Skiable Terrain", "").replace(" acres", "")
        resort_terrain_parks = int(resort_data.get("Terrain Parks", 0))

        # Apply OR logic for filtering
        if filters["total_runs"] and resort_total_runs >= filters["total_runs"]:
            match = True
        if filters["beginner"] and resort_beginner >= filters["beginner"]:
            match = True
        if filters["intermediate"] and resort_intermediate >= filters["intermediate"]:
            match = True
        if filters["advanced_expert"] and resort_advanced_expert >= filters["advanced_expert"]:
            match = True
        if filters["skiable_terrain"] and int(resort_skiable_terrain) >= int(filters["skiable_terrain"]):
            match = True
        if filters["terrain_parks"] and resort_terrain_parks >= filters["terrain_parks"]:
            match = True

        if match:
            filtered_resorts.append({resort_name: resort_data})

    return jsonify(filtered_resorts)

# **API Route for React Frontend - TrafficData**
@app.route('/api/getDistances', methods=['GET'])
def get_distances():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Missing latitude or longitude"}), 400

    return jsonify({
        "lat": float(lat),
        "lon": float(lon),
        "message": "Success!"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  # Run backend on port 5000
