import React, { useState } from "react";
import axios from "axios";
import myData from '../data.json';
import Moment from 'react-moment';
import 'moment-timezone';

export default function TaskDetaillAddPoint(props) {
  console.log(props);
  return (
    <div className="grid grid-flow-row gap-2">
      <div className="grid grid-flow-row gap-1">
        <table className="w-full border border-gray-500">
          <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">
                  Effort Point by Task
                </th>
                <th className="px-4 py-2 text-right">
                  <input
                    type="text"
                    id="picId"
                    defaultValue={props.reqId}
                    className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg"
                  />
                </th>
                <th className="px-4 py-2 text-left w-250">
                <button 
                  type="button" 
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                  onClick={() => {
                    props.callBack("child : " + props.text);
                  }}
                >
                  Suggest
                </button>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4" >
                  Save
                </button>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="grid grid-flow-row gap-1">
        <table className="w-full border border-gray-500">
          <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">
                  Effort Point by Pharse
                </th>
                <th className="px-4 py-2 text-right">
                  <input
                    type="text"
                    id="picId"
                    className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg"
                  />
                </th>
                <th className="px-4 py-2 text-left w-250">
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                  Calc Point
                </button>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4" >
                  Save
                </button>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      
    </div>
  );
}
