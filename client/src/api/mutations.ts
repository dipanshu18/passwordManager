import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const BASE_URL = "http://localhost:8080/api/v1";

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

      localStorage.setItem("token", JSON.stringify(data.token));
      toast.success(data.msg);
      window.location.reload();
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
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

      localStorage.setItem("token", JSON.stringify(data.token));
      toast.success(data.msg);
      window.location.reload();
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
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
    const token = localStorage.getItem("token");

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

      toast.success(data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function deletePassword(id: string) {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(`${BASE_URL}/passwords/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.data.msg;

      toast.success(data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}
