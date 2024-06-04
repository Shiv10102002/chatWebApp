import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { useAuth } from "./context/authcontext.jsx";
import Chat from "./pages/Chat.jsx";

const App = () => {
  // Extracting 'token' and 'user' from the authentication context
  const { token, user } = useAuth();

  return (
    <Routes>
      {/* Root route: Redirects to chat if the user is logged in, else to the login page */}
      <Route
        path="/"
        element={
          token && user?._id
            ? (console.log("token is ", token), (<Navigate to="/chat" />))
            : (console.log("token of id does not exist"),
              (<Navigate to="/login" />))
        }
      ></Route>

      {/* Private chat route: Can only be accessed by authenticated users */}
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />

      {/* Public login route: Accessible by everyone */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Public register route: Accessible by everyone */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Wildcard route for undefined paths. Shows a 404 error */}
      <Route path="*" element={<p>404 Not found</p>} />
    </Routes>
  );
};

// Exporting the App component to be used in other parts of the application
export default App;
