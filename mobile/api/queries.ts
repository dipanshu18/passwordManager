import { getValueFor } from "@/utils/secureStore";
import axios, { AxiosError } from "axios";

const BASE_URL = "http://192.168.0.148:8080/api/v1";

export async function getPasswords() {
  try {
    const token = await getValueFor("token");

    if (!token) {
      return { msg: "Please login!" };
    }

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
      console.log(errorData);
    }
  }
}

export async function decryptPassword(id: string) {
  try {
    const token = await getValueFor("token");

    if (!token) {
      return { msg: "Please login!" };
    }

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

      console.log(errorData);
    }
  }
}
