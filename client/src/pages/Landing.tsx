import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-overlay bg-base-200"></div>
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Password Manager</h1>
          <p className="mb-5">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <Link to="/signup">
            <button className="btn btn-primary text-white">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
