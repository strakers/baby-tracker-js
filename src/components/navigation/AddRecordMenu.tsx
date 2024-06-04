// import './menu.scss';
import { EntryRecordOption } from '../../support/entries';

type Pages = 'menu' | `${EntryRecordOption}`;

interface AddRecordMenuProps {
  onAction: React.Dispatch<React.SetStateAction<Pages>>;
}

export function AddRecordMenu({ onAction }: AddRecordMenuProps) {
  return (
    <nav>
      <p>Add New Record</p>
      <ul role="menu" className="menu menu-tray">
        <li>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onAction(() => EntryRecordOption.DIAPER);
            }}
          >
            <span className="link-icon"></span>
            <span className="link-label">Diaper Change</span>
          </a>
        </li>
        <li>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onAction(() => EntryRecordOption.BOTTLE);
            }}
          >
            <span className="link-icon"></span>
            <span className="link-label">Bottle Feed</span>
          </a>
        </li>
        <li>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onAction(() => EntryRecordOption.NURSING);
            }}
          >
            <span className="link-icon"></span>
            <span className="link-label">Nursing</span>
          </a>
        </li>
        <li>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onAction(() => EntryRecordOption.PUMPING);
            }}
          >
            <span className="link-icon"></span>
            <span className="link-label">Pumping</span>
          </a>
        </li>
        <li>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onAction(() => EntryRecordOption.GROWTH);
            }}
          >
            <span className="link-icon"></span>
            <span className="link-label">Growth</span>
          </a>
        </li>
        <li>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onAction(() => EntryRecordOption.NOTE);
            }}
          >
            <span className="link-icon"></span>
            <span className="link-label">Note</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
