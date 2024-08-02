from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # Add CORS support to the Flask app

# Load healthcare model and scaler
try:
    healthcare_bundle = joblib.load('models/rf_healthcare_fraud_model.pkl')
    healthcare_model = healthcare_bundle['model']
    healthcare_scaler = healthcare_bundle['scaler']
    print("Healthcare model and scaler loaded successfully.")
except Exception as e:
    print(f"Error loading healthcare model and scaler: {e}")

# Load credit card model (without scaler)
try:
    credit_card_model = joblib.load('models/model.pkl')
    print("Credit card model loaded successfully.")
except Exception as e:
    print(f"Error loading credit card model: {e}")

# Load vehicle insurance model and encoder
try:
    vehicle_insurance_bundle = joblib.load('models/model_and_encoders.pkl')
    vehicle_insurance_model = vehicle_insurance_bundle['model']
    vehicle_insurance_encoder = vehicle_insurance_bundle['label_encoders']
    print("Vehicle insurance model and encoder loaded successfully.")
except Exception as e:
    print(f"Error loading vehicle insurance model and encoder: {e}")

# In-memory storage for blog posts
blog_posts = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print(f"Received data: {data}")

        # Check for None values and handle them
        if any(i is None for i in data['data']):
            return jsonify({'error': 'Invalid input data: None values found'}), 400

        input_data = np.array([float(i) for i in data['data']]).reshape(1, -1)
        print(f"Input data reshaped: {input_data}")

        if data['type'] == 'healthcare':
            input_data_scaled = healthcare_scaler.transform(input_data)
            print(f"Input data scaled (healthcare): {input_data_scaled}")
            prediction = healthcare_model.predict(input_data_scaled)
            print(f"Prediction (healthcare): {prediction}")
        elif data['type'] == 'credit card':
            print(f"Input data (credit card): {input_data}")
            prediction = credit_card_model.predict(input_data)
            print(f"Prediction (credit card): {prediction}")
        elif data['type'] == 'vehicle insurance':
            input_data_encoded = vehicle_insurance_encoder.transform(input_data)
            print(f"Input data encoded (vehicle insurance): {input_data_encoded}")
            prediction = vehicle_insurance_model.predict(input_data_encoded)
            print(f"Prediction (vehicle insurance): {prediction}")
        else:
            return jsonify({'error': 'Invalid fraud type specified.'}), 400

        if prediction[0]==1 or prediction[0]=='Fraud':result = 'Fraud'
        else:result='Not Fraud'
        print(f"Final result: {result}")
        return jsonify({'result': result})
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/submit_story', methods=['POST'])
def submit_story():
    try:
        data = request.json
        title = data.get('title')
        content = data.get('content')
        if not title or not content:
            return jsonify({'message': 'Title and content are required.'}), 400

        blog_posts.append({'title': title, 'content': content})
        return jsonify({'message': 'Story submitted successfully.'})
    except Exception as e:
        print(f"Error submitting story: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/stories', methods=['GET'])
def get_stories():
    try:
        return jsonify(blog_posts)
    except Exception as e:
        print(f"Error retrieving stories: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
