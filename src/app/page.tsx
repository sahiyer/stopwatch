'use client';

import clsx from 'clsx';
import Head from 'next/head';
import * as React from 'react';

import TextButton from "@/components/buttons/TextButton";

export default function HomePage() {
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [lastTime, setLastTime] = React.useState(Date.now());
  const [isRunning, setIsRunning] = React.useState(false);
  const [laps, setLaps] = React.useState(new Array<number>());

  const toggleTimer = () => {
    setIsRunning((wasRunning) => {
      const now = Date.now();
      if (wasRunning) {
        setElapsedTime(prevElapsed => prevElapsed + (now - lastTime));
      }

      setLastTime(now);
      return !wasRunning;
    });
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const getCurrentLapTime = () => {
    const totalElapsedPrevious = laps.reduce((partialSum, current) => partialSum + current, 0);
    return elapsedTime - totalElapsedPrevious;
  }

  const addLap = () => {
    setLaps((oldLaps) => {
      return [getCurrentLapTime(), ...oldLaps];
    });
  };

  React.useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(prevElapsed => prevElapsed + (now - lastTime));
        setLastTime(now);
      });

      return () => { clearInterval(interval); };
    }
  }, [isRunning, lastTime]);
  
  const fastestLapIndex = laps.indexOf(Math.min(...laps));
  const slowestLapIndex = laps.indexOf(Math.max(...laps));

  return (
    <main>
      <Head>
        <title>Stopwatch</title>
      </Head>
      <div>
        <h1>{formatMs(elapsedTime)}</h1>

        <TextButton onClick={isRunning ? addLap : resetTimer} className="font-normal bg-gray-600 text-white">{isRunning ? "Lap" : "Reset"}</TextButton>

        <TextButton onClick={toggleTimer} className={clsx(
          "font-normal",
          isRunning
            ? "bg-red-800 text-red-500 hover:bg-red-700 active:bg-red-900"
            : "bg-green-700 text-lime-400 hover:bg-green-600 active:bg-green-800"
        )}>{isRunning ? "Stop" : "Start"}</TextButton>

        <ul>
          <li>
            <span>Lap {laps.length + 1} </span>
            <span>{formatMs(getCurrentLapTime())}</span>
          </li>

          {
            laps.map((lapTime, index) => {
              return (
                <li key={index} className={clsx(
                  laps.length > 2 && index == fastestLapIndex && "text-green-500",
                  laps.length > 2 && index == slowestLapIndex && "text-red-500"
                )}>
                  <span>Lap {laps.length - index} </span>
                  <span>{formatMs(lapTime)}</span>
                </li>
              );
            })
          }
        </ul>
      </div>
    </main>
  );
}

function formatMs(value: number): string {
  const hundreths = Math.floor((value % 1000) / 10);
  const seconds = Math.floor(value / 1000) % 60;
  const minutes = Math.floor((value / 1000) / 60);
  
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${hundreths.toString().padStart(2, "0")}`;
}
