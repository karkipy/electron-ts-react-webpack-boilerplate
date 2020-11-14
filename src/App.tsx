import React from 'react';
import { render } from 'react-dom';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);


function App() {
  return (
    <div>
      Here app
    </div>
  );
}


render(<App />, mainElement)