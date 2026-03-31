"""Tests for ClinicFlow 360 API."""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
import sys
from pathlib import Path

# Add src/backend to path
backend_path = Path(__file__).parent.parent / "src" / "backend"
sys.path.insert(0, str(backend_path))

from main import app

client = TestClient(app)


@pytest.fixture
def sample_appointment():
    """Fixture with sample appointment data."""
    return {
        "patient_name": "John Doe",
        "doctor_name": "Dr. Smith",
        "starts_at": (datetime.now() + timedelta(hours=1)).isoformat(),
    }


def test_health_endpoint():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_appointments_empty():
    """Test listing appointments when none exist."""
    response = client.get("/appointments")
    assert response.status_code == 200
    assert response.json() == []


def test_create_appointment(sample_appointment):
    """Test creating a new appointment."""
    response = client.post("/appointments", json=sample_appointment)
    assert response.status_code == 200
    
    data = response.json()
    assert data["patient_name"] == sample_appointment["patient_name"]
    assert data["doctor_name"] == sample_appointment["doctor_name"]
    assert data["status"] == "scheduled"
    assert data["id"] == 1


def test_list_appointments_after_create(sample_appointment):
    """Test listing appointments after creating one."""
    # Create an appointment
    create_response = client.post("/appointments", json=sample_appointment)
    assert create_response.status_code == 200

    # List appointments
    list_response = client.get("/appointments")
    assert list_response.status_code == 200
    
    appointments = list_response.json()
    assert len(appointments) > 0
    assert any(a["patient_name"] == sample_appointment["patient_name"] 
               for a in appointments)


def test_complete_appointment(sample_appointment):
    """Test completing an appointment."""
    # Create an appointment
    create_response = client.post("/appointments", json=sample_appointment)
    appointment_id = create_response.json()["id"]

    # Complete the appointment
    complete_response = client.post(f"/appointments/{appointment_id}/complete")
    assert complete_response.status_code == 200
    
    data = complete_response.json()
    assert data["status"] == "completed"
    assert data["id"] == appointment_id


def test_complete_nonexistent_appointment():
    """Test completing a non-existent appointment."""
    response = client.post("/appointments/9999/complete")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_appointment_response_model(sample_appointment):
    """Test that appointment response includes all required fields."""
    response = client.post("/appointments", json=sample_appointment)
    assert response.status_code == 200
    
    data = response.json()
    required_fields = ["id", "patient_name", "doctor_name", "starts_at", "status"]
    for field in required_fields:
        assert field in data, f"Missing required field: {field}"
