import style from './style.module.scss'
import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'


export default function NavActivityUser() {
  
  const { isAuthenticated } = useContext(AuthContext)
  const nav = useNavigate()
  const { pathname } = useLocation();

  function handleCheckAuth(to : string) {
    if (isAuthenticated) {
      nav(to)
    }
    else {
      toast.error("You need to be logged in",
        {
          style: {
            borderRadius: '4px',
            background: '#333',
            color: '#fff',
          }
        }
      )
    }
  }

  return (
    <nav id={style.navActivityUser}>
      <ul>
        <li>
          <button onClick={() => nav("/")} className={pathname === "/" ? style.isActive : style.x}>Home</button>
        </li>
        <li>
          <button onClick={() => handleCheckAuth("/favorites")} className={pathname === "/favorites" ? style.isActive : style.x}>Favorites</button> 
        </li>
        <li>
          <button onClick={() => handleCheckAuth("/watchlist")} className={pathname === "/watchlist" ? style.isActive : style.x}>Watchlist</button>
        </li>
        <li>
          <button onClick={() => handleCheckAuth("/watchedMovies")} className={pathname === "/watchedMovies" ? style.isActive : style.x}>Watched Movies</button>
        </li>
        <li>
          <button onClick={() => handleCheckAuth("/ratedMovies")} className={pathname === "/ratedMovies" ? style.isActive : style.x}>Rated Movies</button>
        </li>
      </ul>
    </nav>
  )
}