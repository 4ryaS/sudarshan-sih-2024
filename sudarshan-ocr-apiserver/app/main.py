from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import shutil
import os
from app.utils.image_processing import process_aadhaar_image
from app.utils.pan_processing import process_pan_image

app = FastAPI(
    title="Aadhaar Card Processing API",
    description="An API to extract details from Aadhaar card images.",
    version="1.0.0"
)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Sudarshan AI API"}



@app.post("/extract-details/")
async def extract_details(file: UploadFile = File(...)):
    """
    Endpoint to upload an Aadhaar card image and extract details.
    """
    try:
        # Save the uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process the image
        result = process_aadhaar_image(temp_file_path)

        # Remove the temporary file
        os.remove(temp_file_path)

        return JSONResponse(content=result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/extract-pan-details/")
async def extract_pan_details(file: UploadFile = File(...)):
    """
    Endpoint to upload a PAN card image and extract details.
    """
    try:
        # Save the uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process the PAN card image
        result = process_pan_image(temp_file_path)

        # Remove the temporary file
        os.remove(temp_file_path)

        return JSONResponse(content=result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Serverless handler
handler = Mangum(app)