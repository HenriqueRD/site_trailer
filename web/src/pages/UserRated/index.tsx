import { FormEvent, useEffect, useState } from 'react'
import style from './style.module.scss'
import { MagnifyingGlass } from '@phosphor-icons/react'
import Button from '../../components/Button'
import { api } from '../../api/axios'
import Header from '../../components/Header'
import NavActivityUser from '../../components/NavActivityUser'

type TrailersProps = {
  id: number
  title: string
  description: string
  genre: number
  releaseDate: string
  trailerUrl: string
}

export default function UserRated() {

  const [ trailers, setTrailers ] = useState<TrailersProps[]>([])
  const [ current, setCurrent ] = useState<TrailersProps>({} as any);
  const [ isLoading, setIsLoading ] = useState(true)
  const [ typeSelect, setTypeSelect ] = useState("genre")
  const [ currentSelect, setCurrentSelect ] = useState("")

  async function getTrailers() {
    await api.get("Movie/all-movies").then(x => setTrailers(x.data))
  }

  async function handleFindTrailers(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    if (typeSelect === "genre" && currentSelect === "-1") {
      getTrailers().catch(() => setIsLoading(false))
    }
    else if (typeSelect === "genre" && currentSelect !== "") {
      await api.get(`Movie/by-genre/${currentSelect}`).then(x => setTrailers(x.data)).catch(() => setIsLoading(false))
    }
    else if (typeSelect === "year" && currentSelect !== "") {
      await api.get("Movie/by-year", { params: { year: currentSelect } }).then(x => setTrailers(x.data)).catch(() => setIsLoading(false))
    }
  }
  
  useEffect(() => {
    setIsLoading(true)
    getTrailers();
  }, []);

  useEffect(() => {
    if (trailers.length > 0) {
      setCurrent(trailers[0])
      setIsLoading(false)
    }
  }, [trailers])
  

  function handleListTrailers(index : number) {
    isLoading
    setCurrent(trailers[index])
  }

  return (
    <div id={style.home}>
      <Header searchTitle={() => {}}/>
      <div className='container flex'>
        <div className={style.listTrailer}>
          <h3>All Rated</h3>
          <ul>
          {
            trailers.map(x => { 
              return(
                <li key={x.id}>
                  <button onClick={() => handleListTrailers(trailers.indexOf(x))} className={trailers.indexOf(x) === trailers.indexOf(current) ? style.isActive : style.x}>{x.title}</button>
                </li>
              )
            })
          }
          </ul>
        </div>
        <div className={style.content}>
          <NavActivityUser />
          <div className={style.selectCategory}>
            <form onSubmit={handleFindTrailers}>
              <div>
                {
                  typeSelect === "genre" && (
                    <select value={currentSelect} onChange={x => setCurrentSelect(x.target.value)}>
                      <option value="-1">All genre</option>
                      <option value="0">Action</option>
                      <option value="1">Adventure</option>
                      <option value="2">Comedy</option>
                      <option value="3">SciFi</option>
                      <option value="4">Thriller</option>
                      <option value="5">Romance</option>
                      <option value="6">Horror</option>
                      <option value="7">Drama</option>
                    </select>
                  )
                }
                {
                  typeSelect === "year" && (
                    <input type="number" placeholder='Enter a year' value={currentSelect} onChange={x => setCurrentSelect(x.target.value)} />
                  )
                }
                <select className={style.selectType} value={typeSelect} onChange={x => {setTypeSelect(x.target.value), setCurrentSelect("") }}>
                  <option value="genre">Genre</option>
                  <option value="year">Year</option>
                </select>
              </div>
              <Button type='submit' text='Find'><MagnifyingGlass size={20} /></Button>
            </form>
          </div>
          <div>  
            <div className={style.xxx}>
              <h1>Rated</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}