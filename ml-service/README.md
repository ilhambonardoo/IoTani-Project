# IoTani ML Service (FastAPI)

Minimal FastAPI app to serve ML image analysis for chili detection (ripeness, disease, pests).

## Run locally

```bash
python -m venv .venv
. .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The service exposes:
- `GET /` health check
- `POST /analyze` (multipart form field `file`) returns dummy JSON:

```json
{
  "objek": "Cabai Rawit",
  "kematangan": "Matang Sempurna (92%)",
  "penyakit": "Sehat (98%)"
}
```

## Integrating from Next.js

Set the frontend env:
```
NEXT_PUBLIC_ML_API_BASE=http://127.0.0.1:8000
```

The camera page sends a multipart request to `/analyze` and renders the returned fields.





