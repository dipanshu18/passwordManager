import { useState } from "react";
import { PasswordRow } from "../components/PasswordRow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPasswords } from "../api/queries";
import { addPassword } from "../api/mutations";
import { IPassword } from "../api/types";

export function Home() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");

  const { data, isLoading } = useQuery<IPassword[]>({
    queryKey: ["passwords"],
    queryFn: getPasswords,
  });

  const addPasswordMutation = useMutation({
    mutationKey: ["addPassword"],
    mutationFn: () => addPassword({ title, password }),
    onSuccess: () => {
      setPassword("");
      setTitle("");
      queryClient.invalidateQueries({
        queryKey: ["passwords"],
      });
    },
  });

  if (isLoading) {
    return;
  }

  return (
    <>
      <div className="flex w-full justify-end p-5">
        <button
          onClick={(e) => {
            e.preventDefault();

            localStorage.removeItem("token");

            window.location.reload();
          }}
          className="btn btn-neutral text-white"
        >
          Logout
        </button>
      </div>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 place-items-center">
        <div className="hero my-10">
          <div className="hero-content">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
              <form className="card-body">
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
                <div className="form-control mt-6">
                  <button
                    onClick={async (e) => {
                      e.preventDefault();

                      await addPasswordMutation.mutateAsync();
                    }}
                    className="btn btn-primary text-white"
                    type="submit"
                  >
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
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data.map((password, idx) => (
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
      </main>
    </>
  );
}
