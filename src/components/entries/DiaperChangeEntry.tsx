import { useState, createRef } from 'react';
import { Slider } from '../../components/layout/Slides';
import { EntryRecordOption } from '../../support/entries';
import { WindowLayout } from '../../components/layout/Window';
import { TimeTracker } from '../../components/timers/TimeTracker';
import { AddNote } from './partials/AddNoteSlide';
import { publish, uuidv4, type StorageData } from '../../data/sync';

const slides: readonly string[] = [
  'measure_time',
  'examine_diaper',
  'add_note',
  'confirm',
];

export function DiaperChangeEntry() {
  const entryType = EntryRecordOption.DIAPER;
  const slider = Slider.useSlider(slides);
  const [note, setNote] = useState<string>('');
  const [time, setTime] = useState<TimeTracker.PropArgs>();
  const [diaper, setDiaper] = useState<{ pee: number; poo: number }>({
    pee: 0,
    poo: 0,
  });

  const MeasureTime = () => (
    <Slider.Slide>
      <p>Record Time</p>
      <TimeTracker.Instance
        onComplete={(o: TimeTracker.PropArgs) => {
          setTime(() => o);
          slider.next();
        }}
      />
    </Slider.Slide>
  );

  const ExamineDiaper = () => {
    const peeRef = createRef<HTMLInputElement>();
    const pooRef = createRef<HTMLInputElement>();
    return (
      <Slider.Slide>
        <p>Examine Result</p>
        <div>
          <label>
            <span>Pee</span>
            <input
              type="range"
              step="1"
              min="1"
              max="5"
              defaultValue={diaper.pee}
              ref={peeRef}
            />
          </label>{' '}
          <label>
            <span>Poo</span>
            <input
              type="range"
              step="1"
              min="1"
              max="5"
              defaultValue={diaper.poo}
              ref={pooRef}
            />
          </label>
        </div>
        <button
          onClick={() => {
            if (peeRef.current && pooRef.current) {
              const result = {
                pee: parseInt(peeRef.current.value) ?? 0,
                poo: parseInt(pooRef.current.value) ?? 0,
              };
              setDiaper(() => result);
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
      <p>
        Start Time: {time ? TimeTracker.formatTime(time.started) : '00:00:00'}
      </p>
      <p>Pees: {diaper.pee}</p>
      <p>Poos: {diaper.poo}</p>
      {note && <p>Note: "{note}"</p>}
      <button
        onClick={(e) => {
          (e.target as HTMLButtonElement).disabled = true;
          const data: EntryStorageData = {
            type: entryType,
            start_date: time!.started.getTime(),
            end_date: time!.finished!.getTime(),
            duration: time!.duration,
            pee: diaper.pee,
            poo: diaper.poo,
            uuid: uuidv4(),
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
          <MeasureTime />
          <ExamineDiaper />
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
  pee: number;
  poo: number;
  note?: string;
}
