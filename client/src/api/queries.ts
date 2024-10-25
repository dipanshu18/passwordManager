import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const BASE_URL = "http://localhost:8080/api/v1";

export async function getPasswords() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${BASE_URL}/passwords`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = response.data.passwords;
      return data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function decryptPassword(id: string) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/passwords/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.data.password;

      return data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;

      toast.error(errorData);
    }
  }
}
