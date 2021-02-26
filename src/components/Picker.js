import React, { useState, useEffect } from "react";
import "../css/Randomizer.css";
import { MdSave, MdFileDownload } from "react-icons/md";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { onSubmitRandomizer, saveRandomizer } from "../service/auth";
import { formatName, randomizers } from "../service/helper";

const Picker = ({ name, label = "Dataset", quantityLabel, type = 1 }) => {
  const history = useHistory();
  const handleCategories = (value) => history.push(`/${value}`);

  const [result, setResult] = useState(null);
  const [randomizerId, setRandomizerId] = useState(null);
  const { register, errors, reset, handleSubmit } = useForm({
    dataset: "",
    criteriaMode: "all",
  });

  useEffect(() => {
    setResult(null);
    setRandomizerId(null);
    reset();
  }, [name]);

  const onSubmit = async (data) => {
    const { id, result } = await onSubmitRandomizer(data);

    if (result) setResult(result);
    if (id) setRandomizerId(id);
  };

  return (
    <div id={name}>
      <h1 className="blue-color align-center scope-title">
        <span className="yellow-color">{"[ "}</span>
        {formatName(name)}
        <span className="yellow-color">{" ]"}</span>
      </h1>
      <div className="flex-container">
        {type === 1 && (
          <div className="random-result">{result && <p>{result}</p>}</div>
        )}

        {type === 2 && (
          <div className="random-result">
            {result?.map?.((each, i) => (
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
        )}

        {type === 3 && (
          <div className="random-result">
            <ol>
              {result?.map?.((res) => (
                <li>{res}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="random-setup">
          <div className="dataset">
            <label>Randomizer</label>
            <br />
            <select
              name="type"
              onChange={(e) => handleCategories(e.target.value)}
              ref={register({
                required: "This is required",
              })}
            >
              {randomizers?.map(({ name: _name }) => (
                <option key={_name} value={_name} selected={name === _name}>
                  {formatName(_name)}
                </option>
              ))}
            </select>
          </div>
          <form className="data-input" onSubmit={handleSubmit(onSubmit)}>
            <label>{label}</label>
            <br />
            <textarea
              name="dataset"
              rows="10"
              cols="70"
              ref={register({
                required: "This is required",
              })}
            />

            {type !== 1 && (
              <>
                <label>{quantityLabel}</label>
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
              </>
            )}

            <div className="randomizer-btn" style={{ marginTop: "20px" }}>
              <button type="submit">Start</button>
            </div>
          </form>

          {randomizerId && (
            <div className="save-export">
              <button onClick={() => saveRandomizer(randomizerId)}>
                <MdSave className="save-icon" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Picker;
