import { useReducer } from 'react';
import type { TimeMeasurementType } from './timercontrols';
import { EntryRecordOption } from './entries';
import type {
  EntryRecordDataType,
  DiaperEntryDataType,
  BottleEntryDataType,
  NursingEntryDataType,
  PumpingEntryDataType,
  GrowthEntryDataType,
  NoteEntryDataType,
} from './entries';

export enum EntryStateActionOption {
  SET_TYPE = 'set-type',
  SET_TIME = 'set-time',
  SET_DATA = 'set-data',
  SAVE = 'save',
}

export type EntryState = {
  uuid: string;
  time: TimeMeasurementType;
} & (
  | { type: EntryRecordOption.DIAPER; data: DiaperEntryDataType }
  | { type: EntryRecordOption.BOTTLE; data: BottleEntryDataType }
  | { type: EntryRecordOption.NURSING; data: NursingEntryDataType }
  | { type: EntryRecordOption.PUMPING; data: PumpingEntryDataType }
  | { type: EntryRecordOption.GROWTH; data: GrowthEntryDataType }
  | { type: EntryRecordOption.NOTE; data: NoteEntryDataType }
);

export type EntryAction =
  | { type: EntryStateActionOption.SET_TYPE; payload: EntryRecordOption }
  | { type: EntryStateActionOption.SET_DATA; payload: EntryRecordDataType }
  | { type: EntryStateActionOption.SET_TIME; payload: TimeMeasurementType }
  | { type: EntryStateActionOption.SAVE };

export type EntrySaveAction = (s: EntryState) => void;

export function useEntryState /*<EntryState, EntrySaveAction>*/(
  initialState: EntryState,
  saveAction: EntrySaveAction
) {
  const reducer = (state: EntryState, action: EntryAction) => {
    let newState: EntryState = { ...state };
    let hasChanged = false;
    switch (action.type) {
      case EntryStateActionOption.SET_TYPE:
        newState.type =
          typeof action.payload === 'function'
            ? action.payload(newState.type)
            : action.payload;
        hasChanged = true;
        break;

      case EntryStateActionOption.SET_DATA:
        newState.data =
          typeof action.payload === 'function'
            ? action.payload(newState.data)
            : { ...newState.data, ...action.payload };
        hasChanged = true;
        break;

      case EntryStateActionOption.SET_TIME:
        newState.time =
          typeof action.payload === 'function'
            ? action.payload(newState.time)
            : action.payload;
        hasChanged = true;
        break;

      case EntryStateActionOption.SAVE:
        (saveAction as Function)(state);
        break;
    }
    return hasChanged ? newState : state;
  };
  return useReducer(reducer, initialState);
}
