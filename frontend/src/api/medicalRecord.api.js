var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
const API = "http://localhost:5000/api";
export const uploadMedicalRecord = (token, payload) => {
    const formData = new FormData();
    formData.append("doctorId", payload.doctorId);
    if (payload.notes)
        formData.append("notes", payload.notes);
    formData.append("file", payload.file);
    return axios.post(`${API}/medical-records`, formData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
export const getMyMedicalRecords = (token) => axios.get(`${API}/medical-records/me`, {
    headers: { Authorization: `Bearer ${token}` },
});
export const getDoctorMedicalRecords = (token) => axios.get(`${API}/medical-records/doctor/me`, {
    headers: { Authorization: `Bearer ${token}` },
});
export const getMedicalRecordFile = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios.get(`${API}/medical-records/${id}/file`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
    });
    return res.data;
});
export const deleteMedicalRecord = (token, id) => axios.delete(`${API}/medical-records/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
});
