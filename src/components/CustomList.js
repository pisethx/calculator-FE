import React, { useState } from "react";
import "../css/Randomizer.css";
import { useHistory } from "react-router-dom";
import { MdSave, MdFileDownload } from "react-icons/md";

import { useForm } from "react-hook-form";
import { onSubmitRandomizer } from "../service/auth";

const CustomList = () => {
  const history = useHistory();
  const handleCategories = (value) => history.push(`/${value}`);

  const [result, setResult] = useState(null);
  const { register, errors, handleSubmit } = useForm({
    criteriaMode: "all",
  });

  const onSubmit = async (data) => {
    const { id, result } = await onSubmitRandomizer(data);

    if (result) setResult(result);
  };

  return (
    <div id="custom-list">
      <h1 className="blue-color align-center scope-title">
        <span className="yellow-color">{"[ "}</span>Custom List
        <span className="yellow-color">{" ]"}</span>
      </h1>
      <div className="flex-container">
        <div className="random-result">
          <ol>{result && result.map((res) => <li>{res}</li>)}</ol>
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
              <option value="team-generator">Team Generator</option>
              <option value="name-picker">Name Picker</option>
              <option value="yes-or-no">Yes or No</option>
              <option value="decision-maker">Decision Maker</option>
              <option value="random-picker">Random Picker</option>
              <option value="custom-list" selected>
                Custom List
              </option>
            </select>
          </div>
          <form className="data-input" onSubmit={handleSubmit(onSubmit)}>
            <label>Items</label>
            <br />

            <textarea
              name="dataset"
              rows="10"
              cols="70"
              ref={register({
                required: "This is required",
              })}
            />
            <label>Quantity</label>
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

            {/* <div className="check-duplicate">
              <input type="checkbox" /> 
              <label> Duplicate</label>
            </div> */}
            <div className="randomizer-btn">
              <button type="submit">Start</button>
            </div>
          </form>
          <div className="save-export">
            <button type="submit">
              <MdSave className="save-icon" />
            </button>
            <button type="submit">
              <MdFileDownload className="export-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomList;
