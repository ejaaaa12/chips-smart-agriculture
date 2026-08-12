import io
import os
import cv2
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ultralytics import YOLO

from predictor import daftar_komoditas_tersedia, predict

app = FastAPI(title="Smart Agriculture AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# LOAD MODEL YOLO & KAMERA
# =========================================================

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "best_v1_classification.pt")

yolo_model = YOLO(MODEL_PATH)
print("YOLO Model Loaded")

# Inisialisasi Webcam USB di RasPi (0 biasanya port USB kamera utama)
# Kalau tidak kebuka, coba ganti angka 0 jadi 1
camera = cv2.VideoCapture(0)


# =========================================================
# HOME & DAFTAR KOMODITAS
# =========================================================


@app.get("/")
def home():
  return {
      "message": "Smart Agriculture AI API berjalan",
      "komoditas_tersedia": daftar_komoditas_tersedia(),
      "camera_ai": "ready",
  }


@app.get("/komoditas")
def list_komoditas():
  return {"komoditas": daftar_komoditas_tersedia()}


# =========================================================
# PREDIKSI HARGA
# =========================================================


@app.get("/predict")
def get_prediction(days: int = 30, komoditas: str = "cabai-merah"):
  try:
    hasil = predict(days=days, komoditas=komoditas)
  except ValueError as e:
    return {
        "error": str(e),
        "komoditas_tersedia": daftar_komoditas_tersedia(),
    }

  return hasil.to_dict(orient="records")


# =========================================================
# AI CAMERA - VIA UPLOAD FILE (Eksisting)
# =========================================================


@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
  image_bytes = await file.read()
  image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

  results = yolo_model(image)
  probs = results[0].probs
  kelas = results[0].names[probs.top1]
  confidence = float(probs.top1conf)

  return {"class": kelas, "confidence": round(confidence * 100, 2)}


# =========================================================
# AI CAMERA - STREAMING WEBCAM USB (Baru!)
# =========================================================


def generate_video_stream():
  while True:
    success, frame = camera.read()
    if not success:
      break
    else:
      # 1. Prediksi frame pakai model YOLO kamu
      results = yolo_model(frame)

      # 2. Gambar bounding box / label prediksi di atas frame
      annotated_frame = results[0].plot()

      # 3. Encode frame OpenCV (BGR) jadi format JPEG
      _, buffer = cv2.imencode(".jpg", annotated_frame)
      frame_bytes = buffer.tobytes()

      # 4. Stream frame satu per satu (MJPEG)
      yield (
          b"--frame\r\n"
          b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
      )


@app.get("/video-feed")
def video_feed():
  """Endpoint streaming live dari webcam USB RasPi + Deteksi YOLO real-time."""
  return StreamingResponse(
      generate_video_stream(),
      media_type="multipart/x-mixed-replace; boundary=frame",
  )