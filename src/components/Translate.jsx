import React, { useState, useEffect } from 'react';

import Countries from '../countries';

const Translate = () => {
    useEffect(() => {
        const formText = document.querySelector('.form-text');
        const toText = document.querySelector('.to-text');
        const exchangeIcon = document.querySelector('.exchange');
        const selectIcon = document.querySelectorAll('select');
        const icons = document.querySelector('.row i');
        const translateBtn = document.querySelector('button');

        // selectIcon.forEach((tag, id) => {
        //     for (let countryCode in Countries) {
        //         let selected =
        //             id == 0
        //                 ? countryCode == "en-GB"
        //                     ? "selected"
        //                     : ""
        //                 : countryCode == "hi-IN"
        //                     ? "selected"
        //                     : "";

        //         let option = `<option ${selected} value="${countryCode}">${Countries[countryCode]}</option>`;
        //         tag.insertAdjacentHTML("beforeend", option);
        //     }
        // });

        // exchangeIcon.addEventListener("click", () => {
        //     let tempText = formText.value;
        //     let tempLang = selectIcon[0].value;
        //     formText.value = toText.value;
        //     toText.value = tempText;
        //     selectIcon[0].value = selectIcon[1].value;
        //     selectIcon[1].value = tempLang;
        // });

        translateBtn.addEventListener("click", () => {
            let text = formText.value.trim(),
                translateFrom = selectIcon[0].value,
                translateTo = selectIcon[1].value;
            if (!text) return;
            toText.setAttribute("placeholder", "Translating...");
            let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
            fetch(apiUrl).then(res => res.json()).then(data => {
                toText.value = data.responseData.translatedText;
                data.matches.forEach(data => {
                    if (data.id === 0) {
                        toText.value = data.translation;
                    }
                });
                toText.setAttribute("placeholder", "Translation");
            });
        });
    }, []);

    // const [formText, setFormText] = useState('');
    // const [toText, setToText] = useState('');

    // const handleFormChange = (e) => {
    //     setFormText(e.target.value);
    // }

    // const handleToChange = (e) => {
    //     setToText(e.target.value);
    // }

    // const handleExchange = (e) => {
    //     let tempText = formText;
    //     setFormText(toText);
    //     setToText(tempText);
    // }


    return (
        // <form>
        <div className="container">
            <div className="wrapper">
                <div className="text-input">
                    <textarea name="formText" spellCheck="false" className="form-text" placeholder="Enter text" />
                    <textarea name="toText" spellCheck="false" readOnly disabled className="to-text" placeholder="Translation" />
                </div>

                {/* <ul className="controls">
                        <li className="row from">
                            <div className="icons">
                                <i id="from" className="fas fa-volume-up"></i>
                                <i id="from" className="fas fa-copy"></i>
                            </div>
                            <select></select>
                        </li>
                        <li className="exchange" ><i className="fas fa-exchange-alt"></i></li>
                        <li className="row to">
                            <select></select>
                            <div className="icons">
                                <i id="to" className="fas fa-volume-up"></i>
                                <i id="to" className="fas fa-copy"></i>
                            </div>
                        </li>
                    </ul> */}
            </div>
            <button>Translate Text</button>
        </div>
        // </form>
    )
}

export default Translate;