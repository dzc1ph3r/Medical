import { useMemo, useState } from "react";
import type { DragEvent } from "react";

type DoctorOption = {
  id: string;
  name: string;
  specialty?: string;
};

type UploadMedicalRecordProps = {
  token: string;
  doctors: DoctorOption[];
  onUploadSuccess?: () => void;
};

const buildDoctorLabel = (doctor: DoctorOption) =>
  doctor.specialty ? `${doctor.name} (${doctor.specialty})` : doctor.name;

export default function UploadMedicalRecord({
  token,
  doctors,
  onUploadSuccess
}: UploadMedicalRecordProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const doctorOptions = useMemo(() => doctors, [doctors]);

  const resetStatus = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    resetStatus();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !doctorId) {
      setStatus("error");
      setErrorMessage("Ajoutez un fichier et sélectionnez un médecin.");
      return;
    }

    try {
      setStatus("uploading");
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("doctorId", doctorId);
      if (notes) formData.append("notes", notes);

      const response = await fetch("http://localhost:5000/api/medical-records", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setStatus("success");
      setSelectedFile(null);
      setNotes("");
      onUploadSuccess?.();
    } catch (error) {
      setStatus("error");
      setErrorMessage("Impossible d'envoyer le dossier. Réessaie.");
    }
  };

  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 20,
        background: "#fff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)"
      }}
    >
      <h3 style={{ marginTop: 0 }}>Envoyer un dossier médical</h3>
      <p style={{ color: "#475569", marginTop: 4 }}>
        Glisse-dépose un document ou sélectionne un fichier pour le partager avec ton
        médecin.
      </p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? "#3b82f6" : "#cbd5f5"}`,
          borderRadius: 12,
          padding: "24px 16px",
          textAlign: "center",
          background: dragActive ? "rgba(59, 130, 246, 0.08)" : "#f8fafc"
        }}
      >
        <input
          id="medical-upload"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
          }}
          style={{ display: "none" }}
        />
        <label htmlFor="medical-upload" style={{ cursor: "pointer" }}>
          <strong style={{ color: "#1d4ed8" }}>Clique pour choisir</strong> ou
          dépose le fichier ici
        </label>
        {selectedFile && (
          <p style={{ marginTop: 12, color: "#0f172a" }}>{selectedFile.name}</p>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 16,
          gridTemplateColumns: "minmax(180px, 1fr) 2fr"
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Médecin cible</span>
          <select
            value={doctorId}
            onChange={(event) => {
              setDoctorId(event.target.value);
              resetStatus();
            }}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #cbd5f5"
            }}
          >
            <option value="">Sélectionne un médecin</option>
            {doctorOptions.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {buildDoctorLabel(doctor)}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Notes (optionnel)</span>
          <textarea
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
              resetStatus();
            }}
            rows={3}
            placeholder="Résumé ou contexte du document"
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #cbd5f5",
              resize: "vertical"
            }}
          />
        </label>
      </div>

      {status === "error" && (
        <p style={{ color: "#b91c1c", marginTop: 12 }}>{errorMessage}</p>
      )}
      {status === "success" && (
        <p style={{ color: "#15803d", marginTop: 12 }}>
          Dossier envoyé avec succès.
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "uploading"}
        style={{
          marginTop: 16,
          padding: "12px 18px",
          borderRadius: 10,
          border: "none",
          background: status === "uploading" ? "#94a3b8" : "#2563eb",
          color: "#fff",
          fontWeight: 600,
          cursor: status === "uploading" ? "not-allowed" : "pointer"
        }}
      >
        {status === "uploading" ? "Envoi en cours..." : "Envoyer le dossier"}
      </button>
    </section>
  );
}
