import {
  TimeInstance,
  TimeSession,
  type TimeMeasurementType,
} from './timecontrols';

// ------------------------------------------------------------------------------
// declarations
// ------------------------------------------------------------------------------

export enum EntryRecordOption {
  DIAPER = 'diaper_change',
  BOTTLE = 'bottle_feed',
  NURSING = 'nursing',
  PUMPING = 'pumping',
  GROWTH = 'growth_measurement',
  NOTE = 'note',
}

export enum BottleFeedOption {
  FORMULA = 'formula',
  BREAST = 'expressed_breast_milk',
}

export enum BreastSideOption {
  LEFT = 'left',
  RIGHT = 'right',
}

type NoteOption = { note?: string };
export type EntryRecordOptionType = `${EntryRecordOption}`;

export type DiaperEntryDataType = NoteOption & {
  peeCount: number;
  pooCount: number;
};

export type BottleEntryDataType = NoteOption & {
  feedType: `${BottleFeedOption}` | null;
  startAmount: number;
  finishAmount: number;
};

export type NursingEntryDataType = NoteOption & {
  side: `${BreastSideOption}`;
};

export type PumpingEntryDataType = NoteOption & {
  leftAmount: number;
  rightAmount: number;
};

export type GrowthEntryDataType = NoteOption & {
  weight: number;
  length?: number;
  head?: number;
};

export type NoteEntryDataType = {
  note: string;
};

export type EntryRecordDataType =
  | DiaperEntryDataType
  | BottleEntryDataType
  | NursingEntryDataType
  | PumpingEntryDataType
  | GrowthEntryDataType
  | NoteEntryDataType;

// ------------------------------------------------------------------------------
// data classes
// ------------------------------------------------------------------------------

export class EntryRecord {
  constructor(
    readonly type: EntryRecordOptionType,
    readonly time: TimeMeasurementType,
    readonly data: object
  ) {}
}

export class DiaperEntryRecord extends EntryRecord {
  constructor(readonly time: TimeInstance, readonly data: DiaperEntryDataType) {
    super(EntryRecordOption.DIAPER, time, data);
  }
}

export class BottleEntryRecord extends EntryRecord {
  constructor(readonly time: TimeSession, readonly data: BottleEntryDataType) {
    super(EntryRecordOption.BOTTLE, time, data);
  }

  amountLeftOver() {
    return this.data.startAmount - this.data.finishAmount;
  }
}

export class NursingEntryRecord extends EntryRecord {
  constructor(readonly time: TimeSession, readonly data: NursingEntryDataType) {
    super(EntryRecordOption.NURSING, time, data);
  }
}

export class PumpingEntryRecord extends EntryRecord {
  constructor(readonly time: TimeSession, readonly data: PumpingEntryDataType) {
    super(EntryRecordOption.PUMPING, time, data);
  }

  get total() {
    return this.data.leftAmount + this.data.rightAmount;
  }
}

export class GrowthEntryRecord extends EntryRecord {
  constructor(readonly time: TimeInstance, readonly data: GrowthEntryDataType) {
    super(EntryRecordOption.GROWTH, time, data);
  }
}

export class NoteEntryRecord extends EntryRecord {
  constructor(readonly time: TimeInstance, readonly data: NoteEntryDataType) {
    super(EntryRecordOption.NOTE, time, data);
  }
}

export default {
  DiaperEntryRecord,
  BottleEntryRecord,
  NursingEntryRecord,
  PumpingEntryRecord,
  GrowthEntryRecord,
  NoteEntryRecord,
};
