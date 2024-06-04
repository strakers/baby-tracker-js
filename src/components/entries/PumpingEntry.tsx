import { useState, createRef } from 'react';
import { Slider } from '../../components/layout/Slides';
import { EntryRecordOption } from '../../support/entries';
import { WindowLayout } from '../../components/layout/Window';
import { TimeTracker } from '../../components/timers/TimeTracker';
import { AddNote } from './partials/AddNoteSlide';
import { publish, uuidv4, type StorageData } from '../../data/sync';

const uuid = uuidv4();
const slides: readonly string[] = [
  'set_duration',
  'measure_time',
  'measure_amount',
  'add_note',
  'confirm',
];

export function PumpingEntry() {
  const entryType = EntryRecordOption.PUMPING;
  const slider = Slider.useSlider(slides);
  const [duration, setDuration] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [time, setTime] = useState<TimeTracker.PropArgs>();
  const [amount, setAmount] = useState<[number, number]>([0, 0]);

  const SetDuration = () => (
    <Slider.Slide>
      <p>Set Duration</p>
      <p>
        <input
          type="number"
          className="form-control"
          min={1}
          max={60}
          onBlur={(
            e: React.FocusEvent<HTMLInputElement> & {
              target: { value: number };
            }
          ) => setDuration(() => e.target.value)}
          defaultValue={duration}
        />
      </p>
      <button
        onClick={() => {
          slider.next();
        }}
      >
        Next
      </button>
    </Slider.Slide>
  );

  const MeasureTime = () => (
    <Slider.Slide>
      <p>Measure Time</p>
      <TimeTracker.Countdown
        minutes={duration}
        onComplete={(o: TimeTracker.PropArgs) => {
          setTime(() => o);
          slider.next();
        }}
      />
    </Slider.Slide>
  );

  const MeasureAmount = () => {
    const leftRef = createRef<HTMLInputElement>();
    const rightRef = createRef<HTMLInputElement>();
    return (
      <Slider.Slide>
        <p>Measure Amount</p>
        <p>
          <label className="input-container">
            <span>Left</span>
            <br />
            <input
              type="number"
              className="form-control"
              name="left"
              defaultValue={amount[0]}
              ref={leftRef}
            />
          </label>{' '}
          <label className="input-container">
            <span>Right</span>
            <br />
            <input
              type="number"
              className="form-control"
              name="right"
              defaultValue={amount[1]}
              ref={rightRef}
            />
          </label>
        </p>
        <button
          onClick={() => {
            if (leftRef.current && rightRef.current) {
              const double: [number, number] = [
                parseInt(leftRef.current.value) ?? 0,
                parseInt(rightRef.current.value) ?? 0,
              ];
              setAmount(() => double);
            }
            slider.next();
          }}
        >
          Save
        </button>
      </Slider.Slide>
    );
  };

  const Confirmation = () => (
    <Slider.Slide>
      <p>Entry Type: {entryType}</p>
      <p>Duration: {duration} min</p>
      <p>
        Start Time: {time ? TimeTracker.formatTime(time.started) : '00:00:00'}
      </p>
      <p>Left: {amount[0]} mL</p>
      <p>Right: {amount[1]} mL</p>
      {note && <p>Note: "{note}"</p>}

      <button
        onClick={(e) => {
          (e.target as HTMLButtonElement).disabled = true;
          const data: EntryStorageData = {
            type: entryType,
            start_date: time!.started.getTime(),
            end_date: time!.finished!.getTime(),
            duration: time!.duration,
            left_amount: amount[0],
            right_amount: amount[1],
            uuid,
          };
          publish(data).then(() => slider.reset());
        }}
      >
        Store
      </button>
      <button
        onClick={() => {
          slider.reset();
        }}
      >
        Reset
      </button>
    </Slider.Slide>
  );

  return (
    <>
      <WindowLayout>
        <Slider.Carousel index={slider.index} slides={slides}>
          <SetDuration />
          <MeasureTime />
          <MeasureAmount />
          <AddNote setNote={setNote} slider={slider} />
          <Confirmation />
        </Slider.Carousel>
      </WindowLayout>
    </>
  );
}

export interface EntryStorageData extends StorageData {
  start_date: number;
  duration: number;
  end_date: number;
  left_amount: number;
  right_amount: number;
  note?: string;
}
