import os
import cv2
import numpy as np
import json

def calculate_ela_score(file_path: str):
    try:
        original = cv2.imread(file_path)
        if original is None:
            return None
        temp_path = file_path + ".temp.jpg"
        cv2.imwrite(temp_path, original, [cv2.IMWRITE_JPEG_QUALITY, 90])
        compressed = cv2.imread(temp_path)
        os.remove(temp_path)
        diff = cv2.absdiff(original, compressed)
        b, g, r = cv2.split(diff)
        variance = max(np.var(b), np.var(g), np.var(r))
        return variance
    except Exception as e:
        print("ELA Error:", e)
        return None

def analyze_local_heuristics(file_path: str, mime_type: str, metadata: dict = None):
    signals = []
    
    if mime_type.startswith("image/"):
        ela_variance = calculate_ela_score(file_path)
        if ela_variance is not None:
            ela_details = {
                "method": "Error Level Analysis (OpenCV absolute difference)",
                "finding": f"Maximum channel variance: {ela_variance:.2f}",
                "interpretation": "Measures differences in compression rates across the image.",
                "confidence_type": "Heuristic indicator",
                "limitation": "ELA alone cannot establish AI generation or manipulation. High variance may simply indicate multiple saves or high-contrast edges."
            }
            signals.append({"signal": "Compression Variance Assessment (ELA)", "present": True, "details": ela_details})
            
    c2pa_status = metadata.get("c2pa_status", "") if metadata else ""
    if "detected" in c2pa_status.lower():
        signals.append({
            "signal": "C2PA Provenance Markers", 
            "present": True,
            "details": {
                "method": "Binary signature scan (First 1MB)",
                "finding": "C2PA or JUMB markers located in binary structure.",
                "interpretation": "The file contains a provenance structure.",
                "confidence_type": "Heuristic indicator / Unvalidated Assert",
                "limitation": "Cryptographic validation of the manifest signature is NOT implemented. This does NOT prove authenticity or origin."
            }
        })
        
    if mime_type.startswith("video/"):
        if metadata and metadata.get("codec") == "mp4v":
            signals.append({
                "signal": "Legacy MP4V Codec", 
                "present": True,
                "details": {
                    "method": "OpenCV VideoCapture FOURCC",
                    "finding": "Codec identified as mp4v.",
                    "interpretation": "Anomalous for modern media creation tools.",
                    "confidence_type": "Heuristic indicator",
                    "limitation": "Codec alone is not proof of manipulation or synthesis."
                }
            })
            
    if not signals and not mime_type.startswith("image/"):
        filename = os.path.basename(file_path).lower()
        if "manipulated" in filename or "synthetic" in filename:
            signals.append({
                "signal": "Filename heuristic flag", 
                "present": True,
                "details": {
                    "method": "String match on filename",
                    "finding": f"Filename contains suspicious keywords",
                    "interpretation": "Author self-reported manipulation via filename.",
                    "confidence_type": "Heuristic indicator",
                    "limitation": "Trivial to spoof or alter."
                }
            })
            
    return json.dumps({
        "status": "ACTIVE",
        "signals": signals if signals else []
    })
