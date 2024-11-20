import Header from '../../components/Header'
import style from './style.module.scss'
import banner from './../../../public/banner.webp'
import Button from '../../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'

export default function CreateAcount() {

  const nav = useNavigate()
  const [ email, setEmail ] = useState('')
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)

  function handleCreateAcount(event: FormEvent) {
    setLoading(false)
    event.preventDefault()
    if(email.trim() === '' || password.trim() === '') return
    nav("/login")
  }

  return (
    <>
      <Header login />
      <div id={style.createAcount}>
        <div className={style.banner}>
          <img src={banner} alt="Baneer" />
        </div>
        <div className={style.content}>
          <form onSubmit={handleCreateAcount}>
            <div className={style.headerForm}>
              <Link title='Back to Login' to="/login"><ArrowLeft size={24} weight='bold' /></Link>
              <h2>Create Acount</h2>
            </div>
            <div className={style.inputs}>
              <div className={style.box}>
                <label htmlFor="username">Username*</label>
                <input required id='username' type="text" placeholder='Enter your Username' value={username} onChange={x => setUsername(x.target.value)} />
              </div>
              <div className={style.box}>
                <label htmlFor="email">Email*</label>
                <input required id='email' type="text" placeholder='Enter your Email' value={email} onChange={x => setEmail(x.target.value)} />
              </div>
              <div className={style.box}>
                <label htmlFor="password">Password*</label>
                <div className={style.passwordInfo}>
                  <input required id='password' type="password" placeholder='Enter your Password' value={password} onChange={x => setPassword(x.target.value)} />
                  <span>required: number, uppercase, lowercase, character special</span>
                </div>
              </div>
            </div>
            <Button type='submit' isPrimary={false} text='Create' disabled={loading} />
          </form>
        </div>
      </div>
    </>
  )
}