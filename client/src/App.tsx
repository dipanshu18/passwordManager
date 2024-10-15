import { type FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast, Toaster } from "sonner";
import PasswordRow from "./PasswordRow";

export default function App() {
  const [passwordList, setPasswordList] = useState<
    { _id: string; title: string; password: string }[]
  >([]);

  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");

  async function fetchPasswords() {
    try {
      const response = await axios.get("http://localhost:8080/passwords");

      if (response.status === 200) {
        const data = await response.data.passwords;
        setPasswordList(data);
      }
    } catch (error) {
      console.log("Error:", error);

      if (error instanceof AxiosError) {
        const errorData = await error.response?.data.msg;
        toast.error(errorData);
      }
    }
  }

  useEffect(() => {
    fetchPasswords();
  }, []);

  async function handleAddPassword(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/passwords", {
        password,
        title,
      });

      if (response.status === 201) {
        const data = await response.data;

        toast.success(data.msg);

        setPassword("");
        setTitle("");

        fetchPasswords();
      }
    } catch (error) {
      console.log("Error:", error);

      if (error instanceof AxiosError) {
        const errorData = await error.response?.data.msg;

        toast.error(errorData);
      }
    }
  }

  return (
    <main className="max-w-4xl mx-auto grid grid-cols-2 place-items-center">
      <div className="hero my-10">
        <div className="hero-content">
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={handleAddPassword}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="text"
                  placeholder="password"
                  className="input input-bordered"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="title"
                  className="input input-bordered"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-secondary" type="submit">
                  Add password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-[400px]">
        <div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {passwordList.length > 0 ? (
                  passwordList.map((password, idx) => (
                    <PasswordRow idx={idx} password={password} />
                  ))
                ) : (
                  <>
                    <h1 className="font-bold mt-5">No passwords added yet</h1>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Toaster richColors />
    </main>
  );
}
