import React, { useEffect, useState } from 'react';
import Grid from './Grid';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
// import audio tracks
import bassWarwick from '../audio/bassWarwick.mp3';
import countrySlide from '../audio/countrySlide.mp3';
import futureFunk from '../audio/futureFunk.mp3';
import mazePolitics from '../audio/mazePolitics.mp3';
import pas3Groove from '../audio/pas3Groove.mp3';
import shutterBreakbeats from '../audio/shutterBreakbeats.mp3';
import silentStar from '../audio/silentStar.mp3';
import stompySlosh from '../audio/stompySlosh.mp3';
import tanggu from '../audio/tanggu.mp3';
// import pads icons
import bass from '../icons/bass.png';
import cymbal from '../icons/cymbal.png';
import electric from '../icons/electric.png';
import electronic from '../icons/electronic.png';
import gong from '../icons/gong.png';
import headphone from '../icons/headphone.png';
import keyboard from '../icons/keyboard.png';
import set from '../icons/set.png';
import tanggus from '../icons/tanggus.png';
// import controls icons
import playButton from '../icons/play.png';
import pauseButton from '../icons/pause.png';
import stopButton from '../icons/stop.png';
import recButton from '../icons/rec.png';
import loadButton from '../icons/load.png';

function Looper() {

  const [beat, setBeat] = useState(1);
  const [intervalId, setIntervalId] = useState(0);
  const [play, setPlay] = useState(false);
  const [padsDetails, setPadsDetails] = useState(Array(9).fill('details'));

  const [recordState, setRecordState] = useState();
  const [record, setRecord] = useState();

  // get icon, audio track and playing status for each pad
  const getPadsDetails = () => {
    const tempDetails = [
      { src: gong, alt: 'gong', audio: new Audio(shutterBreakbeats), status: 'off' },
      { src: bass, alt: 'bass', audio: new Audio(bassWarwick), status: 'off' },
      { src: electric, alt: 'electric', audio: new Audio(countrySlide), status: 'off' },
      { src: tanggus, alt: 'tanggus', audio: new Audio(tanggu), status: 'off' },
      { src: keyboard, alt: 'keyboard', audio: new Audio(silentStar), status: 'off' },
      { src: headphone, alt: 'headphone', audio: new Audio(mazePolitics), status: 'off' },
      { src: cymbal, alt: 'cymbal', audio: new Audio(stompySlosh), status: 'off' },
      { src: electronic, alt: 'electronic', audio: new Audio(futureFunk), status: 'off' },
      { src: set, alt: 'set', audio: new Audio(pas3Groove), status: 'off' },
    ]
    setPadsDetails(tempDetails);
  }

  useEffect(() => {
    getPadsDetails();
  }, []);

  useEffect(() => {
    if(play) {
      const detailsCopy = [...padsDetails];
      detailsCopy.forEach(padDetails => {
        //     ↓↓ start playing on a new cycle ↓↓                ↓↓ continue playing after a pause ↓↓
        if((beat === 1 && padDetails.status === 'pending') || (beat !== 1 && padDetails.status === 'on')) {
          padDetails.audio.play();
          padDetails.status = 'on';
        //       ↓↓ play from the start on a new cycle ↓↓
        } else if(beat === 1 && padDetails.status === 'on') {
          padDetails.audio.currentTime = 0;
        }
      });
      setPadsDetails(detailsCopy);
    }
  }, [play, beat]);

  // change pad's status when clicked, stop playing if needed
  const handlePadClick = (i) => {
    const detailsCopy = [...padsDetails];
    detailsCopy[i].status = detailsCopy[i].status === 'off' ? 'pending' : 'off';
    if(!detailsCopy[i].audio.paused) {
      detailsCopy[i].audio.pause();
      detailsCopy[i].audio.currentTime = 0;
    }
    setPadsDetails(detailsCopy)
  }
  
  const handleControllerClick = buttonId => {
    switch(buttonId) {
      case 'playButton':
        if(!play) {
          // prevent delays if playing after pause
          const detailsCopy = [...padsDetails];
          detailsCopy.forEach((padDetails, index) => {
            if(beat !== 1 && padDetails.status === 'on') {
              padDetails.audio.currentTime = beat / 2 - 0.5;
            }
          });
          setPadsDetails(detailsCopy);
          // start beat counter
          const id = setInterval(() => {
            setBeat(prev => prev > 7 ? 1 : prev + 1);
          }, 500);
          setIntervalId(id);
          setPlay(true);
        }
        break;
      case 'pauseButton':
        if(play) {
          // pause playing tracks and beat counter
          const detailsCopy = [...padsDetails];
          detailsCopy.forEach(padDetails => !padDetails.audio.paused && padDetails.audio.pause());
          setPadsDetails(detailsCopy);
          clearInterval(intervalId);
          setPlay(false);
        }
        break;
      case 'stopButton':
        // stop (pause and reset) playing tracks and beat counter
        const detailsCopy = [...padsDetails];
        detailsCopy.forEach(padDetails => {
          !padDetails.audio.paused && padDetails.audio.pause();
          padDetails.audio.currentTime = 0;
          padDetails.status = 'off';
        });
        setPadsDetails(detailsCopy);
        clearInterval(intervalId);
        setPlay(false);
        setBeat(1);
        break;
      case 'recButton':
        // start or stop record user audio
        recordState === RecordState.START ? setRecordState(RecordState.STOP) : setRecordState(RecordState.START);
        break;
      default:
        // play or stop playing recorded session
        if(record) {
          if(!record.paused) {
             record.pause();
            record.currentTime = 0;
          } else record.play();
        }
    }    
  }

  return (
    <div className="looper">
      <h1>Super Looper</h1>
      <Grid
        padsDetails={padsDetails}
        onClick={(i) => handlePadClick(i)}
      />
      <div className='controls'>
        <div className='beat'>
          {beat} {/*                    ↓ mark first beat with a red light ↓          */}
          <span className={`light ${play ? beat % 8 === 1 ? 'red' : 'green' : 'no'}Light`}></span>
        </div>
        <img
          src={playButton}
          alt='playButton'
          id='playButton'
          className='controlButton'
          onClick={() => handleControllerClick('playButton')}
          disabled={play}
        ></img>
        <img
          src={pauseButton}
          alt='pauseButton'
          id='pauseButton'
          className='controlButton'
          onClick={() => handleControllerClick('pauseButton')}
          disabled={!play}
        ></img>
        <img
          src={stopButton}
          alt='stopButton'
          id='stopButton'
          className='controlButton'
          onClick={() => handleControllerClick('stopButton')}
        ></img>
        <img
          src={recButton}
          alt='recButton'
          id='recButton' /*                  ↓ indicate when recording ↓                  */
          className={`controlButton record${recordState === RecordState.START ? 'On' : 'Off'}`}
          onClick={() => handleControllerClick('recButton')}
        ></img>
        <img
          src={loadButton}
          alt='loadButton'
          id='loadButton'
          className='controlButton'
          onClick={() => handleControllerClick('loadButton')}
        ></img>
      </div>
      {/* hidden audio recorder */}
      <div id='recorder' style={{display: 'none'}}>
        <AudioReactRecorder state={recordState} onStop={audioData => setRecord(new Audio(audioData.url))} />
      </div>
    </div>
  );
}

export default Looper;