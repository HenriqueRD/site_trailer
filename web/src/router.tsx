import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";

export default function Router() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Login} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}