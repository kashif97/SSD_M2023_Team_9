import '../styles/popup.css'
import goldImg from '../images/gold.png'
import silverImg from '../images/silver.png'
import { motion, AnimatePresence } from 'framer-motion'
import victory from '../sounds/victory.mp3'
import defeat from '../sounds/defeat.mp3'
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

function Popup(props)
{
    const [victoryAudio, _l] = useState(new Audio(victory))
    const [defeatAudio, _] = useState(new Audio(defeat))
    const pauseAudio = ()=> {
        if(props.found === props.total)
            victoryAudio.pause();
        else
            defeatAudio.pause();
    }
    const element1 = (<div className='medal'><img className='medalimg' src={goldImg} alt='gold'/>GOLD</div>);
    const element2 = (<div className='medal'><img className='medalimg' src={silverImg} alt="silver"/>SILVER</div>);
    const playSound = () => {
        if(props.found === props.total){
            victoryAudio.currentTime = 0;
            victoryAudio.play();
        }else{
            defeatAudio.currentTime = 0;
            defeatAudio.play();
        }

    }
    return(
        <AnimatePresence
            initial={false}
            mode='sync'
        >
            {(props.trigger) && (
                <motion.div 
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    exit={{opacity:0}}
                    className='popup'
                >
                    <motion.div 
                        variants={dropIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className='popup_container'
                    >  
                        {playSound()}
                        <div className='star'>{props.found === (props.total) ? (element1):(element2)}</div>
                        <div className='tscore'>Total Score: {props.score}</div>
                        <div className='fact'><b>Did you know:</b> {props.fact}</div>
                        <div className='footer'>
                            <button id='retry-btn' onClick={()=>{
                                pauseAudio();
                                props.setlevel(false);
                            }}>Retry</button>
                            <button id='continue-btn' onClick={()=>{
                                pauseAudio();
                                props.setlevel(true);
                            }}>Continue</button>
                        </div>
                    </motion.div>
                    
                </motion.div>
            )}
        </AnimatePresence>
        

    )
}

export default Popup

