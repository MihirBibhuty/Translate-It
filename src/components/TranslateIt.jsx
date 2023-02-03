import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TranslateIt = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');

    const handleClick = () => {
        if (!listening) {
            SpeechRecognition.startListening({ continuous: true });
        }
        else {
            SpeechRecognition.stopListening();
        }
    };

    useEffect(() => {
        setInputText(transcript);
    }, [transcript]);


    const translateText = (e) => {
        e.preventDefault();
        setResultText('Translating...');

        let data = {
            q: inputText,
            source: 'en',
            target: 'hi'
        };

        axios.post(`https://libretranslate.de/translate`, data)
            .then((response) => {
                setResultText(response.data.translatedText);
            });
    };

    return (
        <div className="full">
            <div className="micBox">
                <p>Microphone: <span style={{ fontWeight: 'bold', color: `${listening ? '#d00000' : '#000'}` }}>{listening ? 'ON' : 'OFF'}</span></p>
                <div
                    className="mic"
                    style={{ color: `${listening ? '#d00000' : '#000'}`, borderColor: `${listening ? '#d00000' : '#000'}`, boxShadow: `${listening ? '0 10px 20px rgba(0, 0, 0, 0.4)' : '0 0 0 0'}` }}
                    onClick={handleClick}
                >
                    {
                        listening
                            ? <i className="fas fa-pause" />
                            : <i className="fas fa-microphone" />
                    }
                </div>
            </div>

            <form>
                <div className="container">
                    <div className="wrapper">
                        <div className="text-input">
                            <textarea
                                value={inputText}
                                spellCheck="false"
                                className="form-text"
                                placeholder="Enter text"
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <textarea
                                spellCheck="false"
                                readOnly
                                disabled
                                className="to-text"
                                placeholder="Translation"
                                value={resultText}
                            />
                        </div>
                    </div>
                    <button onClick={translateText}>Translate Text</button>
                </div>
            </form>
        </div>
    )
}

export default TranslateIt;