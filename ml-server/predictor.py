import json
import os
import pandas as pd
from prophet.serialize import model_from_json

# Folder models
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

# Daftar model yang tersedia
MODEL_FILES = {
    "cabai-merah": "model_cabai.json",
    "bawang-merah": "model_bawang_merah.json",
    "bawang-putih": "model_bawang-putih.json",
    "tomat": "model_tomat.json",
}

# Load semua model
_MODELS = {}

for komoditas, filename in MODEL_FILES.items():
    path = os.path.join(MODELS_DIR, filename)

    if os.path.exists(path):
        with open(path, "r") as f:
            _MODELS[komoditas] = model_from_json(json.load(f))
        print(f"[predictor] Model '{komoditas}' berhasil dimuat.")
    else:
        print(f"[predictor] File '{filename}' tidak ditemukan, dilewati.")

def daftar_komoditas_tersedia():
    return list(_MODELS.keys())


def predict(days: int = 30, komoditas: str = "cabai-merah"):
    """
    Melakukan prediksi harga berdasarkan model komoditas yang dipilih.
    """

    if komoditas not in _MODELS:
        raise ValueError(
            f"Komoditas '{komoditas}' belum tersedia."
        )

    model = _MODELS[komoditas]

    # Membuat tanggal prediksi
    future = model.make_future_dataframe(periods=days)

    # Prediksi
    forecast = model.predict(future)

    # Ambil hanya hasil prediksi (bukan data training)
    hasil = forecast[
        ["ds", "yhat", "yhat_lower", "yhat_upper"]
    ].tail(days)

    # Rename kolom
    hasil = hasil.rename(
        columns={
            "ds": "tanggal",
            "yhat": "prediksi_harga",
            "yhat_lower": "batas_bawah",
            "yhat_upper": "batas_atas",
        }
    )

    # Bulatkan angka
    hasil["prediksi_harga"] = hasil["prediksi_harga"].round().astype(int)
    hasil["batas_bawah"] = hasil["batas_bawah"].round().astype(int)
    hasil["batas_atas"] = hasil["batas_atas"].round().astype(int)

    # Format tanggal
    hasil["tanggal"] = hasil["tanggal"].dt.strftime("%Y-%m-%d")

    return hasil