import React from 'react';
import '../css/Randomizer.css';
import { useHistory } from 'react-router-dom';
import { MdSave, MdFileDownload } from 'react-icons/md';

const TeamGenerator = () => {
    const history = useHistory();
    const handleCategories = (value) => history.push(`/${value}`);

    return (
        <div id='team-generator'>
            <h1 className='blue-color align-center scope-title'>
                <span className='yellow-color'>{'[ '}</span>Team Generator
                <span className='yellow-color'>{' ]'}</span>
            </h1>
            <div className='flex-container'>
                <div className='random-result'>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan='2'>Group #</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>result</td>
                            </tr>
                            <tr>
                                <td>result</td>
                            </tr>
                        </tbody>
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan='2'>Group #</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>result</td>
                            </tr>
                            <tr>
                                <td>result</td>
                            </tr>
                        </tbody>
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan='2'>Group #</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>result</td>
                            </tr>
                            <tr>
                                <td>result</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='random-setup'>
                    <div className='dataset'>
                        <label>Dataset</label>
                        <br />
                        <select onChange={(e) => handleCategories(e.target.value)}>
                            <option value='team-generator' selected>
                                Team Generator
                            </option>
                            <option value='name-picker'>Name Picker</option>
                            <option value='yes-or-no'>Yes or No</option>
                            <option value='decision-maker'>Decision Maker</option>
                            <option value='random-picker'>Random Picker</option>
                            <option value='custom-list'>Custom List</option>
                        </select>
                    </div>
                    <form className='data-input'>
                        <label>Items</label>
                        <br />
                        <textarea name='randomize-data' required />
                        <br />
                        <label>Groups</label>
                        <br />
                        <input type='number' name='numOfGroup' min='1' max='100' placeholder='1' required />
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

export default TeamGenerator;
