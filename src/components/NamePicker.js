import React from 'react';
import '../css/Randomizer.css';
import { useHistory } from 'react-router-dom';
import { MdSave, MdFileDownload } from 'react-icons/md';

const NamePicker = () => {
    const history = useHistory();
    const handleCategories = (value) => history.push(`/${value}`);

    return (
        <div id='name-picker'>
            <h1 className='blue-color align-center scope-title'>
                <span className='yellow-color'>{'[ '}</span>Name Picker
                <span className='yellow-color'>{' ]'}</span>
            </h1>
            <div className='flex-container'>
                <div className='random-result'>
                    <p>result</p>
                </div>
                <div className='random-setup'>
                    <div className='dataset'>
                        <label>Dataset</label>
                        <br />
                        <select onChange={(e) => handleCategories(e.target.value)}>
                            <option value='team-generator'>Team Generator</option>
                            <option value='name-picker' selected>
                                Name Picker
                            </option>
                            <option value='yes-or-no'>Yes or No</option>
                            <option value='decision-maker'>Decision Maker</option>
                            <option value='random-picker'>Random Picker</option>
                        </select>
                    </div>
                    <form className='data-input'>
                        <label>Names</label>
                        <br />
                        <textarea rows='10' cols='70' required />
                        <div className='randomizer-btn'>
                            <button type='submit'>Start</button>
                        </div>
                    </form>
                    <div className='save-export'>
                        <button type='submit'>
                            <MdSave className='save-icon' />
                        </button>
                        <button type='submit'>
                            <MdFileDownload className='export-icon' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NamePicker;
