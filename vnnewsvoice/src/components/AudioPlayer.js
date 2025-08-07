import { useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import '../styles/AudioPlayer.css'




const AudioPlayer = ({ audioUrl, title }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef(null);

    useEffect(() => {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setCurrentTime(0);
        });

        audio.volume = volume;

        return () => {
            audio.pause();
            audio.src = '';
            audio.removeEventListener('loadedmetadata', () => { });
            audio.removeEventListener('timeupdate', () => { });
            audio.removeEventListener('ended', () => { });
        }
    }, [audioUrl]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        }
        else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * duration;
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value / 100;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
        if (newVolume === 0) {
            setIsMuted(true);
        }
        else {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            audioRef.current.volume = volume;
            setIsMuted(false);
        }
        else {
            audioRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    return (
        <div className="audio-player-container">
            <div className="audio-player-header">
                <h5>{title || 'Nghe bài viết'}</h5>
            </div>

            <div className="audio-player-controls">
                <Button
                    variant={isPlaying ? "secondary" : "primary"}
                    onClick={togglePlay}
                    className="play-button">
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </Button>

                <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                <Button
                    variant="light"
                    onClick={toggleMute}
                    className="volume-button"
                >
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </Button>
            </div>
            <div className="progress-container">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentTime / duration) * 100 || 0}
                    onChange={handleProgressChange}
                    className="progress-bar"
                />
            </div>

            <div className="volume-container">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                />
            </div>
        </div>
    );
};

export default AudioPlayer;