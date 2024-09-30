import cv2
import pytesseract
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
import re

def process_aadhaar_image(img_path):
    """
    Processes the Aadhaar card image and extracts details like name, DOB, gender, and Aadhaar number.

    Args:
        img_path (str): Path to the Aadhaar card image.

    Returns:
        dict: Extracted details from the Aadhaar card.
    """
    # Read and preprocess the image
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    h, w, c = img.shape
    if w > 1000:
        new_w = 1000
        ar = w / h
        new_h = int(new_w / ar)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

    x, y, w, h = 250, 120, 550, 410

    # Crop the image to the defined ROI
    roi = img[y:y+h, x:x+w]

    def thresholding(image):
        img_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        ret, thresh = cv2.threshold(img_gray, 120, 255, cv2.THRESH_BINARY)
        return thresh

    thresh_img = thresholding(roi)

    # Extract text using pytesseract
    text = pytesseract.image_to_string(thresh_img, lang='eng+guj')

    # Split text into lines
    lines = text.strip().split('\n')

    # Extract the name as the second line of the text
    name = lines[2].strip() if len(lines) > 2 else "Name not found"

    # Define regex patterns to identify DOB and other details
    dob_pattern = re.compile(r'DOB\s*:\s*(\d{2}/\d{2}/\d{4})')
    gender_pattern = re.compile(r'(Male|Female)', re.IGNORECASE)
    aadhar_pattern = re.compile(r'(\d{4}\s\d{4}\s\d{4})')

    # Extract DOB, Gender, and Aadhaar Number
    dob_match = dob_pattern.search(text)
    gender_match = gender_pattern.search(text)
    aadhar_match = aadhar_pattern.search(text)

    # Compile the results
    result = {
        "name": name,
        "date_of_birth": dob_match.group(1) if dob_match else "DOB not found",
        "gender": gender_match.group(1) if gender_match else "Gender not found",
        "aadhaar_number": aadhar_match.group(1) if aadhar_match else "Aadhaar Number not found"
    }

    return result
