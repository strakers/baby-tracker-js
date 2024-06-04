// import React, { useState, useEffect } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';

// import { TimeTracker } from './components/timers/TimeTracker';
// import { MainMenu } from './components/navigation/MainMenu';
// import { AddRecord } from './components/pages/AddRecord';

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );

  // return (
  //   <div>
  //     <h1>Tracker</h1>

  //     <div className="card grid">
  //       <div className="subgrid">
  //         <div className="label">Instructions</div>
  //         <div className="label">Stopwatch</div>
  //         <div className="label">Time Marker</div>
  //       </div>

  //       <p className="read-the-docs">
  //         Click on the Start button to start the time tracker.
  //       </p>

  //       <hr />
  //       <TimeTracker.Instance
  //         onComplete={(x) => console.log('instance-tracker', x)}
  //       />
  //       <hr />
  //       <TimeTracker.Period
  //         onComplete={(x) => console.log('period-tracker', x)}
  //       />
  //     </div>

  //     <div className="other">
  //       <MainMenu />
  //     </div>

  //     <hr data-thin />

  //     <div className="other">
  //       <AddRecord />
  //     </div>
  //   </div>
  // );
}

export default App;
