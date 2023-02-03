import React, { useState } from 'react';
import 'regenerator-runtime/runtime';

import Translate from './components/Translate';
import TranslateIt from './components/TranslateIt';
import SpeechToText from './components/SpeechToText';

const App = () => {
  const [text, setText] = useState('');

  return (
    <div>
      {/* <SpeechToText setText={setText} /> */}
      <TranslateIt text={text} />
    </div>
  )
}

export default App;