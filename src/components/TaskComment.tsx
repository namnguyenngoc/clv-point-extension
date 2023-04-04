import React, { useState } from "react";
import axios from "axios";
import myData from '../data.json';

export default function TaskComment(props) {
  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const currentURL = window.location.href // returns the absolute URL of a page
  const reqId = props.reqId;
  let commentList = [];
  let commentFile = [];
  let [comment, setComment] = useState([]);
  let [countFB, setCountFB] = useState(0);

  if(props.comment) {
    // setComment(JSON.parse(props.comment).lstUsrCmt);
    // let cmts = JSON.parse(props.comment);
    console.log("props.comment", props.comment);
    // if(cmts) {
    //   setComment(cmts.lstUsrCmt);
    // }
  }
  async function getComments() {
    await axios.post(`${url}/searchCommentTask`, {
      "reqId":reqId
    }).then(res => {
      console.log("Comment", res);
      commentList = res.data.lstUsrCmt;
      commentFile = res.data.lstFilesCmt;
      if(commentList) {
        let count = 0;
        for(let i = 0; i < commentList.length; i ++ ){
          if(commentList[i].cmtCtnt && commentList[i].cmtCtnt.toUpperCase().indexOf('FEEDBACK:') > 0) {
            count ++;
          }
        }
        setCountFB(count);
      }
      setComment(commentList);
      
    });
  }

  return (
    <div className="grid grid-flow-row gap-2">
      <div className="grid grid-flow-col gap-2">
        <h4>
          #{seqNo} Comment List 
        </h4>
        <div>
          {props.countFB} feedbacks.
        </div>
        
      </div>
      <div className="comment-full">
        {
          props.comment.map((item, idx) => (
            <ul key={item.pstId}>
              <li>
                { item.apverId }
              </li>
              <div dangerouslySetInnerHTML={{__html: item.cmtCtnt}}></div>
            </ul>
          ))
        }
        
      </div>
    </div>
  );
}
