import { BrowserRouter, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import CreateAcount from "./pages/CreateAcount";
import { useContext } from "react";
import toast from "react-hot-toast";
import UserFavorites from "./pages/UserFavorites";
import UserWatchlist from "./pages/UserWatchlist";
import UserWatched from "./pages/UserWatched";
import UserRated from "./pages/UserRated";

function RoutesAuth() {
  const { isAuthenticated } = useContext(AuthContext)
  const nav = useNavigate()

  if (!isAuthenticated) {
    toast.error("Access denied!", {
      style: {
        borderRadius: '4px',
        background: '#333',
        color: '#fff',
      },
    });
    nav("/")
    return
  }
  return <Outlet />
}

export default function Router() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={CreateAcount} />
          <Route Component={RoutesAuth}>
            <Route path="/favorites" Component={UserFavorites} />
            <Route path="/watchlist" Component={UserWatchlist} />
            <Route path="/watchedMovies" Component={UserWatched} />
            <Route path="/ratedMovies" Component={UserRated} />
          </Route>         
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}