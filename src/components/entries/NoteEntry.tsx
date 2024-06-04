import { useState } from 'react';
import { Slider } from '../../components/layout/Slides';
import { EntryRecordOption } from '../../support/entries';
import { WindowLayout } from '../../components/layout/Window';
import { TimeTracker } from '../../components/timers/TimeTracker';
import { AddNote } from './partials/AddNoteSlide';
import { publish, uuidv4, type StorageData } from '../../data/sync';

const uuid = uuidv4();
const slides: readonly string[] = ['add_note', 'confirm'];

export function NoteEntry() {
  const entryType = EntryRecordOption.NOTE;
  const slider = Slider.useSlider(slides);
  const [note, setNote] = useState<string>('');
  const time = new Date();

  const Confirmation = () => (
    <Slider.Slide>
      <p>Entry Type: {entryType}</p>
      <p>
        <span>Time Duration: </span>
        {time ? TimeTracker.formatDay(time) : 'Today'}
      </p>
      {note && <p>Note: "{note}"</p>}

      <button
        onClick={(e) => {
          (e.target as HTMLButtonElement).disabled = true;
          const data: EntryStorageData = {
            type: entryType,
            start_date: time.getTime(),
            note: note,
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
          <AddNote setNote={setNote} slider={slider} />
          <Confirmation />
        </Slider.Carousel>
      </WindowLayout>
    </>
  );
}

export interface EntryStorageData extends StorageData {
  start_date: number;
  note: string;
}
