from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import os
print(os.listdir())
app = Flask(__name__,
            template_folder="templates",
            static_folder="static")
# Load trained model
model_path = "model/crop_model.pkl"

if not os.path.exists(model_path):
    raise Exception("Run train.py first!")

model = pickle.load(open(model_path, "rb"))

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        features = np.array([[
            data["N"],
            data["P"],
            data["K"],
            data["temperature"],
            data["humidity"],
            data["ph"],
            data["rainfall"]
        ]])

        prediction = model.predict(features)[0]

        return jsonify({"recommended_crop": prediction})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)