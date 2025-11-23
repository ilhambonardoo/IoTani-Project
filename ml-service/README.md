# ML Service - IoTani Project

Service Machine Learning untuk analisis gambar tanaman cabai menggunakan TensorFlow.

## Requirements

- Python 3.8+
- TensorFlow 2.15.0
- FastAPI
- Uvicorn

## Instalasi

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Menjalankan Service

Jalankan service dengan salah satu perintah berikut:

**Cara 1: Menggunakan Python langsung (Recommended)**
```bash
# Dari direktori ml-service
python main.py
```

**Cara 2: Menggunakan uvicorn**
```bash
# Dari direktori ml-service
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

# Atau menggunakan uvicorn langsung (jika sudah di PATH)
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Service akan berjalan di: `http://127.0.0.1:8000`

**Catatan Penting:**
- Pastikan service berjalan di terminal terpisah sebelum menggunakan aplikasi frontend
- Jangan tutup terminal saat service berjalan
- Jika melihat error saat loading model, service tetap akan berjalan tapi fitur analisis tidak tersedia

## Endpoints

- `GET /` - Status service
- `GET /health` - Health check endpoint
- `POST /analyze` - Analisis gambar (menerima file image)

## Catatan

Pastikan file `model_cabai.h5` ada di direktori `ml-service` sebelum menjalankan service.

