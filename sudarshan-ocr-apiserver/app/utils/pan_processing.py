import cv2
import pytesseract
import re
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

def clean_extracted_text(text):
    """
    Cleans up the extracted text by removing noise and correcting common OCR errors.
    """
    # Remove unnecessary special characters and symbols
    text = text.replace("‘", "").replace("’", "").replace("|", "").replace(":", "").strip()
    
    # Replace common OCR misinterpretations
    text = text.replace("Permanent Accounl", "Permanent Account")
    text = text.replace("Name", "Name")
    text = text.replace("Father's Namo", "Father's Name")
    
    # Remove extra spaces and newlines
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    
    return lines

def process_pan_image(img_path):
    """
    Processes the PAN card image and extracts details like name, father's name, DOB, and PAN number.

    Args:
        img_path (str): Path to the PAN card image.

    Returns:
        dict: Extracted details from the PAN card.
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

    # Define the Region of Interest (ROI) for cropping
    x, y, w, h = 30, 195, 650, 450
    cropped_img = img[y:y+h, x:x+w]

    # Convert the cropped image to grayscale
    gray_img = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2GRAY)

    # Apply sharpening and thresholding to enhance the image
    sharpening_kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
    sharpened_img = cv2.filter2D(gray_img, -1, sharpening_kernel)
    _, threshold_img = cv2.threshold(sharpened_img, 105, 255, cv2.THRESH_BINARY)

    # Extract text using pytesseract
    extracted_text = pytesseract.image_to_string(threshold_img, lang='eng')

    # Clean the extracted text
    lines = clean_extracted_text(extracted_text)
    print("Cleaned Lines:", lines)

    # Define regex patterns
    name_pattern = re.compile(r'(?:Name|ara Name)\s*(.*)', re.IGNORECASE)
    father_name_pattern = re.compile(r"(?:Father's Name|Father's Namo)\s*(.*)", re.IGNORECASE)
    dob_pattern = re.compile(r'(\d{4}-\d{2}-\d{2})')  # Looks for YYYY-MM-DD format
    pan_pattern = re.compile(r'([A-Z]{5}\d{4}[A-Z])')  # PAN format (ABCDE1234F)

    # Initialize result dictionary
    result = {
        "name": "Name not found",
        "father_name": "Father's Name not found",
        "date_of_birth": "DOB not found",
        "pan_number": "PAN Number not found"
    }

    result["pan_number"] = lines[1]
    result["name"] = lines[3]
    result["father_name"] = lines[5]
    
    # result["date_of_birth"] = lines[7]

    dob_match = dob_pattern.search(lines[7])
    clean_dob = dob_match.group(1)
    result["date_of_birth"] = clean_dob

    # # Extract details using regex
    # for line in lines:
    #     if not result["pan_number"]:
    #         pan_match = pan_pattern.search(line)
    #         if pan_match:
    #             result["pan_number"] = lines[1]
        
    #     if not result["name"]:
    #         name_match = name_pattern.search(line)
    #         if name_match:
    #             result["name"] = name_match.group(1)
        
    #     if not result["father_name"]:
    #         father_name_match = father_name_pattern.search(line)
    #         if father_name_match:
    #             result["father_name"] = father_name_match.group(1)
        
    #     if not result["date_of_birth"]:
    #         dob_match = dob_pattern.search(line)
    #         if dob_match:
    #             result["date_of_birth"] = dob_match.group(1)

    return result
