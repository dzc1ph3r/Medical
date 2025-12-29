import axios from "axios";

export const getDoctors = async (filters: any) => {
  return axios.get("http://localhost:5000/api/doctors", { params: filters });
};

export const getDoctorById = async (id: string) => {
  return axios.get(`http://localhost:5000/api/doctors/${id}`);
};
