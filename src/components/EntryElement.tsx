import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
//import { TimerControl } from './TimerControl';
import {
  useEntryState,
  EntryStateActionOption,
  type EntryState,
  type EntrySaveAction,
} from '../support/hooks';
import {
  EntryRecordDataType,
  EntryRecordOption,
  type EntryRecordOptionType,
} from '../support/entries';
import { TimeInstance } from '../support/timecontrols';

export function DiaperChangeEntry() {
  const [pee, setPee] = useState<number>(0);
  const [poop, setPoop] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [state, dispatch] = useEntryState<EntryState, EntrySaveAction>(
    {
      uuid: uuidv4(),
      type: EntryRecordOption.DIAPER,
      data: {
        peeCount: 0,
        pooCount: 0,
        note: '',
      },
      time: undefined,
    },
    (s) => {
      console.log('saving...', s);
      alert('saved! ' + JSON.stringify(s));
    }
  );

  return (
    <div>
      <p>Type: {state.type}</p>
      <p>Time Start: {!!state.time && state.time.startTime}</p>
      <p># Pees: {state.data.peeCount}</p>
      <p># Poops: {state.data.pooCount}</p>
      <p>Note: {state.data.note}</p>
      <div>
        <button
          onClick={() =>
            dispatch({
              type: EntryStateActionOption.SET_TIME,
              payload: new TimeInstance(new Date()),
            })
          }
        >
          Start
        </button>

        <br />
        <div>
          <label>
            <span>Record Pee</span>{' '}
            <input
              type="checkbox"
              onChange={(e) => setPee(() => (e.target.checked ? 1 : 0))}
              defaultValue={!!pee ? 'checked' : ''}
            />
          </label>
          {!!pee && (
            <input
              type="range"
              step="1"
              min="1"
              max="5"
              onChange={(
                e: React.ChangeEvent<HTMLInputElement> & {
                  target: { value: number };
                }
              ) => setPee(() => e.target.value * 1)}
              value={pee}
            />
          )}
          <span>{pee}</span>
        </div>
        <div>
          <label>
            <span>Record Poop</span>{' '}
            <input
              type="checkbox"
              onChange={(e) => setPoop(() => (e.target.checked ? 1 : 0))}
              defaultValue={!!poop ? 'checked' : ''}
            />
          </label>
          {!!poop && (
            <input
              type="range"
              step="1"
              min="1"
              max="5"
              onChange={(
                e: React.ChangeEvent<HTMLInputElement> & {
                  target: { value: number };
                }
              ) => setPoop(() => e.target.value * 1)}
              value={poop}
            />
          )}
          <span>{poop}</span>
        </div>
        <br />
        <textarea
          defaultValue={note}
          onBlur={(e) => setNote(() => e.target.value)}
        />
        <br />
        <button
          onClick={() => {
            const data: EntryRecordDataType = { peeCount: pee, pooCount: poop };
            if (note) data.note = note;

            dispatch({
              type: EntryStateActionOption.SET_DATA,
              payload: data,
            });

            dispatch({
              type: EntryStateActionOption.SAVE,
            });
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
