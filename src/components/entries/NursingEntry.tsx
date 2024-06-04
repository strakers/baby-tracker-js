import { useState } from 'react';
import { Slider } from '../../components/layout/Slides';
import { EntryRecordOption, BreastSideOption } from '../../support/entries';
import { WindowLayout } from '../../components/layout/Window';
import { TimeTracker } from '../../components/timers/TimeTracker';
import { AddNote } from './partials/AddNoteSlide';
import { publish, uuidv4, type StorageData } from '../../data/sync';

const slides: readonly string[] = [
  'select_side',
  'measure_time',
  'add_note',
  'confirm',
];

export function NursingEntry() {
  const entryType = EntryRecordOption.NURSING;
  const slider = Slider.useSlider(slides);
  const [note, setNote] = useState<string>('');
  const [nursingSide, setNursingSide] = useState<`${BreastSideOption}`>();
  const [time, setTime] = useState<TimeTracker.PropArgs>();

  const SelectSide = () => (
    <Slider.Slide>
      <p>Select Side</p>
      <button
        onClick={() => {
          setNursingSide(() => BreastSideOption.LEFT);
          slider.next();
        }}
      >
        Left
      </button>
      <button
        onClick={() => {
          setNursingSide(() => BreastSideOption.RIGHT);
          slider.next();
        }}
      >
        Right
      </button>
    </Slider.Slide>
  );

  const MeasureTime = () => (
    <Slider.Slide>
      <p>Measure Time</p>
      <TimeTracker.Period
        onComplete={(o: TimeTracker.PropArgs) => {
          console.log('timer', o);
          setTime(() => o);
          slider.next();
        }}
      />
    </Slider.Slide>
  );

  const Confirmation = () => (
    <Slider.Slide>
      <p>Entry Type: {entryType}</p>
      <p>Nursing Side: {nursingSide}</p>
      <p>
        <span>Time Duration: </span>
        {time ? TimeTracker.formatDuration(time.duration * 1000) : '00:00:00'}
      </p>
      {note && <p>Note: "{note}"</p>}

      <button
        onClick={(e) => {
          (e.target as HTMLButtonElement).disabled = true;
          const data: EntryStorageData = {
            type: entryType,
            start_date: time!.started.getTime(),
            end_date: time!.finished!.getTime(),
            duration: time!.duration,
            side: nursingSide!,
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
          <SelectSide />
          <MeasureTime />
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
  side: `${BreastSideOption}`;
  note?: string;
}
