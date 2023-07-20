'use client';

import clsx from 'clsx';
import Head from 'next/head';
import * as React from 'react';

import TextButton from "@/components/buttons/TextButton";

export default function HomePage() {
  const [startTime, setStartTime] = React.useState(Date.now());
  const [currentTime, setCurrentTime] = React.useState(Date.now());
  const [isRunning, setIsRunning] = React.useState(false);
  const [shouldRestart, setShouldRestart] = React.useState(true);

  React.useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 10);
  
      return () => { clearInterval(interval); };  
    }
  }, [isRunning]);

  const resetTimer = () => {
    setShouldRestart(true);
    setStartTime(Date.now());
    setCurrentTime(Date.now());
  }

  const toggleTimer = () => {
    if (!isRunning && shouldRestart) {
      resetTimer();
      setShouldRestart(false);
    }

    setIsRunning(wasRunning => !wasRunning);
  }
  
  return (
    <main>
      <Head>
        <title>Stopwatch</title>
      </Head>
      <div>
        <h1>{formatMs(currentTime - startTime)}</h1>

        <TextButton onClick={resetTimer} className="font-normal bg-gray-600 text-white">Reset</TextButton>

        <TextButton onClick={toggleTimer} className={clsx(
          "font-normal",
          isRunning
            ? "bg-red-800 text-red-500 hover:bg-red-700 active:bg-red-900"
            : "bg-green-700 text-lime-400 hover:bg-green-600 active:bg-green-800"
        )}>{isRunning ? "Stop" : "Start"}</TextButton>
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
