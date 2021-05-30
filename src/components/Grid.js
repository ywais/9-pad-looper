import React from 'react';
import Pad from './Pad';

function Grid (props) {

  const addPad = i =>
    <Pad
      icon={{
        src: props.padsDetails[i].src,
        alt: props.padsDetails[i].alt
      }}
      status={props.padsDetails[i].status}
      onClick={() => props.onClick(i)}
    />;

  return (
    <div className='grid'>
      <div className="gridRow">
        {addPad(0)}
        {addPad(1)}
        {addPad(2)}
      </div>
      <div className="gridRow">
        {addPad(3)}
        {addPad(4)}
        {addPad(5)}
      </div>
      <div className="gridRow">
        {addPad(6)}
        {addPad(7)}
        {addPad(8)}
      </div>
    </div>
  );
}

export default Grid;