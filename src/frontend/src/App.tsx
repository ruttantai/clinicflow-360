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
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:8000/appointments");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!patientName.trim() || !doctorName.trim() || !startsAt) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientName,
          doctor_name: doctorName,
          starts_at: startsAt,
        }),
      });

      if (!response.ok) throw new Error("Failed to create appointment");
      const newAppointment = await response.json();
      setItems([...items, newAppointment]);
      setPatientName("");
      setDoctorName("");
      setStartsAt("");
    } catch (err) {
      setError("Error creating appointment. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAppointment = async (appointmentId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/appointments/${appointmentId}/complete`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Failed to complete");
      const updated = await response.json();
      setItems(items.map((a) => (a.id === appointmentId ? updated : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const styles = {
    container: {
      fontFamily: "ui-sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
    },
    header: {
      marginBottom: "2rem",
      borderBottom: "2px solid #007bff",
      paddingBottom: "1rem",
    },
    form: {
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "8px",
      marginBottom: "2rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "bold",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "1rem",
      boxSizing: "border-box" as const,
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "0.75rem 1.5rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
    },
    completeBtn: {
      backgroundColor: "#28a745",
      color: "white",
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.875rem",
    },
    error: {
      color: "#dc3545",
      marginBottom: "1rem",
      padding: "0.75rem",
      backgroundColor: "#f8d7da",
      borderRadius: "4px",
    },
    appointmentsList: {
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    appointmentItem: {
      padding: "1rem",
      borderBottom: "1px solid #eee",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    appointmentText: {
      flex: 1,
    },
    statusBadge: (status: string) => ({
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.875rem",
      fontWeight: "bold",
      backgroundColor: status === "completed" ? "#d4edda" : "#e2e3e5",
      color: status === "completed" ? "#155724" : "#383d41",
      marginLeft: "0.5rem",
    }),
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1>ClinicFlow 360</h1>
        <p style={{ color: "#666", marginBottom: 0 }}>
          Clinic Operations Platform
        </p>
      </div>

      <form onSubmit={handleCreateAppointment} style={styles.form}>
        <h2>Create Appointment</h2>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Patient Name</label>
          <input
            type="text"
            style={styles.input}
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Doctor Name</label>
          <input
            type="text"
            style={styles.input}
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            placeholder="Enter doctor name"
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Appointment Time</label>
          <input
            type="datetime-local"
            style={styles.input}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Appointment"}
        </button>
      </form>

      <div>
        <h2>Upcoming Appointments ({items.length})</h2>
        {items.length === 0 ? (
          <p style={{ color: "#666", textAlign: "center" }}>
            No appointments scheduled
          </p>
        ) : (
          <div style={styles.appointmentsList}>
            {items.map((item) => (
              <div key={item.id} style={styles.appointmentItem}>
                <div style={styles.appointmentText}>
                  <strong>{item.patient_name}</strong> with Dr.{" "}
                  {item.doctor_name}
                  <div style={{ color: "#666", fontSize: "0.875rem" }}>
                    {new Date(item.starts_at).toLocaleString()}
                  </div>
                  <span style={styles.statusBadge(item.status)}>
                    {item.status}
                  </span>
                </div>
                {item.status === "scheduled" && (
                  <button
                    style={styles.completeBtn}
                    onClick={() => handleCompleteAppointment(item.id)}
                  >
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
