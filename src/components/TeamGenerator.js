import React, { useState } from "react";
import "../css/Randomizer.css";
import { useHistory } from "react-router-dom";
import { MdSave, MdFileDownload } from "react-icons/md";

import { useForm } from "react-hook-form";
import { onSubmitRandomizer, saveRandomizer } from "../service/auth";

const TeamGenerator = () => {
  const history = useHistory();
  const handleCategories = (value) => history.push(`/${value}`);

  const [result, setResult] = useState(null);
  const [randomizerId, setRandomizerId] = useState(null);

  const { register, errors, handleSubmit } = useForm({
    criteriaMode: "all",
  });

  const onSubmit = async (data) => {
    const { id, result } = await onSubmitRandomizer(data);

    if (result) setResult(result);
    if (id) setRandomizerId(id);
  };

  return (
    <div id="team-generator">
      <h1 className="blue-color align-center scope-title">
        <span className="yellow-color">{"[ "}</span>Team Generator
        <span className="yellow-color">{" ]"}</span>
      </h1>
      <div className="flex-container">
        <div className="random-result">
          {result &&
            result.map((each, i) => (
              <table key={"table-" + i}>
                <thead>
                  <tr>
                    <th colSpan="2">Group #{i + 1}</th>
                  </tr>
                </thead>
                <tbody>
                  {each &&
                    each.map((item, j) => (
                      <tr key={"tr-" + j}>
                        <td>{item}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ))}
        </div>
        <div className="random-setup">
          <div className="dataset">
            <label>Dataset</label>
            <br />
            <select
              name="type"
              onChange={(e) => handleCategories(e.target.value)}
              ref={register({
                required: "This is required",
              })}
            >
              <option value="team-generator" selected>
                Team Generator
              </option>
              <option value="name-picker">Name Picker</option>
              <option value="yes-or-no">Yes or No</option>
              <option value="decision-maker">Decision Maker</option>
              <option value="random-picker">Random Picker</option>
              <option value="custom-list">Custom List</option>
            </select>
          </div>
          <form className="data-input" onSubmit={handleSubmit(onSubmit)}>
            <label>Items</label>
            <br />
            <textarea
              name="dataset"
              ref={register({
                required: "This is required",
              })}
            />
            <br />
            <label>Groups</label>
            <br />
            <input
              type="number"
              name="quantity"
              min="1"
              max="100"
              defaultValue={1}
              placeholder="1"
              ref={register({
                required: "This is required",
              })}
            />
            <div className="randomizer-btn">
              <button type="submit">Start</button>
            </div>
          </form>
          <div className="save-export">
            <button
              disabled={!randomizerId}
              onClick={() => saveRandomizer(randomizerId)}
            >
              <MdSave className="save-icon" />
            </button>
            {/* Download All in Saved List */}
            {/* <button type="submit">
              <MdFileDownload className="export-icon" />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamGenerator;
