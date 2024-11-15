import { ButtonHTMLAttributes, ReactNode } from 'react'
import style from './style.module.scss'

type ButtonProps =  ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string
  isPrimary?: boolean 
  children?: ReactNode
}

export default function Button({ text, isPrimary = true, children, ...rest } : ButtonProps) {

  return (
    <button id={style.button} {...rest} className={isPrimary ? style.x : style.notPrimary}>
      {children}
      <span>{text}</span>
    </button>
  )
}