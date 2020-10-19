import React from 'react';
import './App.css';
import SimpleTime from './models/SimpleTime';
import * as TimeUtils from './utilities/TimeUtils';

function App() {

  const [textInput, setTextInput] = React.useState('');

  const handleInput = (value:string) => {
    setTextInput(value);
  }

  const renderResults = (input:string) => {
    const parsed = TimeUtils.parseRawText(input);
    const calculated = TimeUtils.calculateFormattedRow(parsed);
    return TimeUtils.summarizeFormattedRow(calculated);
  }

  return (
    <div className="App">
      <textarea
        onChange={(e) => handleInput(e.currentTarget.value)}
        value={textInput}>
      </textarea>

      <table>
        <tbody>
          {renderResults(textInput).map(row => (
          <tr key={row.title+row.duration}>
              <td>{row.title}</td>
              <td>{TimeUtils.msToHours(row.duration)}hr</td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
