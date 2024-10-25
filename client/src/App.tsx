import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function isAuthenticated() {
  const token = localStorage.getItem("token");

  return token ? true : false;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: isAuthenticated() ? <Navigate to="/home" replace /> : <Landing />,
    index: true,
  },
  {
    path: "/signup",
    element: isAuthenticated() ? <Navigate to="/home" replace /> : <Signup />,
  },
  {
    path: "/login",
    element: isAuthenticated() ? <Navigate to="/home" replace /> : <Login />,
  },
  {
    element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
