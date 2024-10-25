import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../api/mutations";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: () => login({ email, password }),
  });

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold mb-5">Login now!</h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="input input-bordered"
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
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="input input-bordered"
                required
              />
              <label className="label">
                <p className="label-text-alt">
                  Don{`'`}t have an account?{" "}
                  <Link to="/signup" className="underline">
                    Signup
                  </Link>
                </p>
              </label>
            </div>
            <div className="form-control mt-6">
              <button
                onClick={async (e) => {
                  e.preventDefault();

                  await loginMutation.mutateAsync();
                }}
                className="btn btn-primary text-white"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
