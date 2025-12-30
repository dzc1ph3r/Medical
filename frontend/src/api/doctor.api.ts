import axios from "axios";

type DoctorFilters = {
  specialty?: string;
  wilaya?: string;
  city?: string;
};

export const getDoctors = async (filters: DoctorFilters) => {
  return axios.get("https://medical-1-xoci.onrender.com/api/doctors", { params: filters });
};

export const getDoctorById = async (id: string) => {
  return axios.get(`https://medical-1-xoci.onrender.com/api/doctors/${id}`);
};
