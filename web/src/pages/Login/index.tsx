import Header from '../../components/Header'
import style from './style.module.scss'
import banner from './../../../public/banner.webp'
import Button from '../../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {

  const navigate = useNavigate()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const { signIn, isAuthenticated, user } = useContext(AuthContext)

  function handleSingIn(event: FormEvent) {
    event.preventDefault()
    if(email.trim() === '' || password.trim() === '') return
    setLoading(true)
    signIn({email, password}).then((x : any) => {
      toast.success(x,
        {
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
        })
      setLoading(false)
      navigate('/')
    }
  ).catch(x => { 
    setLoading(false)
    toast.error(x,
      {
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
        },
      })
  })

  }

  return (
    <>
      <Header login />
      <div id={style.login}>
        <div className={style.banner}>
          <img src={banner} alt="Baneer" />
        </div>
        <div className={style.content}>
          <form onSubmit={handleSingIn}>
            <h2>Access account</h2>
            <div className={style.inputs}>
              <div className={style.box}>
                <label htmlFor="email">Email</label>
                <input required id='email' type="text" placeholder='Enter your Email' value={email} onChange={x => setEmail(x.target.value)} />
              </div>
              <div className={style.box}>
                <label htmlFor="password">Password {isAuthenticated}</label>
                <div className={style.passwordInfo}>
                  <input required id='password' type="password" placeholder='Enter your Password' value={password} onChange={x => setPassword(x.target.value)} />
                  <Link to="/register">Forgot password</Link>
                </div>
              </div>
            </div>
            <Button type='submit' isPrimary={false} text='Enter' disabled={loading} />
          </form>
        </div>
      </div>
    </>
  )
}