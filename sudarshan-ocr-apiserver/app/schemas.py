from pydantic import BaseModel

class AadhaarDetails(BaseModel):
    name: str
    date_of_birth: str
    gender: str
    aadhaar_number: str
