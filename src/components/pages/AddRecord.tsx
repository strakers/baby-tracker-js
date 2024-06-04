import { useState } from 'react';
import { AddRecordMenu } from '../navigation/AddRecordMenu';
import { EntryRecordOption } from '../../support/entries';
import { NursingEntry } from '../../components/entries/NursingEntry';
import { PumpingEntry } from '../../components/entries/PumpingEntry';
import { DiaperChangeEntry } from '../../components/entries/DiaperChangeEntry';
import { BottleFeedEntry } from '../../components/entries/BottleFeedEntry';
import { GrowthEntry } from '../../components/entries/GrowthEntry';
import { NoteEntry } from '../../components/entries/NoteEntry';

type Pages = 'menu' | `${EntryRecordOption}`;

export function AddRecord() {
  const [page, setPage] = useState<Pages>('menu');
  return (
    <>
      {page === 'menu' && <AddRecordMenu onAction={setPage} />}
      {page === EntryRecordOption.BOTTLE && <BottleFeedEntry />}
      {page === EntryRecordOption.DIAPER && <DiaperChangeEntry />}
      {page === EntryRecordOption.NURSING && <NursingEntry />}
      {page === EntryRecordOption.PUMPING && <PumpingEntry />}
      {page === EntryRecordOption.GROWTH && <GrowthEntry />}
      {page === EntryRecordOption.NOTE && <NoteEntry />}
      {page !== 'menu' && (
        <div>
          <p>
            <button onClick={() => setPage(() => 'menu')}>Cancel</button>
          </p>
        </div>
      )}
    </>
  );
}
