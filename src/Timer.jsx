import { useState } from 'react';

function Timer() {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  return (
    <>
      {!startTime && <button onClick={() => setStartTime(() => Date())}>Start</button>}
      {startTime && <button onClick={() => setEndTime(() => Date())}>Stop</button>}
      <p>{endTime - startTime}</p>
    </>
  );
}

export default Timer;