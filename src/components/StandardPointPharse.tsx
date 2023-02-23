import React, { useState } from "react";

export default function StandardPointPharse() {
  const [condition, setCondition] = useState("");

  const handleConditionChange = (event) => {
    setCondition(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // onSearch(condition);
  };

  return (
    <div className="grid grid-rows-4 grid-flow-col gap-2">
      <div>
        <label htmlFor="condition" className="text-lg font-bold mb-2">
          Standard Point By Pharse
        </label>
        <input
          type="text"
          id="condition"
          value={condition}
          onChange={handleConditionChange}
          className="border border-gray-500 px-4 py-2 mb-4 rounded-lg"
        />
      </div>
      <div>
        <label htmlFor="condition" className="text-lg font-bold mb-2">
          Standard Point By Pharse
        </label>
        <input
          type="text"
          id="condition"
          value={condition}
          onChange={handleConditionChange}
          className="border border-gray-500 px-4 py-2 mb-4 rounded-lg"
        />
      </div>
    </div>
  );
}
