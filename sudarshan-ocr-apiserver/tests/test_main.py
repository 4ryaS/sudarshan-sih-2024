from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 404  # Since no root endpoint is defined

def test_extract_details():
    with open("tests/sample_aadhaar.jpg", "rb") as img:
        response = client.post(
            "/extract-details/",
            files={"file": ("sample_aadhaar.jpg", img, "image/jpeg")}
        )
    assert response.status_code == 200
    json_response = response.json()
    assert "name" in json_response
    assert "date_of_birth" in json_response
    assert "gender" in json_response
    assert "aadhaar_number" in json_response
