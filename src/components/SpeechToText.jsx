import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechToText = ({ setText }) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    setText(transcript);

    return (
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <div onClick={SpeechRecognition.startListening}>
                <i className="fas fa-microphone" />
            </div>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            {/* <button onClick={resetTranscript}>Reset</button> */}
            <p>{transcript}</p>
        </div>
    )
}

export default SpeechToText;