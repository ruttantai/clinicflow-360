from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="ClinicFlow 360 API", version="0.1.0")


class AppointmentIn(BaseModel):
    patient_name: str
    doctor_name: str
    starts_at: datetime


class Appointment(AppointmentIn):
    id: int
    status: str


appointments: list[Appointment] = []


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/appointments", response_model=list[Appointment])
def list_appointments() -> list[Appointment]:
    return appointments


@app.post("/appointments", response_model=Appointment)
def create_appointment(payload: AppointmentIn) -> Appointment:
    item = Appointment(id=len(appointments) + 1, status="scheduled", **payload.model_dump())
    appointments.append(item)
    return item


@app.post("/appointments/{appointment_id}/complete", response_model=Appointment)
def complete_appointment(appointment_id: int) -> Appointment:
    for item in appointments:
        if item.id == appointment_id:
            item.status = "completed"
            return item
    raise HTTPException(status_code=404, detail="Appointment not found")
