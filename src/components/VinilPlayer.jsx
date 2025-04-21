import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  CgPlayPause,
  CgPlayButton,
  CgPlayBackwards,
  CgPlayForwards,
} from 'react-icons/cg'

import './VinylPlayer.css'

const songs = [
  {
    title: 'I Wanna Be Sedated',
    src: '/audio/I_Wanna_Be_Sedated.mp3',
  },
  {
    title: 'The KKK Took My Baby Again',
    src: '/audio/The_KKK_Took_My_Baby_Away.mp3',
  },
  {
    title: 'Bonzo goes to Bitburg',
    src: '/audio/Bonzo_Goes_To_Bitburg.mp3',
  },
]

const VinylPlayer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [songIndex, setSongIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  const toggleVinyl = () => {
    const newState = !isOpen
    setIsOpen(newState)

    if (newState) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const nextSong = useCallback(() => {
    setSongIndex((prevIndex) => (prevIndex + 1) % songs.length)

    if (isOpen) {
      setTimeout(() => {
        audioRef.current?.play()
      }, 100)
    }
  }, [songs.length, isOpen])

  const prevSong = () => {
    setSongIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? songs?.length - 1 : prevIndex - 1
      if (isOpen) {
        setTimeout(() => {
          audioRef.current?.play()
        }, 100)
      }
      return newIndex
    })
  }

  useEffect(() => {
    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    const handleEnded = () => {
      if (isOpen) {
        nextSong()
      }
    }

    if (audio) {
      audio.addEventListener('ended', handleEnded)
    }

    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [isOpen, nextSong])

  return (
    <div className="main-container">
      <div className="vinyl-container">
        <div className="cover">
          <img src="/images/ramones_cd.png" alt="Carátula del vinilo" />
          <button onClick={toggleVinyl}>
            {isOpen ? (
              <CgPlayPause className="pause-icon" />
            ) : (
              <CgPlayButton className="play-icon" />
            )}
          </button>
        </div>
        <div className={`vinyl ${isOpen ? 'open' : ''}`}>
          <img src="/images/blank-viny.png" alt="Vinilo" />
        </div>
        <audio ref={audioRef} src={songs[songIndex]?.src} />
      </div>
      <div className="song-container">
        <div className="title-container">
          <CgPlayBackwards className="change-song-icon" onClick={prevSong} />
          <p className="song-title" key={songIndex}>
            {songs[songIndex]?.title}
          </p>
          <CgPlayForwards className="change-song-icon" onClick={nextSong} />
        </div>
        {isOpen && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default VinylPlayer
