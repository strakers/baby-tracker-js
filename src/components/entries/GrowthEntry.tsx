import { useState } from 'react';
import { Slider } from '../../components/layout/Slides';
import { EntryRecordOption } from '../../support/entries';
import { WindowLayout } from '../../components/layout/Window';
import { TimeTracker } from '../../components/timers/TimeTracker';
import { AddNote } from './partials/AddNoteSlide';
import { publish, uuidv4, type StorageData } from '../../data/sync';

const slides: readonly string[] = ['measurements', 'add_note', 'confirm'];

export function GrowthEntry() {
  const entryType = EntryRecordOption.GROWTH;
  const slider = Slider.useSlider(slides);
  const [weight, setWeight] = useState<number>(0);
  const [extraMeasurements, setExtraMeasurements] = useState<boolean>(false);
  const [length, setLength] = useState<number>(0);
  const [head, setHead] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const time = new Date();

  const Measurements = () => (
    <Slider.Slide>
      <p>Record Weight</p>
      <p>
        <label className="input-container">
          <span>Weight</span>
          <br />
          <input
            type="number"
            className="form-control"
            name="weight"
            defaultValue={weight}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement> & {
                target: { value: number };
              }
            ) => setWeight(() => parseInt(e.target.value))}
          />
        </label>
        <label className="input-container">
          <input
            type="checkbox"
            name="add_length_and_head"
            checked={extraMeasurements}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement> & {
                target: { checked: boolean };
              }
            ) => setExtraMeasurements(() => !!e.target.checked)}
          />{' '}
          <span>More</span>
        </label>
      </p>
      {extraMeasurements && (
        <p>
          <label className="input-container">
            <span>Length</span>
            <br />
            <input
              type="number"
              className="form-control"
              name="length"
              defaultValue={length}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement> & {
                  target: { value: number };
                }
              ) => setLength(() => parseInt(e.target.value))}
            />
          </label>
          <label className="input-container">
            <span>Head</span>
            <br />
            <input
              type="number"
              className="form-control"
              name="head"
              defaultValue={head}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement> & {
                  target: { value: number };
                }
              ) => setHead(() => parseInt(e.target.value))}
            />
          </label>
        </p>
      )}
      <button onClick={() => slider.next()} disabled={weight <= 0}>
        Next
      </button>
    </Slider.Slide>
  );

  const Confirmation = () => (
    <Slider.Slide>
      <p>Entry Type: {entryType}</p>
      <p>Weigth: {weight} kg</p>
      {!!length && <p>Length: {length}</p>}
      {!!head && <p>Head: {head}</p>}
      <p>
        <span>Date Measured: </span>
        {time ? TimeTracker.formatDay(time) : 'Today'}
      </p>
      {note && <p>Note: "{note}"</p>}

      <button
        onClick={(e) => {
          (e.target as HTMLButtonElement).disabled = true;
          const data: EntryStorageData = {
            type: entryType,
            start_date: time.getTime(),
            weight: weight,
            length: length ?? null,
            head: head ?? null,
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
          <Measurements />
          <AddNote setNote={setNote} slider={slider} />
          <Confirmation />
        </Slider.Carousel>
      </WindowLayout>
    </>
  );
}

export interface EntryStorageData extends StorageData {
  start_date: number;
  weight: number;
  length?: number;
  head?: number;
  note?: string;
}
