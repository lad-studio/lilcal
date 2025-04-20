import React from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar } from './components/Calendar';

// Remove the CSS import since we're loading it in HTML
// import './styles.css';

// Declare the function on window
window.renderCalendar = () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <Calendar />
      </React.StrictMode>
    );
  }
}; 