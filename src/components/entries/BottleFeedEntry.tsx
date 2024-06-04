import { useState, createRef } from 'react';
import { Slider } from '../../components/layout/Slides';
import { EntryRecordOption, BottleFeedOption } from '../../support/entries';
import { WindowLayout } from '../../components/layout/Window';
import { TimeTracker } from '../../components/timers/TimeTracker';
import { AddNote } from './partials/AddNoteSlide';
import { publish, uuidv4, type StorageData } from '../../data/sync';

const uuid = uuidv4();
const slides: readonly string[] = [
  'select_feed_type',
  'mark_start_amount',
  'measure_time',
  'mark_finish_amount',
  'add_note',
  'confirm',
];

export function BottleFeedEntry() {
  const entryType = EntryRecordOption.BOTTLE;
  const slider = Slider.useSlider(slides);
  const [feedType, setFeedType] = useState<BottleFeedOption>();
  const [startAmount, setStartAmount] = useState<number>(0);
  const [finishAmount, setFinishAmount] = useState<number>(0);
  const [time, setTime] = useState<TimeTracker.PropArgs>();
  const [note, setNote] = useState<string>('');

  const SelectFeedType = () => (
    <Slider.Slide>
      <p>Select Feed Type</p>
      <button
        onClick={() => {
          setFeedType(() => BottleFeedOption.FORMULA);
          slider.next();
        }}
      >
        Formula
      </button>
      <button
        onClick={() => {
          setFeedType(() => BottleFeedOption.BREAST);
          slider.next();
        }}
      >
        Breast Milk
      </button>
    </Slider.Slide>
  );

  const MarkStartAmount = () => {
    const inputRef = createRef<HTMLInputElement>();
    return (
      <Slider.Slide>
        <p>Set starting amount:</p>
        <p>
          <label className="input-container">
            <input
              type="number"
              className="form-control"
              name="amount"
              defaultValue={startAmount}
              ref={inputRef}
            />
          </label>
        </p>
        <button
          onClick={() => {
            if (inputRef.current) {
              const amount: number = parseInt(inputRef.current.value);
              setStartAmount(() => amount);
            }
            slider.next();
          }}
        >
          Save
        </button>
      </Slider.Slide>
    );
  };

  const MeasureTime = () => (
    <Slider.Slide>
      <p>Measure Time</p>
      <TimeTracker.Period
        onComplete={(o: TimeTracker.PropArgs) => {
          setTime(() => o);
          slider.next();
        }}
      />
    </Slider.Slide>
  );

  const MarkFinishAmount = () => {
    const inputRef = createRef<HTMLInputElement>();
    return (
      <Slider.Slide>
        <p>Set finished amount:</p>
        <p>
          <label className="input-container">
            <input
              type="number"
              className="form-control"
              name="amount"
              defaultValue={finishAmount}
              ref={inputRef}
            />
          </label>
        </p>
        <button
          onClick={() => {
            if (inputRef.current) {
              const amount: number = parseInt(inputRef.current.value);
              setFinishAmount(() => amount);
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
      <p>Feed Type: {feedType}</p>
      <p>
        <span>Time Duration: </span>
        {time ? TimeTracker.formatDuration(time.duration * 1000) : '00:00:00'}
      </p>
      <p>
        Drank {finishAmount}mL of {startAmount}mL
      </p>
      {note && <p>Note: "{note}"</p>}

      <button
        onClick={(e) => {
          (e.target as HTMLButtonElement).disabled = true;
          const data: EntryStorageData = {
            type: entryType,
            feed_type: feedType as string,
            start_date: time!.started.getTime(),
            end_date: time!.finished!.getTime(),
            duration: time!.duration,
            start_amount: startAmount,
            finish_amount: finishAmount,
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
          <SelectFeedType />
          <MarkStartAmount />
          <MeasureTime />
          <MarkFinishAmount />
          <AddNote setNote={setNote} slider={slider} />
          <Confirmation />
        </Slider.Carousel>
      </WindowLayout>
    </>
  );
}

export interface EntryStorageData extends StorageData {
  feed_type: string;
  start_date: number;
  duration: number;
  end_date: number;
  start_amount: number;
  finish_amount: number;
  note?: string;
}
