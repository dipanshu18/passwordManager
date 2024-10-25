import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-overlay bg-base-200"></div>
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Password Manager</h1>
          <p className="mb-5">
            A secure and easy-to-use tool designed to help you store and manage
            your passwords for different platforms. The app ensures that your
            passwords are safely encrypted and easily retrievable.
          </p>
          <Link to="/signup">
            <button className="btn btn-primary text-white">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
