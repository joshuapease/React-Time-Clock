import React from 'react';
import './Variables.css';
import './Base.css';
import './App.css';
import * as TimeUtils from './utilities/TimeUtils';
import CHoursList from './components/CHoursList';
import CLabel from './components/CLabel';

const PLACEHOLDER = `
8:00 Drinking coffee
8:30 Coding
11:00 Planning meeting
12:00 Lunch
1:00 Coding
5:00 Head home
`.trim();

const BREAKWORDS = `
Break
Lunch
`.trim();
function App() {

  const [textInput, setTextInput] = React.useState(PLACEHOLDER);
  const [breakWords, setBreakWords] = React.useState(BREAKWORDS);

  const calculateTextInput = (input:string) => {
    const parsed = TimeUtils.parseRawText(input);
    const calculated = TimeUtils.calculateRow(parsed.filter(TimeUtils.isIParsedRow));
    return TimeUtils.summarizeRows(calculated).filter(x => x.duration > 0);
  }

  const calculatedRows = calculateTextInput(textInput);

  const breakWordsArray = breakWords.split('\n').map(x => x.trim());

  return (
    <div className="App">
      <div className="App__main">
        <textarea
          placeholder={PLACEHOLDER}
          className="App__input"
          onChange={e => setTextInput(e.currentTarget.value)}
          value={textInput}>
        </textarea>
      </div>

      <div className="App__sidebar">
        <div className="App__hours-list">
          <CHoursList
            rows={calculatedRows}
            exclusions={breakWordsArray}/>
        </div>

        <div className="App__settings">
          <CLabel htmlFor="settingsBreakWords">Break words</CLabel>
          <textarea id="settingsBreakWords" className="App__settings-input"
            onChange={e => setBreakWords(e.currentTarget.value)}
            value={breakWords}></textarea>
        </div>
      </div>
    </div>
  );
}

export default App;
