import os
from PIL import Image
from PIL.ExifTags import TAGS
import cv2
import mutagen

def check_c2pa_signature(file_path: str):
    try:
        with open(file_path, 'rb') as f:
            data = f.read(1024 * 1024)
            if b'c2pa' in data.lower() or b'jumb' in data.lower():
                return "C2PA-related structure detected (Cryptographic validation unavailable)"
    except:
        pass
    return "No C2PA marker detected"

def extract_image_metadata(file_path: str):
    metadata = {}
    try:
        with Image.open(file_path) as img:
            metadata['format'] = img.format
            metadata['mode'] = img.mode
            metadata['size'] = img.size
            metadata['width'], metadata['height'] = img.size
            
            exifdata = img.getexif()
            if exifdata:
                exif_dict = {}
                for tag_id in exifdata:
                    tag = TAGS.get(tag_id, tag_id)
                    data = exifdata.get(tag_id)
                    if isinstance(data, bytes):
                        try:
                            data = data.decode()
                        except:
                            data = str(data)
                    exif_dict[tag] = str(data)
                metadata['exif'] = exif_dict
    except Exception as e:
        metadata['error'] = str(e)
    return metadata

def extract_video_metadata(file_path: str):
    metadata = {}
    try:
        cap = cv2.VideoCapture(file_path)
        if cap.isOpened():
            metadata['width'] = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            metadata['height'] = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            metadata['fps'] = cap.get(cv2.CAP_PROP_FPS)
            metadata['frame_count'] = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            if metadata['fps'] > 0:
                duration_sec = metadata['frame_count'] / metadata['fps']
                metadata['duration'] = f"{duration_sec:.2f} seconds"
                
            fourcc = int(cap.get(cv2.CAP_PROP_FOURCC))
            codec = "".join([chr((fourcc >> 8 * i) & 0xFF) for i in range(4)])
            metadata['codec'] = codec
            cap.release()
        else:
            metadata['error'] = "Could not open video file via cv2"
    except Exception as e:
        metadata['error'] = str(e)
    return metadata

def extract_audio_metadata(file_path: str):
    metadata = {}
    try:
        audio = mutagen.File(file_path)
        if audio is not None:
            if hasattr(audio, 'info'):
                metadata['length'] = f"{audio.info.length:.2f} seconds"
                metadata['bitrate'] = getattr(audio.info, 'bitrate', 'Unknown')
                metadata['sample_rate'] = getattr(audio.info, 'sample_rate', 'Unknown')
                metadata['channels'] = getattr(audio.info, 'channels', 'Unknown')
            if hasattr(audio, 'tags') and audio.tags:
                metadata['tags'] = {str(k): str(v) for k, v in audio.tags.items()}
    except Exception as e:
        metadata['error'] = str(e)
    return metadata

def extract_metadata(file_path: str, mime_type: str):
    c2pa_status = check_c2pa_signature(file_path)
    meta = {}
    if mime_type.startswith("image/"):
        meta = extract_image_metadata(file_path)
    elif mime_type.startswith("video/"):
        meta = extract_video_metadata(file_path)
    elif mime_type.startswith("audio/"):
        meta = extract_audio_metadata(file_path)
    else:
        meta = {"info": "Unsupported file type for metadata extraction"}
        
    meta["c2pa_status"] = c2pa_status
    return meta
