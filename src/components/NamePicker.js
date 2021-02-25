import React, { useState } from "react";
import "../css/Randomizer.css";
import { MdSave, MdFileDownload } from "react-icons/md";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { onSubmitRandomizer } from "../service/auth";

const NamePicker = () => {
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
    <div id="name-picker">
      <h1 className="blue-color align-center scope-title">
        <span className="yellow-color">{"[ "}</span>Name Picker
        <span className="yellow-color">{" ]"}</span>
      </h1>
      <div className="flex-container">
        <div className="random-result">{result && <p>{result}</p>}</div>
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
              <option value="name-picker" selected>
                Name Picker
              </option>
              <option value="yes-or-no">Yes or No</option>
              <option value="decision-maker">Decision Maker</option>
              <option value="random-picker">Random Picker</option>
              <option value="custom-list">Custom List</option>
            </select>
          </div>
          <form className="data-input" onSubmit={handleSubmit(onSubmit)}>
            <label>Names</label>
            <br />
            <textarea
              name="dataset"
              rows="10"
              cols="70"
              ref={register({
                required: "This is required",
              })}
            />
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

export default NamePicker;
