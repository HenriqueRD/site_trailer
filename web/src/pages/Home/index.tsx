import { FormEvent, useEffect, useState } from 'react'
import { useKeyPressEvent } from 'react-use'
import style from './style.module.scss'
import { MagnifyingGlass } from '@phosphor-icons/react'
import Button from '../../components/Button'
import LoadingSpin from "react-loading-spin";
import { format } from 'date-fns'
import { api } from '../../api/axios'

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
  const [ typeSelect, setTypeSelect ] = useState("all")
  const [ currentSelect, setCurrentSelect ] = useState("")

  const date = new Date(current.releaseDate || new Date())

  async function getTrailers() {
    await api.get("Movie/all-movies").then(x => setTrailers(x.data))
  }

  async function handleFindTrailers(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    if (typeSelect === "genre" && currentSelect !== "") {
      await api.get(`Movie/by-genre/${currentSelect}`).then(x => setTrailers(x.data)).then(() => setIsLoading(false))
    }
    else if (typeSelect === "year" && currentSelect !== "") {
      await api.get("Movie/by-year", { params: { year: currentSelect } }).then(x => setTrailers(x.data)).then(() => setIsLoading(false))
    }
    else if (typeSelect === "all") {
      getTrailers().then(() => setIsLoading(false))
    }
    
  }
  
  useEffect(() => {
    console.log('Chave de API:', JSON.stringify(import.meta.env.VITE_API_KEY));
    setIsLoading(true)
    getTrailers();
  }, []);

  useEffect(() => {
    if (trailers.length > 0) {
      setCurrent(trailers[0])
      setIsLoading(false)
    }
    console.log(current)

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

  function transformarEmEmbed(url : string) {
    if (current.trailerUrl) {
      const videoId1 = url.split(".be/")[1];
      if(videoId1) {
        return `https://www.youtube.com/embed/${videoId1}?&enablejsapi=0&amp;autoplay=1&amp;modestbranding=1&amp;controls=0&amp;showinfo=0&amp;rel=0&amp;hd=1&amp;wmode=transparent&amp;enablejsapi=0`;
      }
      const videoId2 = url.split("watch?v=")[1];
      if (videoId2) {
        return `https://www.youtube.com/embed/${videoId2}?&enablejsapi=0&amp;autoplay=1&amp;modestbranding=1&amp;controls=0&amp;showinfo=0&amp;rel=0&amp;hd=1&amp;wmode=transparent&amp;enablejsapi=0`;
      }
    }
  }

  return (
    <div id={style.home}>
      <div className='container'>
        <div className={style.content}>
          <div className={style.selectCategory}>
            <form onSubmit={handleFindTrailers}>
              <div>
                {
                  typeSelect === "genre" && (
                    <select value={currentSelect} onChange={x => setCurrentSelect(x.target.value)}>
                      <option value="-1">Select gender</option>
                      <option value="0">Audsssssi</option>
                      <option value="1">Audi</option>
                      <option value="2">BMW</option>
                      <option value="3">Citroen</option>
                      <option value="4">Ford</option>
                      <option value="5">Honda</option>
                      <option value="6">Jaguar</option>
                      <option value="7">Jaguar</option>
                    </select>
                  )
                }
                {
                  typeSelect === "year" && (
                    <input type="number" placeholder='Enter a year' value={currentSelect} onChange={x => setCurrentSelect(x.target.value)} />
                  )
                }
                {
                  typeSelect === "all" && (
                    <input disabled placeholder='All trailers'/>
                  )
                }
                <select className={style.selectType} value={typeSelect} onChange={x => {setTypeSelect(x.target.value), setCurrentSelect("") }}>
                  <option value="genre">Genre</option>
                  <option value="year">Year</option>
                  <option value="all">All</option>
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
                      <iframe src={transformarEmEmbed(current.trailerUrl)} frameBorder={0} />
                      <div className={style.movieInfo}> 
                        <div className={style.nameYear}>
                          <div>
                            <h3>{current.title}</h3>
                            <strong>{current.genre}</strong>
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