import './menu.scss';
// import { Link } from 'react-dom';

export function MainMenu() {
  return (
    <nav role="main">
      <ul className="menu main">
        <li>
          <a href="/">
            <span className="link-icon"></span>
            <span className="link-label">Home</span>
          </a>
        </li>
        <li>
          <a href="/">
            <span className="link-icon"></span>
            <span className="link-label">Stats</span>
          </a>
        </li>
        <li>
          <a href="/">
            <span className="link-icon"></span>
            <span className="link-label">Records</span>
          </a>
        </li>
        <li>
          <a href="/">
            <span className="link-icon"></span>
            <span className="link-label">Settings</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
