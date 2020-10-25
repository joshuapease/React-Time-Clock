import React from 'react';
import './App.css';
import * as TimeUtils from './utilities/TimeUtils';

function App() {

  const [textInput, setTextInput] = React.useState('');

  const handleInput = (value:string) => {
    setTextInput(value);
  }

  const renderResults = (input:string) => {
    const parsed = TimeUtils.parseRawText(input);
    const calculated = TimeUtils.calculateFormattedRow(parsed.filter(TimeUtils.isIParsedRow));
    return TimeUtils.summarizeFormattedRow(calculated).filter(x => x.duration > 0);
  }

  return (
    <div className="App">
      <textarea
        placeholder="foo"
        className="App__input"
        onChange={(e) => handleInput(e.currentTarget.value)}
        value={textInput}>
      </textarea>

      <div className="App__hours">
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

    </div>
  );
}

export default App;
