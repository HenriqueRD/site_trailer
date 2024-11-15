import { MagnifyingGlass } from '@phosphor-icons/react'
import style from './style.module.scss'
import { FormEvent, useContext, useState } from 'react'
import Button from '../Button'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

type HeaderProps = {
  login?: boolean
  searchTitle?: (title: string) => void
}

export default function Header({ login = false, searchTitle } : HeaderProps) {
  const [ title, setTitle ] = useState('')
  const { isAuthenticated, user } = useContext(AuthContext)

  function handleForm(event : FormEvent) {
    event.preventDefault()
    if (title.trim()) {
      if (searchTitle) {
        searchTitle(title)
      }
    }
  }

  return (
    <header id={style.header}>
      <div className="container">
        <div className={style.content}>
          <div className={style.logoForm}>
            <Link to="/">
              <h2>T_TRACker</h2>
            </Link>
            {
              !login &&
              <form onSubmit={handleForm}>
                <input type="text" placeholder='Search a title' onChange={(x) => setTitle(x.target.value)}/>
                <button><MagnifyingGlass size={20} weight='bold'/></button>
              </form>
            }
          </div>
          {
            login ? (
              <Link to="/register">
                <Button isPrimary={false} text='Register'/>
              </Link>
            ) : (
              isAuthenticated ? (
                <strong>{user.username}</strong>
              ) : (
                <Link to="/login">
                  <Button isPrimary={false} text='Login'/>
                </Link>
              )
            )
          }
        </div>
      </div>
    </header>
  )
}