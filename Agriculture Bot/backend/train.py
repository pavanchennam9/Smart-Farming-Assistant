import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

data = pd.read_csv(os.path.join(os.path.dirname(__file__), "datasets", "Crop_Recommendation.csv"))

X = data[['N','P','K','temperature','humidity','ph','rainfall']]
y = data['label']

model = RandomForestClassifier()
model.fit(X, y)

os.makedirs("model", exist_ok=True)

pickle.dump(model, open("model/crop_model.pkl", "wb"))

print("Model trained and saved successfully!")