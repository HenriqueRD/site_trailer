import { MagnifyingGlass, Tilde } from '@phosphor-icons/react'
import style from './style.module.scss'
import { FormEvent, useState } from 'react'

type HeaderProps = {
  searchTitle: (title: string) => void
}

export default function Header({searchTitle} : HeaderProps) {
  const [ title, setTitle ] = useState('')

  function handleForm(event : FormEvent) {
    event.preventDefault()
    if (title.trim()) {
      searchTitle(title)
    }
  }

  return (
    <header id={style.header}>
      <div className="container">
        <div className={style.content}>
          <div className={style.logoForm}>
            <h2>T_TRACker</h2>
            <form onSubmit={handleForm}>
              <input type="text" placeholder='Search a title' onChange={(x) => setTitle(x.target.value)}/>
              <button><MagnifyingGlass size={20} weight='bold'/></button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}