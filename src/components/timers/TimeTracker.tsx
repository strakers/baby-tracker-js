import { useState, useRef, useEffect } from 'react';
import { formatter } from '../../support/timecontrols';

export namespace TimeTracker {
  // -----------------------------------------------------------------------------------------------
  // Instance
  // -----------------------------------------------------------------------------------------------

  export function Instance({ onComplete }: InstanceProps) {
    const [startTime, setStartTime] = useState<Date>();

    const markTime = () => {
      const d = new Date();
      setStartTime(() => d);
      onComplete({
        started: d,
        duration: 0,
        type: 'instance',
      });
    };

    return (
      <div className="time-tracker time-tracker--instance">
        <p>{startTime ? formatter.formatTime(startTime) : '00:00:00'}</p>

        <button
          className="button timer-button timer-button--start"
          onClick={() => markTime()}
        >
          Mark
        </button>
      </div>
    );
  }

  // -----------------------------------------------------------------------------------------------
  // Period
  // -----------------------------------------------------------------------------------------------

  export function Period({ onComplete }: PeriodProps) {
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [startTime, setStartTime] = useState<Date>();
    const interval = useRef<number>();

    useEffect(() => {
      if (isRunning && !isPaused) {
        interval.current = setInterval(() => {
          setTimeElapsed((time) => time + 1);
        }, 1000);
      }

      return () => {
        if (interval.current) clearInterval(interval.current);
      };
    }, [isRunning, isPaused]);

    const startTimer = () => {
      if (!isRunning) {
        setIsRunning(true);
        setIsPaused(false);
        setStartTime(() => new Date());
        setTimeElapsed(() => 0);
      }
    };

    const stopTimer = () => {
      if (interval.current) clearInterval(interval.current);
      const end = new Date();
      setIsRunning(() => false);
      setIsPaused(() => true);
      onComplete({
        started: startTime ?? new Date(),
        duration: timeElapsed,
        finished: end,
        type: 'period',
      });
    };

    const pauseTimer = () => {
      if (isRunning && !isPaused) {
        if (interval.current) clearInterval(interval.current);
        setIsPaused(true);
      }
    };

    const resumeTimer = () => {
      if (isPaused) {
        setIsRunning(true);
        setIsPaused(false);
      }
    };

    return (
      <div className="time-tracker time-tracker--period">
        <p>
          {timeElapsed
            ? formatter.formatDuration(timeElapsed * 1000)
            : '00:00:00'}
        </p>

        {isPaused && isRunning ? (
          <button
            className="button timer-button timer-button--resume"
            onClick={() => resumeTimer()}
            disabled={!isPaused || !isRunning}
          >
            Resume
          </button>
        ) : (
          <button
            className="button timer-button timer-button--start"
            onClick={() => startTimer()}
            disabled={isRunning || !isPaused}
          >
            Start
          </button>
        )}
        <button
          className="button timer-button timer-button--stop"
          onClick={() => stopTimer()}
          disabled={!isRunning || isPaused}
        >
          Stop
        </button>
        <button
          className="button timer-button timer-button--pause"
          onClick={() => pauseTimer()}
          disabled={!isRunning || isPaused}
        >
          Pause
        </button>
      </div>
    );
  }

  // -----------------------------------------------------------------------------------------------
  // Countdown
  // -----------------------------------------------------------------------------------------------

  export function Countdown({ minutes, onComplete }: CountdownProps) {
    const [startTime, setStartTime] = useState<Date>();
    const [duration, setDuration] = useState<number>(minutes * 60);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const interval = useRef<number>();

    useEffect(() => {
      if (duration <= 0) {
        endTimer();
      }

      if (isRunning && !isPaused && !isCompleted && duration > 0) {
        interval.current = setInterval(() => {
          setDuration((duration) => duration - 1);
        }, 1000);
      }

      return () => {
        if (interval.current) clearInterval(interval.current);
      };
    }, [isRunning, isPaused, isCompleted, duration]);

    const startTimer = () => {
      if (!isRunning) {
        setIsRunning(true);
        setIsPaused(false);
        setStartTime(() => new Date());
        setDuration(() => minutes * 60);
        setIsCompleted(false);
      }
    };

    const pauseTimer = () => {
      if (isRunning && !isPaused) {
        if (interval.current) clearInterval(interval.current);
        setIsPaused(true);
      }
    };

    const resumeTimer = () => {
      if (isPaused) {
        setIsRunning(true);
        setIsPaused(false);
      }
    };

    const endTimer = () => {
      setIsRunning(false);
      setIsCompleted(true);
      onComplete({
        started: startTime ?? new Date(),
        duration: minutes * 60,
        finished: new Date(),
        type: 'countdown',
      });
    };

    return (
      <div className="time-tracker time-tracker--countdown">
        <p>
          {duration ? formatter.formatDuration(duration * 1000) : '00:00:00'}
        </p>
        {isPaused && isRunning && (
          <button
            className="button timer-button timer-button--resume"
            onClick={() => resumeTimer()}
            disabled={!isPaused || !isRunning}
          >
            Resume
          </button>
        )}
        {isPaused && !isRunning && (
          <button
            className="button timer-button timer-button--start"
            onClick={() => startTimer()}
            disabled={isRunning}
          >
            Start
          </button>
        )}
        {!isPaused && isRunning && (
          <button
            className="button timer-button timer-button--pause"
            onClick={() => pauseTimer()}
            disabled={!isRunning || isPaused}
          >
            Pause
          </button>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------------------------------------------
  // types
  // -----------------------------------------------------------------------------------------------

  export enum Kind {
    INSTANCE = 'instance',
    PERIOD = 'period',
    COUNTDOWN = 'countdown',
  }

  export interface PropArgs {
    type: `${Kind}`;
    started: Date;
    duration: number;
    finished?: Date;
  }

  export interface InstancePropsArgs {
    type: `${Kind}`;
    start: Date;
    duration: number;
  }

  // also used by countdown
  export interface PeriodPropsArgs extends InstancePropsArgs {
    end: Date;
  }

  export interface InstanceProps {
    onComplete: (args: PropArgs) => void;
  }

  export interface PeriodProps {
    onComplete: (args: PropArgs) => void;
  }

  export interface CountdownProps {
    minutes: number;
    onComplete: (args: PropArgs) => void;
  }
  // -----------------------------------------------------------------------------------------------
  // utility
  // -----------------------------------------------------------------------------------------------

  export const { formatDuration, formatTime, formatDay } = formatter;
}
