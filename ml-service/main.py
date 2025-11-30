import os
os.environ['FOR_DISABLE_CONSOLE_CTRL_HANDLER'] = '1'

import uvicorn
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io


app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading model...")
model = None
try:
    model = tf.keras.models.load_model("model_cabai1.keras")
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Service will start but model analysis will not be available.")

CLASS_NAMES = [
        "Anthracnos (Bercak Daun)",
        "Leaf Curl (Daun Keriting)",
        "Yellowish (Daun Kuning)",
        "Damping off (Busuk Pangkal Batang)",
        "Mites (Tungau)",
        "Thrips (Thrips)",
        "Whitefly (Kutu Kebul)",
        "Healthy (Sehat)",
]

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# Endpoint 
@app.get("/")
def read_root():
    return {"message": "ML Service is running."}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message" : " Server berjalana dengan normal"}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model belum dibuat.")
    
    try:
        contents = await file.read()
        preprocessed_image = preprocess_image(contents)
        predictions = model.predict(preprocessed_image)

        predicted_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))

        if predicted_index < len (CLASS_NAMES):
            result_class = CLASS_NAMES[predicted_index]
        else: 
            result_class = f"Unknown class index: {predicted_index}"

        return {
            "objek": "Tanaman Cabai",
            "penyakit": result_class,
            "confidence": f"{confidence * 100:.2f}%"
        }
    except Exception as e:
        print(f"Error saat menganalisis: {e}")
        raise HTTPException(status_code=500, detail="Error saat menganalisis gambar.")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)