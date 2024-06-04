interface TimerActions {
  onStart: (target: any) => void;
  onReset?: (target: any) => void;
  onStop?: (target: any) => void;
  onPause?: (target: any) => void;
  onResume?: (target: any) => void;
}

export function TimerButton({
  type,
  onClick,
}: {
  type: string;
  onClick: (target: any) => void;
}) {
  return (
    <button className="timer-button" onClick={onClick} data-type={type}>
      {type}
    </button>
  );
}

export function TimerControl({
  onStart,
  onStop,
  onPause,
  onResume,
  onReset,
}: TimerActions) {
  return (
    <div className="timer-control">
      <div className="button-group">
        <TimerButton onClick={onStart} type="start" />
        {onStop && <TimerButton onClick={onStop} type="stop" />}
        {onPause && <TimerButton onClick={onPause} type="pause" />}
        {onResume && <TimerButton onClick={onResume} type="resume" />}
        {onReset && <TimerButton onClick={onReset} type="reset" />}
      </div>
    </div>
  );
}
