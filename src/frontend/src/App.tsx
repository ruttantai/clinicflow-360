import { useEffect, useState } from "react";

type Appointment = {
  id: number;
  patient_name: string;
  doctor_name: string;
  starts_at: string;
  status: string;
};

export default function App() {
  const [items, setItems] = useState<Appointment[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/appointments")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <main style={{ fontFamily: "ui-sans-serif", margin: "2rem" }}>
      <h1>ClinicFlow 360</h1>
      <p>Upcoming appointments</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.patient_name} with Dr. {item.doctor_name} ({item.status})
          </li>
        ))}
      </ul>
    </main>
  );
}
