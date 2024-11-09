import { FormEvent, useEffect, useState } from 'react'
import { useKeyPressEvent } from 'react-use'
import style from './style.module.scss'
import { MagnifyingGlass } from '@phosphor-icons/react'
import Button from '../../components/Button'
import LoadingSpin from "react-loading-spin";
import { format } from 'date-fns'
import { api } from '../../api/axios'
import Header from '../../components/Header'

type TrailersProps = {
  id: number
  title: string
  description: string
  genre: number
  releaseDate: string
  trailerUrl: string
}

export default function Home() {

  const [ trailers, setTrailers ] = useState<TrailersProps[]>([])
  const [ current, setCurrent ] = useState<TrailersProps>({} as any);
  const [ isLoading, setIsLoading ] = useState(true)
  const [ typeSelect, setTypeSelect ] = useState("genre")
  const [ currentSelect, setCurrentSelect ] = useState("")

  const date = new Date(current.releaseDate || new Date())

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
  
  useKeyPressEvent('ArrowRight', handleNext)
  useKeyPressEvent('ArrowLeft', handlePrevius)

  function handlePrevius() {
    const index = trailers.indexOf(current)
    if(index == 0) {
      return
    }
    setCurrent(trailers[index-1])
  }

  function handleNext() {
    const index = trailers.indexOf(current)
    if(index >= trailers.length) {
      return
    }
    setCurrent(trailers[index+1])
  }

  function handleListTrailers(index : number) {
    setCurrent(trailers[index])
  }

  return (
    <div id={style.home}>
      <Header searchTitle={() => {}}/>
      <div className='container flex'>
        <div className={style.listTrailer}>
          <h3>All Trailers</h3>
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
              <Button text='Voltar' type='button' disabled={isLoading || trailers.indexOf(current) === 0 ? true : false} onClick={handlePrevius}/>
              <div className={style.movie}> 
                {
                  !isLoading ? (
                    <>
                      <iframe src={parseUrlYouTube(current.trailerUrl)} frameBorder={0} />
                      <div className={style.movieInfo}> 
                        <div className={style.nameYear}>
                          <div>
                            <h3>{current.title}</h3>
                            <strong>{parseGenre(current.genre)}</strong>
                          </div>
                          <span>({format(date, 'yyyy')})</span>
                        </div>
                          <p>{current.description}</p>
                      </div>
                    </>
                  ) : (
                    <div className={style.loading}>
                      <LoadingSpin size="60px" width="5px" primaryColor="#8D8D99" secondaryColor="#29292E"/>  
                    </div>                  
                  )
                }
              </div>
              <Button text='Próximo' type='button' disabled={isLoading || trailers.indexOf(current) === trailers.length-1 ? true : false} onClick={handleNext}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function parseUrlYouTube(url : string) {
    const videoId1 = url.split(".be/")[1];
    if(videoId1) {
      return `https://www.youtube.com/embed/${videoId1}?&enablejsapi=0&amp;autoplay=1&amp;modestbranding=1&amp;controls=0&amp;showinfo=0&amp;rel=0&amp;hd=1&amp;wmode=transparent&amp;enablejsapi=0`;
    }
    const videoId2 = url.split("watch?v=")[1];
    if (videoId2) {
      return `https://www.youtube.com/embed/${videoId2}?&enablejsapi=0&amp;autoplay=1&amp;modestbranding=1&amp;controls=0&amp;showinfo=0&amp;rel=0&amp;hd=1&amp;wmode=transparent&amp;enablejsapi=0`;
    }
}

function parseGenre(id: number) {
  if (id === 0) return "Action"
  else if (id === 1) return "Adventure"
  else if (id === 2) return "Comedy"
  else if (id === 3) return "SciFi"
  else if (id === 4) return "Thriller"
  else if (id === 5) return "Romance"
  else if (id === 6) return "Horror"
  else if (id === 7) return "Drama"
}