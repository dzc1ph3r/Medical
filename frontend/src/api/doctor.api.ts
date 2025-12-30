import axios from "axios";

type DoctorFilters = {
  specialty?: string;
  wilaya?: string;
  city?: string;
};

export const getDoctors = async (filters: DoctorFilters) => {
  return axios.get("http://localhost:5000/api/doctors", { params: filters });
};

export const getDoctorById = async (id: string) => {
  return axios.get(`http://localhost:5000/api/doctors/${id}`);
};
