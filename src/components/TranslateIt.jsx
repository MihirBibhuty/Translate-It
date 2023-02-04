import React, { useState, useEffect } from 'react';
import Loader from './Loader';

import { ReactMic } from "react-mic";
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TranslateIt = () => {
    const [record, setRecord] = useState(false);
    const [blob, setBlob] = useState(null);
    const [base64res, setBase64res] = useState(null);
    const [accentScore, setAccentScore] = useState(null);
    const [showLoader, setShowLoader] = useState('none');

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
            setRecord(true);
        }
        else {
            SpeechRecognition.stopListening();
            setRecord(false);
        }
        setAccentScore(null);
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


    const onStop = (recordedBlob) => {
        setBlob(recordedBlob.blob);
    };
    const handleSave = (e) => {
        e.preventDefault();
        setShowLoader('flex');

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            // console.log("Base64 data: ", base64data);
            setBase64res(base64data);
        };
    };
    useEffect(() => {
        if (base64res != null) {
            const data = base64res.substring(22);
            console.log('base64 res', data);

            const options = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': 'b2c9bf1573mshda4bd3175a75a23p182364jsn66c4b9cbcd1b',
                    'X-RapidAPI-Host': 'pronunciation-assessment1.p.rapidapi.com'
                },
                body: JSON.stringify({
                    "audio_base64": `${base64res.substring(22)}`,
                    "audio_format": "m4a",
                    "text": "Say anything"
                })
            };
            fetch('https://pronunciation-assessment1.p.rapidapi.com/pronunciation', options)
                .then(response => response.json())
                .then((response) => {
                    console.log(response);
                    setAccentScore(response);
                })
                .catch(err => console.error(err));
        }
    }, [base64res]);

    useEffect(() => {
        setShowLoader('none');
    }, [accentScore]);


    return (
        <div className="full">
            <ReactMic
                record={record}
                className="soundWave"
                visualSetting="sinewave"
                onStop={onStop}
                // onData={onData}
                strokeColor="#212529"
                backgroundColor="#f9004d"
                mimeType="audio/m4a"
            />
            <div className="micBox">
                <p>Microphone: <span style={{ fontWeight: 'bold', color: `${listening ? '#f9004d' : '#c4cfde'}` }}>{listening ? 'ON' : 'OFF'}</span></p>
                <div
                    className="mic"
                    style={{ color: `${listening ? '#c4cfde' : '#f9004d'}`, backgroundColor: `${listening ? '#f9004d' : '#212428'}`, boxShadow: `${listening ? '0 10px 20px rgba(0, 0, 0, 0.6)' : '0 0 0 0'}` }}
                    onClick={handleClick}
                >
                    {
                        listening
                            ? (<i className="fas fa-pause" />)
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
                                placeholder="Enter your text here..."
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <textarea
                                spellCheck="false"
                                readOnly
                                disabled
                                className="to-text"
                                placeholder="Translation of your text..."
                                value={resultText}
                            />
                        </div>
                        {
                            accentScore
                                ? (
                                    <div className="accentPrediction" style={{ padding: '0.5rem 1rem' }}>
                                        <p>Pronunciation Accent scores:</p>
                                        <p>en-UK: <span>{accentScore.accent_predictions.en_UK}%</span></p>
                                        <p>en-US: <span>{accentScore.accent_predictions.en_US}%</span></p>
                                        <p>en-AU: <span>{accentScore.accent_predictions.en_AU}%</span></p>
                                    </div>
                                )
                                : (
                                    <div style={{ display: `${showLoader}`, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                        <Loader />
                                    </div>
                                )
                        }
                    </div>
                    <div className="buttonGroup">
                        <button onClick={translateText}>Translate Text</button>
                        <button onClick={handleSave}>Predict Accent Score</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default TranslateIt;