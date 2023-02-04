import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";

const AudioRecord = () => {
    const [record, setRecord] = useState(false);
    const [blob, setBlob] = useState(null);
    const [base64res, setBase64res] = useState(null);

    const startRecording = () => {
        setRecord(true);
    };

    const stopRecording = () => {
        setRecord(false);
    };

    const onData = (recordedBlob) => {
        // console.log("chunk of real-time data is: ", recordedBlob);
    };

    const onStop = (recordedBlob) => {
        setBlob(recordedBlob.blob);
    };

    const handleSave = () => {
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
                .then(response => console.log(response))
                .catch(err => console.error(err));
        }
    }, [base64res]);

    return (
        <div>
            <ReactMic
                record={record}
                className="sound-wave"
                onStop={onStop}
                onData={onData}
                strokeColor="#000000"
                backgroundColor="#FF4081"
                mimeType="audio/m4a"
            />
            <button onClick={startRecording} type="button">
                Start
            </button>
            <button onClick={stopRecording} type="button">
                Stop
            </button>
            {blob ? (
                <button onClick={handleSave} type="button">
                    Save
                </button>
            ) : null}
        </div>
    );
};

export default AudioRecord;
