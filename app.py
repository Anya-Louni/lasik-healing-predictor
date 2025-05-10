from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load your trained model
model = joblib.load('lasik_prediction_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Extract inputs
    try:
        inputs = [
            int(data['age']),
            1 if data['gender'] == 'male' else 0,  # assuming gender was encoded like this
            float(data['pre_op_vision']),
            float(data['corneal_thickness']),
            float(data['pupil_size']),
            int(data['dry_eye_score']),
            int(data['contact_lens_history']),
            {"LASIK": 0, "PRK": 1, "SMILE": 2, "LASEK": 3}[data['surgery_type']],  # map to int
            int(data['post_op_med_compliance']),
        ]
    except KeyError as e:
        return jsonify({'error': f'Missing input: {e}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    # Predict
    input_array = np.array([inputs])  # shape: (1, n_features)
    probability = model.predict_proba(input_array)[0][1]  # Probability for class 1
    prediction = model.predict(input_array)[0]

    return jsonify({
        'prediction': int(prediction),
        'probability': round(probability * 100, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)

