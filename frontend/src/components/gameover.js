import { Rating } from '@mui/material';
import '../styles/gameover.css'
import confetti from 'https://cdn.skypack.dev/canvas-confetti'
import { motion } from 'framer-motion'
import crowd from '../sounds/crowd.mp3'
import { useState } from 'react'

const dropIn = {
    hidden: {
        x:-1000,
        opacity: 0,
    },
    visible: {
        x:0,
        opacity: 1,
        // transition:{
        //     duration: 0.1
        // }
    },
    exit: {
        x:200,
        opacity: 0,
        // transition: {
        //     duration: 0.1
        // }
    },
}
function GameOver(props){
    const [crowdAudio, _] = useState(new Audio(crowd))
    const getVal = () => {
        const fullScore = props.totDiff * 10 * props.levels;
        const totScore = props.tscore;
        let val = 0;
        if(totScore >= ((1/5)*fullScore))
            val = 1;
        if(totScore >= ((2/5)*fullScore))
            val = 2;
        if(totScore >= ((3/5)*fullScore))
            val = 3;
        if(totScore >= ((4/5)*fullScore))
            val = 4;
        if(totScore >= fullScore)
            val = 5;
        confetti();
        return val;
    }
    const pauseSound = () => {
        crowdAudio.pause();
    }
    const playSound = () => {
        crowdAudio.currentTime = 0;
        crowdAudio.play();
    }
    return (
        <motion.div 
            className="gameover"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
        >
            <motion.div 
                className="gameover_container"
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {playSound()}
                <Rating name='read-only' value={getVal()} size="large" readOnly/>
                <div className="gtscore">Total Score: {props.tscore}</div>
                <div className='fact'><b>Did you know:</b> {props.fact}</div>
                <div className='footer'>
                    <button id="play-again" onClick={() => {
                        pauseSound();
                        props.startAgain();
                    }}>Play Again</button>
                    <button id="more-games" onClick={() => {
                        pauseSound();
                        props.moreGames();
                    }}>More Games</button>
                </div>
            </motion.div>

        </motion.div>
    );
}

export default GameOver;