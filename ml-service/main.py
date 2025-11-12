from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="IoTani ML Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisResult(BaseModel):
    objek: str
    kematangan: str
    penyakit: str


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalysisResult)
async def analyze(file: UploadFile = File(...)):
    # NOTE: Replace with real ML inference. This is a placeholder response.
    # You can load your model at module import and run prediction here.
    _ = await file.read()  # consume file bytes
    return {
        "objek": "Cabai Rawit",
        "kematangan": "Matang Sempurna (92%)",
        "penyakit": "Sehat (98%)",
    }





