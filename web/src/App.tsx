import { Toaster } from 'react-hot-toast'
import Router from './router'

function App() {
  return (
    <>
      <Router />
      <div><Toaster position="top-center" reverseOrder={false} /></div>
    </>
  )
}

export default App
