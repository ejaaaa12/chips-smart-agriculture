from ultralytics import YOLO
import os

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "best.pt")

model = YOLO(MODEL_PATH)


def predict_image(image_path):
    results = model.predict(
        source=image_path,
        imgsz=224,
        verbose=False
    )

    r = results[0]

    class_id = int(r.probs.top1)
    confidence = float(r.probs.top1conf)

    label = r.names[class_id]

    return {
        "label": label,
        "confidence": round(confidence * 100, 2)
    }