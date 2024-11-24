import { FormEvent, useContext, useEffect, useState } from 'react'
import { useKeyPressEvent } from 'react-use'
import style from './style.module.scss'
import { HeartStraight, MagnifyingGlass } from '@phosphor-icons/react'
import Button from '../../components/Button'
import LoadingSpin from "react-loading-spin";
import { format } from 'date-fns'
import { api } from '../../api/axios'
import { Rating, ThinRoundedStar } from '@smastrom/react-rating';
import Header from '../../components/Header'
import NavActivityUser from '../../components/NavActivityUser'
import Modal from '../../components/Modal'
import { AuthContext } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

type TrailersProps = {
  id: number
  title: string
  description: string
  genre: number
  releaseDate: string
  trailerUrl: string
  averageRating: number
  productionCompany: string
}

export default function Home() {

  const [ openNewEvent, setOpenNewEvent ] = useState(false)
  const [ trailers, setTrailers ] = useState<TrailersProps[]>([])
  const { isAuthenticated } = useContext(AuthContext)
  const [ current, setCurrent ] = useState<TrailersProps>({} as any);
  const [ isLoading, setIsLoading ] = useState(true)
  const [ isLoadingRatingMovie, setIsLoadingRatingMovie ] = useState(false)
  const [ typeSelect, setTypeSelect ] = useState("genre")
  const [ currentSelect, setCurrentSelect ] = useState("")
  const [ rating, setRating ] = useState(0)

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

  async function handleRatingMovie(id : number) {
    setIsLoadingRatingMovie(true)
    if (rating === 0) {
      toast.error("Select a rating to rate the movie.",)
      setIsLoadingRatingMovie(false)
      return
    }
    try {
      alert(rating)
      await api.post(`UserActivity/${id}/rate`, { params: { rating } })
      toast.success("Movie retad " + rating + "⭐")
      setRating(0)
      setOpenNewEvent(false)
      setIsLoadingRatingMovie(false)
      return
    } catch {
      toast.error("Error rating movie.",)
      setRating(0)
      setOpenNewEvent(false)
      setIsLoadingRatingMovie(false)
      return
    }
  }

  async function handleFavoriteMovie(id : number) {
    try {
      await api.post(`UserActivity/favorites/${id}`)
      toast.success("Add favorite movie!")
      return
    } catch {
      toast.error("Error add favorite movie.",)
      return
    }
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
              <Button text='Voltar' type='button' disabled={isLoading || trailers.indexOf(current) === 0 ? true : false} onClick={handlePrevius}/>
              <div className={style.movie}> 
                {
                  !isLoading ? (
                    <>
                      <iframe src={parseUrlYouTube(current.trailerUrl)} frameBorder={0} />
                      <div className={style.movieInfo}> 
                        <div className={style.movieInfoRating}>
                          <div className={style.nameYearInfo}>
                              <div className={style.nameYear}>
                                <h3>{current.title}</h3>
                                <span>({format(date, 'yyyy')})</span>
                              </div>
                              <div className={style.catCompany}>
                                <strong>[ {parseGenre(current.genre)} ]</strong>
                                <span>{current.productionCompany}</span>
                              </div>
                          </div>
                          <div className={style.ratingFav}>
                            <div className={style.rating}>
                              { 
                                isAuthenticated && (
                                <>
                                  <Button text='Rate' onClick={() => setOpenNewEvent(true)} disabled={isLoadingRatingMovie} />
                                  <Modal onClick={() => setOpenNewEvent(!openNewEvent)} isOpen={openNewEvent} title='Rating Movie'>
                                    <div className={style.modal}>
                                      <Rating value={rating} onChange={setRating} style={{ maxWidth: 150 }} itemStyles={{ itemShapes: ThinRoundedStar, activeFillColor: '#cf9502', inactiveFillColor: '#c0beae'  }}/>
                                      <Button text='Rate' onClick={() => handleRatingMovie(current.id)} disabled={isLoadingRatingMovie} />
                                    </div>
                                  </Modal>
                                </>
                                )
                              }
                              <Rating value={current.averageRating} style={{ maxWidth: 110 }} readOnly itemStyles={{ itemShapes: ThinRoundedStar, activeFillColor: '#cf9502', inactiveFillColor: '#c0beae'  }}/>
                              { 
                                isAuthenticated && (
                                  <button onClick={() => handleFavoriteMovie(current.id)}>
                                    <HeartStraight className={style.fav} size={25} />
                                  </button>
                                )
                              }
                            </div>
                          </div>
                        </div>
                        <p>{current.description}</p>
                      </div>
                    </>
                  ) : (
                    <div className='loading'>
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