import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import '../styles/spd.css'
import Popup from './popup'
import GameOver from './gameover'
import wrongImg from '../images/newc.png'
import loadGif from '../images/load1.gif'
import titleImage from '../images/title.png'
import clockImg from '../images/clock.png'
import starImg from '../images/star2.png'
import foundImg from '../images/search1.png'
import easyimg from '../images/easy1.png'
import mediumimg from '../images/medium1.png'
import hardimg from '../images/hard1.png'
import homeImg from '../images/home.png'
import controller from '../images/controller.png'
import gameSound from '../sounds/sound.mp3'
import click from '../sounds/click.wav'

const facts = ['The cheetah is the fastest land animal and can reach speeds up to 75 mph.', 'Polar bears are excellent swimmers and have been known to swim hundreds of miles at a stretch.', "A group of flamingos is called a 'flamboyance.'", 'Honeybees can recognize human faces.', 'A kangaroo can jump up to three times its own body length in one leap.', "Elephants, the only animals that can't jump, have the largest brains of any land animal.", 'Octopuses, with three hearts and blue blood, can regrow lost arms.', 'Chameleons change color to communicate, not just to blend in, and their eyes can move independently.', 'Giraffes, with seven neck vertebrae like humans, have blue-black tongues up to 45 cm long.', 'Dolphins use signature whistles to identify each other and are known for playful behavior and high intelligence.', 'Sloths, the slowest mammals, can take up to a month to digest a meal and spend most of their lives hanging upside down.', 'Crows, highly intelligent, can solve complex problems and remember human faces for years.', 'Blue whales, the largest animals on Earth, and humpback whales, create intricate songs that can last for hours.', 'Wood frogs can survive being completely frozen and thaw out later, while golden poison dart frogs are among the most poisonous animals.', 'Platypuses, laying eggs and having a duck-like bill and webbed feet, are one of the few mammals with these characteristics.']

const _ = require('lodash');
function SpotDifference(){
    const [initialState, setInitialState] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [firstImage, setFirstImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [gameInfo, setGameInfo] = useState([]);
    const [totDiff, setTotDiff] = useState(0);
    const [diffFound, setDiffFound] = useState(0);
    const [levels, setLevels] = useState([])
    const [currlevel, setCurrLevel] = useState(0)
    const [seconds, setSeconds] = useState(0);
    const [score, setScore] = useState(0);
    const [popup, setPopUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameAudio, _k] = useState(new Audio(gameSound))
    const randomFact = () => (Math.floor(Math.random() * 15))
    const navigate = useNavigate();
    const pauseAudio = () => {
        gameAudio.pause();
    }
    const startOver = () => {
        pauseAudio();
        setInitialState(0);
        setPlaying(false);
        setFirstImage(null);
        setSecondImage(null);
        setGameInfo([]);
        setTotDiff(0);
        setDiffFound(0);
        setLevels([]);
        setCurrLevel(0);
        setSeconds(0);
        setScore(0);
        setPopUp(false);
        setLoading(false);
        setGameOver(false);
    }
    const moreGames = () => {
        pauseAudio();
        navigate('/')
    }

    const update = (index) => {
        if(gameInfo[index][5])
            return;
        if((totDiff - diffFound) === 1)
            pauseAudio();
        const updatedInfo = gameInfo;
        const tempaud = new Audio(click);
        tempaud.play();
        updatedInfo[index][0] = 'block';
        updatedInfo[index][5] = true;
        setScore(score + 10)
        setDiffFound(diffFound + 1);
        setGameInfo(updatedInfo);
    }
    const newLevel = (b) => {
        if(currlevel !== levels.length && b){
            gameAudio.currentTime = 0;
            gameAudio.play();
            const newList = _.cloneDeep(levels[currlevel]['cords'])
            setFirstImage(levels[currlevel]['img-1']);
            setSecondImage(levels[currlevel]['img-2']);
            setPopUp(false)
            setTotDiff(newList.length);
            setDiffFound(0);
            setGameInfo(newList);
            setPlaying(true)
            setCurrLevel(currlevel+1);
            setSeconds(60);
           
        }
        else if(currlevel !== levels.length && !b){
            gameAudio.currentTime = 0;
            gameAudio.play();
            const newList = _.cloneDeep(levels[currlevel-1]['cords'])
            setFirstImage(levels[currlevel - 1]['img-1']);
            setSecondImage(levels[currlevel - 1]['img-2']);
            setPopUp(false)
            setScore(score - diffFound * 10);
            setDiffFound(0);
            setTotDiff(newList.length);
            setGameInfo(newList);
            setPlaying(true);
            setSeconds(60);
        }
        else if(currlevel === levels.length && levels.length !== 0){
            pauseAudio();
            setGameOver(true);
            setPopUp(false);
        }
    }
    
    useEffect(()=>{
        if(initialState !== 0)
        {
            const data = initialState
            setLoading(true)
            fetch("http://localhost:4000/spotdiff",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    data
                })
            })
            .then((response)=>response.json())
            .then((images)=>{
                setLoading(false)
                setLevels(images)
                setCurrLevel(0)
            })
        }
    },[initialState]);

    useEffect(()=>{
        let intervalId;
        if(playing)
        {
            intervalId = setInterval(()=>{
                if(seconds > 0){
                    setSeconds(seconds-1);
                }
                else
                    setPlaying(false)
            }, 1000);
        }
           
        return ()=>{
            clearInterval(intervalId);
        }
    },[playing, seconds])

    useEffect(()=>{
        newLevel(true);
    }, [levels])

    useEffect(()=>{
        if(seconds === 0 && playing){
            setPlaying(false);
            pauseAudio();
            setPopUp(true);
        }
    },[seconds, playing])

    useEffect(()=>{
        if(diffFound === totDiff  && playing){
            setPlaying(false);
            setPopUp(true);
        }
    }, [diffFound, playing, totDiff]);
    
    return(
        <div className="spd">
                <div className='header'>
                    <img style={{marginLeft:'10px'}} onClick={startOver} src={homeImg} alt='home'/>
                    <center><img className='titleimg'src={titleImage} alt='heading'/></center> 
                    <img style={{marginRight:'10px'}} onClick={moreGames} src={controller} alt='controller'/>
                </div>
                {playing && <center><div className='showlevel'>Level: {currlevel}/{levels.length}</div></center> }
            <div className="container">
                {loading?(
                <div className='loader'>
                    <img src={loadGif} alt='loading'/>
                    <p style={{fontSize:'1.5em'}}>LOADING....</p>
                </div>
                ):<></>}
                {initialState === 0?(
                    <>
                        <img className='difficulty' src={easyimg} alt='easy' onClick={()=>{
                            gameAudio.loop = true;
                            setInitialState(5);
                        }}/>
                        <img className='difficulty medium' src={mediumimg} alt='medium' onClick={()=>{
                            gameAudio.loop = true;
                            setInitialState(7);
                        }}/>
                        <img className='difficulty hard' src={hardimg} alt='hard' onClick={()=>{
                            gameAudio.loop = true; 
                            setInitialState(8)
                        }}/>
                    </>
                ):(<></>)}
                <AnimatePresence
                    initial={false}
                    mode='sync'
                >
                {playing?(
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        id="img-1"
                    >
                    <img src={firstImage} alt="firstImage" useMap='#map1'/>
                    <div className='first' style={{display:`${gameInfo[0][0]}`,left:`${gameInfo[0][3]}px`, top:`${gameInfo[0][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                    <div className='second' style={{display:`${gameInfo[1][0]}`,left:`${gameInfo[1][3]}px`, top:`${gameInfo[1][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                    <div className='third' style={{display:`${gameInfo[2][0]}`,left:`${gameInfo[2][3]}px`, top:`${gameInfo[2][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                    <div className='fourth' style={{display:`${gameInfo[3][0]}`,left:`${gameInfo[3][3]}px`, top:`${gameInfo[3][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                    <div className='fifth' style={{display:`${gameInfo[4][0]}`,left:`${gameInfo[4][3]}px`, top:`${gameInfo[4][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                    {totDiff > 5 ? (
                        <>
                            <div className='sixth' style={{display:`${gameInfo[5][0]}`,left:`${gameInfo[5][3]}px`, top:`${gameInfo[5][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                            <div className='seventh' style={{display:`${gameInfo[6][0]}`,left:`${gameInfo[6][3]}px`, top:`${gameInfo[6][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                        </>
                        
                    ) : (<></>)}
                    
                    {totDiff > 7 ? (
                        <>
                            <div className='eighth' style={{display:`${gameInfo[7][0]}`,left:`${gameInfo[7][3]}px`, top:`${gameInfo[7][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                        </>
                    ): (<></>)}
                    
                    <map name="map1">
                        <area shape='circle' alt="clickable" coords={`${gameInfo[0][1]},${gameInfo[0][2]},${gameInfo[0][6]}`} onMouseDown={update.bind(null, 0)}/>
                        <area shape='circle' alt="clickable" coords={`${gameInfo[1][1]},${gameInfo[1][2]},${gameInfo[1][6]}`} onMouseDown={update.bind(null, 1)}/>
                        <area shape='circle' alt="clickable" coords={`${gameInfo[2][1]},${gameInfo[2][2]},${gameInfo[2][6]}`} onMouseDown={update.bind(null, 2)}/>
                        <area shape='circle' alt="clickable" coords={`${gameInfo[3][1]},${gameInfo[3][2]},${gameInfo[3][6]}`} onMouseDown={update.bind(null, 3)}/>
                        <area shape='circle' alt="clickable" coords={`${gameInfo[4][1]},${gameInfo[4][2]},${gameInfo[4][6]}`} onMouseDown={update.bind(null, 4)}/>
                        {totDiff > 5? (
                            <>
                                <area shape='circle' alt="clickable" coords={`${gameInfo[5][1]},${gameInfo[5][2]},${gameInfo[5][6]}`} onMouseDown={update.bind(null, 5)}/>
                                <area shape='circle' alt="clickable" coords={`${gameInfo[6][1]},${gameInfo[6][2]},${gameInfo[6][6]}`} onMouseDown={update.bind(null, 6)}/>
                            </>
                        ):(<></>)}
                        {totDiff > 7?(
                            <>
                                <area shape='circle' alt="clickable" coords={`${gameInfo[7][1]},${gameInfo[7][2]},${gameInfo[7][6]}`} onMouseDown={update.bind(null, 7)}/>
                            </>
                            
                        ): (<></>)}
                        
                        
                    </map>
                </motion.div>
                ):<></>}
                </AnimatePresence>
                <AnimatePresence
                    initial={false}
                    mode='sync'
                >
                {playing?(
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        id="img-2"
                    >
                    <img src={secondImage} alt="firstImage" useMap='#map2'/>
                    <div className='first' style={{display:`${gameInfo[0][0]}`,left:`${gameInfo[0][3]}px`, top:`${gameInfo[0][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                    <div className='second' style={{display:`${gameInfo[1][0]}`,left:`${gameInfo[1][3]}px`, top:`${gameInfo[1][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                    <div className='third' style={{display:`${gameInfo[2][0]}`,left:`${gameInfo[2][3]}px`, top:`${gameInfo[2][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                    <div className='fourth' style={{display:`${gameInfo[3][0]}`,left:`${gameInfo[3][3]}px`, top:`${gameInfo[3][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                    <div className='fifth' style={{display:`${gameInfo[4][0]}`,left:`${gameInfo[4][3]}px`, top:`${gameInfo[4][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                    {totDiff > 5 ? (
                        <>
                            <div className='sixth' style={{display:`${gameInfo[5][0]}`,left:`${gameInfo[5][3]}px`, top:`${gameInfo[5][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                            <div className='seventh' style={{display:`${gameInfo[6][0]}`,left:`${gameInfo[6][3]}px`, top:`${gameInfo[6][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                        </>
                        
                    ) : (<></>)}
                    
                    {totDiff > 7 ? (
                        <>
                            <div className='eighth' style={{display:`${gameInfo[7][0]}`,left:`${gameInfo[7][3]}px`, top:`${gameInfo[7][4]}px`}}><img src={wrongImg} alt="wrongImg"/></div>
                        </>
                    ): (<></>)}
                    
                    <map name="map2">
                        <area shape='circle' alt="clickable" coords={`${gameInfo[0][1]},${gameInfo[0][2]},${gameInfo[0][6]}`} onMouseDown={update.bind(null, 0)}/>
                        <area shape='circle' alt="clickable" coords={`${gameInfo[1][1]},${gameInfo[1][2]},${gameInfo[1][6]}`} onMouseDown={update.bind(null, 1)}/>
                        <area shape='circle' alt="clickable" coords={`${gameInfo[2][1]},${gameInfo[2][2]},${gameInfo[2][6]}`} onMouseDown={update.bind(null, 2)}/>
                        <area shape='circle' alt="clickable" coords={`${gameInfo[3][1]},${gameInfo[3][2]},${gameInfo[3][6]}`} onMouseDown={update.bind(null, 3)}/>
                        <area shape='circle' alt="clickable" coords={`${gameInfo[4][1]},${gameInfo[4][2]},${gameInfo[4][6]}`} onMouseDown={update.bind(null, 4)}/>
                        {totDiff > 5? (
                            <>
                                <area shape='circle' alt="clickable" coords={`${gameInfo[5][1]},${gameInfo[5][2]},${gameInfo[5][6]}`} onMouseDown={update.bind(null, 5)}/>
                                <area shape='circle' alt="clickable" coords={`${gameInfo[6][1]},${gameInfo[6][2]},${gameInfo[6][6]}`} onMouseDown={update.bind(null, 6)}/>
                            </>
                        ):(<></>)}
                        {totDiff > 7?(
                            <>
                                <area shape='circle' alt="clickable" coords={`${gameInfo[7][1]},${gameInfo[7][2]},${gameInfo[7][6]}`} onMouseDown={update.bind(null, 7)}/>
                            </>
                            
                        ): (<></>)}
                        
                        
                    </map>
                </motion.div>
                ):<></>}
                </AnimatePresence>
            </div>
                <AnimatePresence
                    initial={false}
                    mode='sync'
                >
                {playing?(
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='levelStatus'
                    >
                        <div className='timer'> <img src={clockImg} alt='clock'/> Time: {seconds}</div>
                        <div className='score'><img src={starImg} alt='star'/> <span style={{marginLeft:'7px'}}>Score: {score}</span></div>
                        <div className='founddiff'><img src={foundImg} alt='found'/><span style={{marginLeft:'7px'}}> Found: {diffFound}/{totDiff}</span></div>
                    </motion.div>
                ):<></>}
                </AnimatePresence>
                <Popup fact={facts[randomFact()]} trigger={popup} score={score} found={diffFound} total={totDiff} setlevel={newLevel}/>
                <AnimatePresence 
                    initial={false}
                    mode='sync'
                >
                {gameOver && (<GameOver fact={facts[randomFact()]} totDiff={totDiff} levels={levels.length} tscore={score} startAgain={startOver} moreGames={moreGames}/>)}
                </AnimatePresence>
        </div>
    );
}

export default SpotDifference
