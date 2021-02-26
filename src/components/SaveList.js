import React from 'react';
import '../css/SaveList.css';

const SaveList = () => {
    return (
        <div id='save-list'>
            <h1 className='blue-color align-center scope-title'>
                <span className='yellow-color'>{'[ '}</span>Save List
                <span className='yellow-color'>{' ]'}</span>
            </h1>
            <table>
                <tr>
                    <th>#</th>
                    <th>Dataset</th>
                    <th>Items</th>
                    <th>Result</th>
                    <th>Created Date</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Team Generator</td>
                    <td>Tom, Jerry, Ben, Selena, Angela, Mary</td>
                    <td>
                        <ol>
                            <li>Ben, Mary</li>
                            <li>Tom, Jerry</li>
                            <li>Selena, Angela</li>
                        </ol>
                    </td>
                    <td>26/02/2021</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Name Picker</td>
                    <td>Tom, Jerry, Ben, Selena, Angela, Mary</td>
                    <td>Jerry</td>
                    <td>26/02/2021</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Decision Maker</td>
                    <td>Thing 1, Thing 2, Thing 3</td>
                    <td>Thing 1</td>
                    <td>26/02/2021</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Custom List</td>
                    <td>Tom, Jerry, Ben, Selena, Angela, Mary</td>
                    <td>
                        <ol>
                            <li>Tom</li>
                            <li>Ben</li>
                            <li>Selena</li>
                            <li>Jerry</li>
                            <li>Mary</li>
                            <li>Angela</li>
                        </ol>
                    </td>
                    <td>26/02/2021</td>
                </tr>
            </table>
            <div>
                <button type='submit'>Export</button>
            </div>
        </div>
    );
};

export default SaveList;
