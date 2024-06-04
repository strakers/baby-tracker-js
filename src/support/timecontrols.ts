import { pad2digits } from './utilities';

// ------------------------------------------------------------------------------
// declarations
// ------------------------------------------------------------------------------

export const timeFormatConfig: Intl.DateTimeFormatOptions = {
  hourCycle: 'h24',
  timeZone: 'America/Toronto',
  timeStyle: 'medium',
};

export const dateFormatConfig: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'America/Toronto',
};

export enum TimeDurationFormatOption {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
  FULL = 'full',
}

// export type TimeMeasurementType = TimeInstance | TimePeriod | TimeSession;
export type TimeMeasurementType = {
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  duration: number;
};

// ------------------------------------------------------------------------------
// data classes
// ------------------------------------------------------------------------------

export class TimeInstance implements TimeMeasurementType {
  private _startDate: Date;

  constructor(startDate: Date) {
    this._startDate = startDate;
  }

  set(startDate: Date) {
    this._startDate = startDate;
  }

  timeSince(): number {
    if (this._startDate) {
      return new Date().getTime() - this._startDate.getTime();
    }
    return 0;
  }

  get startDate() {
    return this._startDate;
  }

  get startTime() {
    return new Intl.DateTimeFormat('en-CA', timeFormatConfig).format(
      this._startDate
    );
  }

  get endDate() {
    return this.startDate;
  }
  get endTime() {
    return this.startTime;
  }

  get duration() {
    return 0;
  }
}

export class TimePeriod implements TimeMeasurementType {
  private _startDate: Date;
  private _endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this._startDate = startDate;
    this._endDate = endDate;
  }

  set(startDate: Date, endDate: Date) {
    this._startDate = startDate;
    this._endDate = endDate;
  }

  get startDate() {
    return this._startDate;
  }

  get endDate() {
    return this._endDate;
  }

  get startTime() {
    return new Intl.DateTimeFormat('en-CA', timeFormatConfig).format(
      this.startDate
    );
  }

  get endTime() {
    return new Intl.DateTimeFormat('en-CA', timeFormatConfig).format(
      this.endDate
    );
  }

  get duration() {
    return this.endDate.getTime() - this.startDate.getTime();
  }
}

export class TimeSession implements TimeMeasurementType {
  private _periods: TimePeriod[] = [];

  add(period: TimePeriod) {
    this._periods.push(period);
  }

  session() {
    return this._periods;
  }

  data() {
    return {
      start: this._periods[0].startTime,
      end: this._periods[this._periods.length - 1].endTime,
      periods: this._periods.length,
      duration: this.duration,
    };
  }

  get startDate() {
    return this._periods[0].startDate;
  }

  get startTime() {
    return this._periods[0].startTime;
  }

  get endDate() {
    return this._periods[this._periods.length - 1].endDate;
  }

  get endTime() {
    return this._periods[this._periods.length - 1].endTime;
  }

  get duration() {
    return this._periods.reduce(
      (previous, current) => previous + current.duration,
      0
    );
  }

  get periods() {
    return this._periods.length;
  }
}

// ------------------------------------------------------------------------------
// support functions
// ------------------------------------------------------------------------------

export function displayDuration(
  time: TimeMeasurementType,
  format: `${TimeDurationFormatOption}` = TimeDurationFormatOption.MEDIUM
): string {
  const d = time.duration;
  const seconds = Math.floor(d / 1000) % 60;
  const minutes = Math.floor(d / 1000 / 60) % 60;
  const hours = Math.floor(d / 1000 / 60 / 60) % 24;
  const days = Math.floor(d / 1000 / 60 / 60 / 24) % 24;

  switch (format) {
    case TimeDurationFormatOption.FULL:
      return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
    case TimeDurationFormatOption.LONG:
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    case TimeDurationFormatOption.SHORT:
      return `${pad2digits(hours)}:${pad2digits(minutes)}`;
    case TimeDurationFormatOption.MEDIUM:
    default:
      return `${pad2digits(hours)}:${pad2digits(minutes)}:${pad2digits(
        seconds
      )}`;
  }
}

export const formatter = {
  /**
   * @deprecated Use the formatTime method instead.
   */
  formatDate(
    date: Date,
    format: `${TimeDurationFormatOption}` = TimeDurationFormatOption.MEDIUM
  ): string {
    return new Intl.DateTimeFormat('en-CA', {
      ...timeFormatConfig,
      timeStyle: format,
    }).format(date);
  },

  formatDuration(
    duration: number,
    format: `${TimeDurationFormatOption}` = TimeDurationFormatOption.MEDIUM
  ): string {
    const seconds = Math.floor(duration / 1000) % 60;
    const minutes = Math.floor(duration / 1000 / 60) % 60;
    const hours = Math.floor(duration / 1000 / 60 / 60) % 24;
    const days = Math.floor(duration / 1000 / 60 / 60 / 24) % 24;

    switch (format) {
      case TimeDurationFormatOption.FULL:
        return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
      case TimeDurationFormatOption.LONG:
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      case TimeDurationFormatOption.SHORT:
        return `${pad2digits(hours)}:${pad2digits(minutes)}`;
      case TimeDurationFormatOption.MEDIUM:
      default:
        return `${pad2digits(hours)}:${pad2digits(minutes)}:${pad2digits(
          seconds
        )}`;
    }
  },

  formatDay(date: Date): string {
    const f = new Intl.DateTimeFormat('en-CA', dateFormatConfig);
    return f.format(date);
  },

  formatTime(
    date: Date,
    format: `${TimeDurationFormatOption}` = TimeDurationFormatOption.MEDIUM
  ): string {
    return new Intl.DateTimeFormat('en-CA', {
      ...timeFormatConfig,
      timeStyle: format,
    }).format(date);
  },
};

// workaround to overwrite original method
formatter.formatDate = formatter.formatTime;
