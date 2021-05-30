import React from 'react';

function Pad(props) {
  return (
    <button className={`pad pad-${props.status}`} onClick={props.onClick}>
        <img className='padIcon' src={props.icon.src} alt={props.icon.alt}></img>
    </button>
  );
}

export default Pad;