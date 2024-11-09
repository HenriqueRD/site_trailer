import { ButtonHTMLAttributes, ReactNode } from 'react'
import style from './style.module.scss'

type ButtonProps =  ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string
  children?: ReactNode
}

export default function Button({ text, children, ...rest } : ButtonProps) {

  return (
    <button id={style.button} {...rest}>
      {children}
      <span>{text}</span>
    </button>
  )
}