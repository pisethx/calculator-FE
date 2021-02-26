import React, { useState, useEffect } from "react";
import "../css/SaveList.css";

import { getRandomizer, exportRandomzier } from "../service/auth";

const SaveList = () => {
  const [randomizerList, setRandomizerList] = useState([]);

  useEffect(async () => {
    const list = await getRandomizer();

    if (list) setRandomizerList(list);
  }, []);
  return (
    <div id="save-list">
      <h1 className="blue-color align-center scope-title">
        <span className="yellow-color">{"[ "}</span>Save List
        <span className="yellow-color">{" ]"}</span>
      </h1>
      <div id="wrapper">
        <table>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Dataset</th>
            <th>Result</th>
            <th>Created Date</th>
          </tr>
          {randomizerList &&
            randomizerList.map(
              ({ name, dataset, type, createdAt, result }, idx) => (
                <tr>
                  <td>{idx + 1}</td>
                  <td>{name}</td>
                  <td>{dataset.join(", ")}</td>
                  <td>
                    {type === "individual" ? (
                      { result }
                    ) : (
                      <ol>
                        {result.map((res) => (
                          <li>{res}</li>
                        ))}
                      </ol>
                    )}
                  </td>
                  <td>{createdAt}</td>
                </tr>
              )
            )}
        </table>
      </div>
      <div>
        <button onClick={() => exportRandomzier()} type="submit">
          Export
        </button>
      </div>
    </div>
  );
};

export default SaveList;
