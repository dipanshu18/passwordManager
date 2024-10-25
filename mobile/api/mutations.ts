import { getValueFor, save } from "@/utils/secureStore";
import axios, { AxiosError } from "axios";
import { Alert } from "react-native";

const BASE_URL = "http://192.168.0.148:8080/api/v1";

export async function signup({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      email,
      password,
    });

    if (response.status === 201) {
      const data = (await response.data) as { msg: string; token: string };

      save("token", JSON.stringify(data.token));
      // alert(data.msg);
      Alert.alert("Signup sucess", data.msg);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      alert(errorData);
    }
  }
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    if (response.status === 200) {
      const data = (await response.data) as { msg: string; token: string };

      save("token", JSON.stringify(data.token));
      // alert(data.msg);
      Alert.alert("Login sucess", data.msg);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      // alert(errorData);
      Alert.alert("Error", errorData);
    }
  }
}

export async function addPassword({
  title,
  password,
}: {
  title: string;
  password: string;
}) {
  try {
    const token = await getValueFor("token");

    if (!token) {
      return { msg: "Please login!" };
    }

    const response = await axios.post(
      `${BASE_URL}/passwords`,
      {
        title,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      const data = await response.data.msg;

      // alert(data);
      Alert.alert("Sucess", data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      // alert(errorData);
      Alert.alert("Error", errorData);
    }
  }
}

export async function deletePassword(id: string) {
  try {
    const token = await getValueFor("token");

    if (!token) {
      return { msg: "Please login!" };
    }

    const response = await axios.delete(`${BASE_URL}/passwords/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.data.msg;

      // alert(data);
      Alert.alert("Success", data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      // alert(errorData);
      Alert.alert("Error", errorData);
    }
  }
}
