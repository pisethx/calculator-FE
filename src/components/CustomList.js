import React from 'react';
import '../css/Randomizer.css';
import { useHistory } from 'react-router-dom';
import { MdSave, MdFileDownload } from 'react-icons/md';

const CustomList = () => {
    const history = useHistory();
    const handleCategories = (value) => history.push(`/${value}`);

    return (
        <div id='custom-list'>
            <h1 className='blue-color align-center scope-title'>
                <span className='yellow-color'>{'[ '}</span>Custom List
                <span className='yellow-color'>{' ]'}</span>
            </h1>
            <div className='flex-container'>
                <div className='random-result'>
                    <ol>
                        <li>one</li>
                        <li>two</li>
                        <li>three</li>
                        <li>four</li>
                        <li>five</li>
                        <li>six</li>
                        <li>seven</li>
                        <li>eight</li>
                        <li>nine</li>
                        <li>ten</li>
                        <li>eleven</li>
                    </ol>
                </div>
                <div className='random-setup'>
                    <div className='dataset'>
                        <label>Dataset</label>
                        <br />
                        <select onChange={(e) => handleCategories(e.target.value)}>
                            <option value='team-generator'>Team Generator</option>
                            <option value='name-picker'>Name Picker</option>
                            <option value='yes-or-no'>Yes or No</option>
                            <option value='decision-maker'>Decision Maker</option>
                            <option value='random-picker'>Random Picker</option>
                            <option value='custom-list' selected>
                                Custom List
                            </option>
                        </select>
                    </div>
                    <form className='data-input'>
                        <label>Items</label>
                        <br />
                        <textarea rows='10' cols='70' required />
                        <label>Quantity</label>
                        <br />
                        <input type='number' name='qtyOfRandom' min='1' max='100' placeholder='1' required />
                        <div className='check-duplicate'>
                            <input type='checkbox' />
                            <label> Duplicate</label>
                        </div>
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

export default CustomList;
