import React, { useEffect, useState } from "react";
import axios from "axios";
import 'moment-timezone';
import moment from 'moment'

import { REQ_HEADER } from '../const';
import Select, { components } from "react-select";

const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "transparent";
  if (isFocused) bg = "#eee";
  if (isActive) bg = "#B2D4FF";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex "
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      <input type="checkbox" checked={isSelected} />
      {children}
    </components.Option>
  );
};
// "folder": {
//   "id": "104188201",
//   "name": "Product Backlogs",
//   "hidden": false,
//   "access": true
// },
// "space": {
//   "id": "26265831",
//   "name": "New FWD",
//   "access": true
// },

// https://api.clickup.com/api/v2/space/26265831/tag
// https://api.clickup.com/api/v2/space/26265831/folder

const allOptions = [
  {
    "value": 32151963,
    "label": "Nam Nguyen-Thai",
    "email": "nam.nguyenthai@cyberlogitec.com",
    "color": "#d60800",
    "initials": "NN",
    "profilePicture": "https://attachments.clickup.com/profilePictures/32151963_PGd.jpg",
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32188537,
    "label": "Lê Đức Anh",
    "email": "anh.ld@cyberlogitec.com",
    "color": "#7c4dff",
    "initials": "LA",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32188582,
    "label": "Dat Nguyen",
    "email": "dat.nguyentat@cyberlogitec.com",
    "color": "#d60800",
    "initials": "DN",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193031,
    "label": "Hoang Nguyen",
    "email": "hoang.nh@cyberlogitec.com",
    "color": "#aa2fff",
    "initials": "HN",
    "profilePicture": "https://attachments.clickup.com/profilePictures/32193031_nWH.jpg",
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193035,
    "label": "Tu Nguyen",
    "email": "tu.nguyen@cyberlogitec.com",
    "color": "#cddc39",
    "initials": "TN",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193037,
    "label": "VinhVo",
    "email": "vinh.vo@cyberlogitec.com",
    "color": "#b388ff",
    "initials": "V",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193040,
    "label": "Thang Nguyen",
    "email": "thang.nguyen@cyberlogitec.com",
    "color": "#d60800",
    "initials": "TN",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193042,
    "label": "Nguyễn Đình Toàn",
    "email": "toan.nguyendinh@cyberlogitec.com",
    "color": "#622aea",
    "initials": "NT",
    "profilePicture": "https://attachments.clickup.com/profilePictures/32193042_Oj5.jpg",
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193044,
    "label": "Binh Pham",
    "email": "binh.pham@cyberlogitec.com",
    "color": "#5f7c8a",
    "initials": "BP",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193054,
    "label": "Nguyen Ngoc Nam",
    "email": "nam.nguyenngoc@cyberlogitec.com",
    "color": "#0197a7",
    "initials": "NN",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193055,
    "label": "An Le",
    "email": "an.le@cyberlogitec.com",
    "color": "#3e2724",
    "initials": "AL",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193056,
    "label": "Hien Nguyen",
    "email": "hien.nguyen@cyberlogitec.com",
    "color": "#1b5e20",
    "initials": "HN",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193057,
    "label": "Huynh Nguyen",
    "email": "huynh.nh@cyberlogitec.com",
    "color": "#ffa727",
    "initials": "HN",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193058,
    "label": "Duy Tran",
    "email": "duy.tn@cyberlogitec.com",
    "color": "#81b1ff",
    "initials": "DT",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193062,
    "label": "Hanh Nguyen SD",
    "email": "hanh.nguyensd@cyberlogitec.com",
    "color": "#006063",
    "initials": "HS",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193070,
    "label": "Tam Bien",
    "email": "tam.bien@cyberlogitec.com",
    "color": "#02579b",
    "initials": "TB",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193071,
    "label": "Thinh Do",
    "email": "thinh.do@cyberlogitec.com",
    "color": "#cddc39",
    "initials": "TD",
    "profilePicture": "https://attachments.clickup.com/profilePictures/32193071_UJM.jpg",
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193072,
    "label": "PhucBN",
    "email": "phuc.bn@cyberlogitec.com",
    "color": "#ff897f",
    "initials": "P",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193073,
    "label": "Le Thanh An",
    "email": "an.lth@cyberlogitec.com",
    "color": "#02579b",
    "initials": "LA",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193074,
    "label": "Hoang Tien Dung",
    "email": "dung.hoang@cyberlogitec.com",
    "color": "#455963",
    "initials": "HD",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193080,
    "label": "Hong Minh Thu Nguyen",
    "email": "hong.nmt@cyberlogitec.com",
    "color": "#cddc39",
    "initials": "HN",
    "profilePicture": "https://attachments.clickup.com/profilePictures/32193080_5Qz.jpg",
    "profileInfo": {
        "display_profile": false,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193081,
    "label": "AnNguyen",
    "email": "an.nguyenthien@cyberlogitec.com",
    "color": "#d60800",
    "initials": "A",
    "profilePicture": "https://attachments.clickup.com/profilePictures/32193081_lCy.jpg",
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193082,
    "label": "Tran Van Dung",
    "email": "dung.tranvan@cyberlogitec.com",
    "color": "#8ac34a",
    "initials": "TD",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193084,
    "label": "Đạt Phạm",
    "email": "dat.pc@cyberlogitec.com",
    "color": "#81b1ff",
    "initials": "ĐP",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193098,
    "label": "Đặng Gia Lộc",
    "email": "loc.dang@cyberlogitec.com",
    "color": "#ff897f",
    "initials": "ĐL",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193099,
    "label": "Ky Luong",
    "email": "ky.luong@cyberlogitec.com",
    "color": "#0388d1",
    "initials": "KL",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193101,
    "label": "Trinh Le",
    "email": "trinh.le@cyberlogitec.com",
    "color": "#ffa727",
    "initials": "TL",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193102,
    "label": "Nguyen Quang Trung",
    "email": "trung.nguyenquang@cyberlogitec.com",
    "color": "#d60800",
    "initials": "NT",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193105,
    "label": "Huynh Tran Hai Long",
    "email": "long.huynh@cyberlogitec.com",
    "color": "#263238",
    "initials": "HL",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": false,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32193106,
    "label": "Nhat Pham",
    "email": "nhat.pham@cyberlogitec.com",
    "color": "#5f7c8a",
    "initials": "NP",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32203495,
    "label": "Phan Dinh Hoang",
    "email": "hoang.phan@cyberlogitec.com",
    "color": "#0197a7",
    "initials": "PH",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32205002,
    "label": "Le Linh",
    "email": "linh.le@cyberlogitec.com",
    "color": "#d60800",
    "initials": "LL",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32218133,
    "label": "Canary Pham",
    "email": "anh.pnh@cyberlogitec.com",
    "color": "#d60800",
    "initials": "CP",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32223665,
    "label": "Nguyễn Đức Thịnh",
    "email": "thinh.nguyen@cyberlogitec.com",
    "color": "#e040fb",
    "initials": "NT",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32270675,
    "label": "Ao Pham",
    "email": "ao.pham@cyberlogitec.com",
    "color": "#04a9f4",
    "initials": "AP",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": false,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32301881,
    "label": "Lien Vu",
    "email": "lien.vu@cyberlogitec.com",
    "color": "#006063",
    "initials": "LV",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32303802,
    "label": "Kham",
    "email": "kham.vu@cyberlogitec.com",
    "color": "#d60800",
    "initials": "K",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32303833,
    "label": "Dong Hoang",
    "email": "dong.hoang@cyberlogitec.com",
    "color": "#b388ff",
    "initials": "DH",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32303855,
    "label": "Phong Duong",
    "email": "phong.duong@cyberlogitec.com",
    "color": "#ffa12f",
    "initials": "PD",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": false,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32303946,
    "label": "Canh Phan",
    "email": "canh.phan@cyberlogitec.com",
    "color": "#263238",
    "initials": "CP",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32313931,
    "label": "Phuc Bui",
    "email": "phuc.bui@one-line.com",
    "color": "#f57c01",
    "initials": "PB",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32314122,
    "label": "Nguyễn Viết Lâm",
    "email": "lam.nv@cyberlogitec.com",
    "color": "#ff897f",
    "initials": "NL",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32314127,
    "label": "Đặng Hoàn Thành",
    "email": "thanh.dang@cyberlogitec.com",
    "color": "#7b68ee",
    "initials": "ĐT",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32314162,
    "label": "Hai Tran",
    "email": "hai.tr@cyberlogitec.com",
    "color": "#622aea",
    "initials": "HT",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32314163,
    "label": "Quách Đại Đức",
    "email": "duc.quach@cyberlogitec.com",
    "color": "#27AE60",
    "initials": "QĐ",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32314165,
    "label": "Khánh Huy",
    "email": "huy.doan@cyberlogitec.com",
    "color": "#8ac34a",
    "initials": "KH",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32333511,
    "label": "Trung Quach",
    "email": "trung.quach@cyberlogitec.com",
    "color": "#81b1ff",
    "initials": "TQ",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 32339519,
    "label": "Huy Pham",
    "email": "huy.pnm@cyberlogitec.com",
    "color": "#e040fb",
    "initials": "HP",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 43786720,
    "label": "Hoang Thi Thien",
    "email": "thien.hoang@cyberlogitec.com",
    "color": "#7b68ee",
    "initials": "HT",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": false,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 43791040,
    "label": "phuoc le",
    "email": "phuoc.le@cyberlogitec.com",
    "color": "#81b1ff",
    "initials": "PL",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49507726,
    "label": "Phuc Nguyen",
    "email": "phuc.nguyenhoang@cyberlogitec.com",
    "color": "#f57c01",
    "initials": "PN",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49527890,
    "label": "Uy Nguyen",
    "email": "uy.nguyen@cyberlogitec.com",
    "color": "#afb42b",
    "initials": "UN",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49534466,
    "label": "Tran My",
    "email": "my.tran@cyberlogitec.com",
    "color": "#ffa12f",
    "initials": "TM",
    "profilePicture": "https://attachments.clickup.com/profilePictures/49534466_SX0.jpg",
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49534638,
    "label": "Vy Cao",
    "email": "vy.cao@cyberlogitec.com",
    "color": "#b388ff",
    "initials": "VC",
    "profilePicture": "https://attachments.clickup.com/profilePictures/49534638_CKD.jpg",
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49534669,
    "label": "Vi Vo",
    "email": "vi.vo@cyberlogitec.com",
    "color": "#827718",
    "initials": "VV",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49534706,
    "label": "Van Huynh",
    "email": "van.huynh@cyberlogitec.com",
    "color": "#02bcd4",
    "initials": "VH",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49534719,
    "label": "Pham Vo",
    "email": "pham.vo@cyberlogitec.com",
    "color": "#b388ff",
    "initials": "PV",
    "profilePicture": "https://attachments.clickup.com/profilePictures/49534719_dvx.jpg",
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49593104,
    "label": "Nguyễn Nhật Hào",
    "email": "hao.nn@cyberlogitec.com",
    "color": "#5d4037",
    "initials": "NH",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49593105,
    "label": "Nguyen Trung Hieu",
    "email": "hieu.nt@cyberlogitec.com",
    "color": "#ff7fab",
    "initials": "NH",
    "profilePicture": "https://attachments.clickup.com/profilePictures/49593105_Eai.jpg",
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49593778,
    "label": "Bảo Dư",
    "email": "bao.du@cyberlogitec.com",
    "color": "#0ab4ff",
    "initials": "BD",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49640752,
    "label": "Trương Đình Ánh",
    "email": "anh.td@cyberlogitec.com",
    "color": "#f57c01",
    "initials": "TÁ",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49668251,
    "label": "Phuc Ho",
    "email": "phuc.ho@cyberlogitec.com",
    "color": "#5f7c8a",
    "initials": "PH",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49677506,
    "label": "Le Trong An",
    "email": "an.lt@cyberlogitec.com",
    "color": "#5d4037",
    "initials": "LA",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49677507,
    "label": "Le Minh Hy",
    "email": "hy.le@cyberlogitec.com",
    "color": "#cddc39",
    "initials": "LH",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49677667,
    "label": "Thai Thanh Xuan",
    "email": "xuan.thai@cyberlogitec.com",
    "color": "#7b68ee",
    "initials": "TX",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49696973,
    "label": "Nhung Phạm",
    "email": "nhung.pham@cyberlogitec.com",
    "color": "#ff5251",
    "initials": "NP",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49706078,
    "label": "Minh Nguyên",
    "email": "nguyen.pham@cyberlogitec.com",
    "color": "#F31D2F",
    "initials": "MN",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49712377,
    "label": "Chau Tran",
    "email": "chau.tran@cyberlogitec.com",
    "color": "#263238",
    "initials": "CT",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49715741,
    "label": "Hieu Dao",
    "email": "hieu.dao@cyberlogitec.com",
    "color": "#ea80fc",
    "initials": "HD",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49715753,
    "label": "Minh Doan",
    "email": "minh.doan@cyberlogitec.com",
    "color": "#aa2fff",
    "initials": "MD",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 49742722,
    "label": "ThaiTo",
    "email": "thai.to@cyberlogitec.com",
    "color": "#ff7fab",
    "initials": "T",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55108569,
    "label": "Tran Minh Triet",
    "email": "triet.tran@cyberlogitec.com",
    "color": "#202020",
    "initials": "TT",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55110605,
    "label": "son le",
    "email": "son.le1@cyberlogitec.com",
    "color": "#7b68ee",
    "initials": "SL",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55504602,
    "label": "Hung Lay",
    "email": "hung.lay@cyberlogitec.com",
    "color": "#81b1ff",
    "initials": "HL",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55504604,
    "label": "Nguyen Huynh Ky Khoi",
    "email": "nguyen.huynh@cyberlogitec.com",
    "color": "#f42c2c",
    "initials": "NK",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55504605,
    "label": "Nguyen Duy Vang",
    "email": "vang.nguyen@cyberlogitec.com",
    "color": "#02579b",
    "initials": "NV",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55590237,
    "label": "Tran Quang Diem",
    "email": "diem.tran@cyberlogitec.com",
    "color": "#263238",
    "initials": "TD",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55590241,
    "label": "Hoàng Nguyễn",
    "email": "hoang.nt@cyberlogitec.com",
    "color": "#afb42b",
    "initials": "HN",
    "profilePicture": "https://attachments.clickup.com/profilePictures/55590241_lB7.jpg",
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55590242,
    "label": "Ha Viet Tung",
    "email": "tung.ha@cyberlogitec.com",
    "color": "#f42c2c",
    "initials": "HT",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55625216,
    "label": "Dinh Thuan",
    "email": "thuan.lai@cyberlogitec.com",
    "color": "#f57c01",
    "initials": "DT",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": true,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55639242,
    "label": "Nguyen Van Sang",
    "email": "sang.ng@cyberlogitec.com",
    "color": "#ff7fab",
    "initials": "NS",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55673790,
    "label": "Nguyen Phan Hoai Nam",
    "email": "nam.nph@cyberlogitec.com",
    "color": "#536cfe",
    "initials": "NN",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
},
{
    "value": 55693610,
    "label": "Nguyen Huu Hoang",
    "email": "hoang.nguyenhuu@cyberlogitec.com",
    "color": "#7b68ee",
    "initials": "NH",
    "profilePicture": null,
    "profileInfo": {
        "display_profile": null,
        "verified_ambassador": null,
        "verified_consultant": null,
        "top_tier_user": null,
        "viewed_verified_ambassador": null,
        "viewed_verified_consultant": null,
        "viewed_top_tier_user": null
    }
}
];

const allStatus = [
  {
      "value": "subcat152185323_subcat24726670_subcat24726295_subcat67371792_subcat40246481_subcat38252924_subcat27722344_subcat27722322_subcat23647187_subcat23599212_subcat23564660_subcat23564619_sc23553590_Vy1k3mmq",
      "label": "to do",
      "orderindex": 0,
      "color": "#667684",
      "type": "open"
  },
  {
      "value": "subcat152185323_subcat24726670_subcat24726295_subcat67371792_subcat40246481_subcat38252924_subcat27722344_subcat27722322_subcat23647187_subcat23599212_subcat23564660_subcat23564619_sc23553590_XegbBWn6",
      "label": "pending",
      "orderindex": 1,
      "color": "#fc0",
      "type": "custom"
  },
  {
      "value": "subcat152185323_subcat24726670_subcat24726295_subcat67371792_subcat40246481_subcat38252924_subcat27722344_subcat27722322_subcat23647187_subcat23599212_subcat23564660_subcat23564619_sc23553590_18MiXDIA",
      "label": "in progress",
      "orderindex": 2,
      "color": "#ff7800",
      "type": "custom"
  },
  {
      "value": "subcat152185323_subcat24726670_subcat24726295_subcat67371792_subcat40246481_subcat38252924_subcat27722344_subcat27722322_subcat23647187_subcat23599212_subcat23564660_subcat23564619_sc23553590_eiDMzcBo",
      "label": "in review",
      "orderindex": 3,
      "color": "#3397dd",
      "type": "custom"
  },
  {
      "value": "sc152185323_x6vRfapx",
      "label": "in testing",
      "orderindex": 4,
      "color": "#25CB89",
      "type": "custom"
  },
  {
      "value": "subcat152185323_subcat24726670_subcat24726295_subcat67371792_subcat40246481_subcat38252924_subcat27722344_subcat27722322_subcat23647187_subcat23599212_subcat23564660_subcat23564619_sc23553590_9oEKh8b8",
      "label": "done",
      "orderindex": 5,
      "color": "#6bc950",
      "type": "closed"
  }
];

const allTags = [
]
export default function ClickupMgmt(props) {
  const API_CLICKUP = 'https://api.clickup.com/api/v2';

  let [taskList, setTaskList] = useState([]);
  let defaultMem = [
    {
      "value": 49593104,
      "label": "Nguyễn Nhật Hào",
      "email": "hao.nn@cyberlogitec.com",
      "color": "#5d4037",
      "initials": "NH",
      "profilePicture": null,
      "profileInfo": {
          "display_profile": null,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 49593105,
      "label": "Nguyen Trung Hieu",
      "email": "hieu.nt@cyberlogitec.com",
      "color": "#ff7fab",
      "initials": "NH",
      "profilePicture": "https://attachments.clickup.com/profilePictures/49593105_Eai.jpg",
      "profileInfo": {
          "display_profile": true,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 55673790,
      "label": "Nguyen Phan Hoai Nam",
      "email": "nam.nph@cyberlogitec.com",
      "color": "#536cfe",
      "initials": "NN",
      "profilePicture": null,
      "profileInfo": {
          "display_profile": null,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 49534719,
      "label": "Pham Vo",
      "email": "pham.vo@cyberlogitec.com",
      "color": "#b388ff",
      "initials": "PV",
      "profilePicture": "https://attachments.clickup.com/profilePictures/49534719_dvx.jpg",
      "profileInfo": {
          "display_profile": true,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 49507726,
      "label": "Phuc Nguyen",
      "email": "phuc.nguyenhoang@cyberlogitec.com",
      "color": "#f57c01",
      "initials": "PN",
      "profilePicture": null,
      "profileInfo": {
          "display_profile": null,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 55639242,
      "label": "Nguyen Van Sang",
      "email": "sang.ng@cyberlogitec.com",
      "color": "#ff7fab",
      "initials": "NS",
      "profilePicture": null,
      "profileInfo": {
          "display_profile": null,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 55625216,
      "label": "Dinh Thuan",
      "email": "thuan.lai@cyberlogitec.com",
      "color": "#f57c01",
      "initials": "DT",
      "profilePicture": null,
      "profileInfo": {
          "display_profile": true,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 49742722,
      "label": "ThaiTo",
      "email": "thai.to@cyberlogitec.com",
      "color": "#ff7fab",
      "initials": "T",
      "profilePicture": null,
      "profileInfo": {
          "display_profile": null,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 32193101,
      "label": "Trinh Le",
      "email": "trinh.le@cyberlogitec.com",
      "color": "#ffa727",
      "initials": "TL",
      "profilePicture": null,
      "profileInfo": {
          "display_profile": null,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 49534669,
      "label": "Vi Vo",
      "email": "vi.vo@cyberlogitec.com",
      "color": "#827718",
      "initials": "VV",
      "profilePicture": null,
      "profileInfo": {
          "display_profile": null,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 49640752,
      "label": "Trương Đình Ánh",
      "email": "anh.td@cyberlogitec.com",
      "color": "#f57c01",
      "initials": "TÁ",
      "profilePicture": null,
      "profileInfo": {
          "display_profile": null,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    {
      "value": 32270675,
      "label": "Ao Pham",
      "email": "ao.pham@cyberlogitec.com",
      "color": "#04a9f4",
      "initials": "AP",
      "profilePicture": null,
      "profileInfo": {
          "display_profile": false,
          "verified_ambassador": null,
          "verified_consultant": null,
          "top_tier_user": null,
          "viewed_verified_ambassador": null,
          "viewed_verified_consultant": null,
          "viewed_top_tier_user": null
      }
    },
    // {
    //   "value": 32193054,
    //   "label": "Nguyen Ngoc Nam",
    //   "email": "nam.nguyenngoc@cyberlogitec.com",
    //   "color": "#0197a7",
    //   "initials": "NN",
    //   "profilePicture": null,
    //   "profileInfo": {
    //       "display_profile": null,
    //       "verified_ambassador": null,
    //       "verified_consultant": null,
    //       "top_tier_user": null,
    //       "viewed_verified_ambassador": null,
    //       "viewed_verified_consultant": null,
    //       "viewed_top_tier_user": null
    //   }
    // },
  ]

  let defaultStatus = [
    {
      "value": "subcat152185323_subcat24726670_subcat24726295_subcat67371792_subcat40246481_subcat38252924_subcat27722344_subcat27722322_subcat23647187_subcat23599212_subcat23564660_subcat23564619_sc23553590_Vy1k3mmq",
      "label": "to do",
      "orderindex": 0,
      "color": "#667684",
      "type": "open"
    },
    {
        "value": "subcat152185323_subcat24726670_subcat24726295_subcat67371792_subcat40246481_subcat38252924_subcat27722344_subcat27722322_subcat23647187_subcat23599212_subcat23564660_subcat23564619_sc23553590_XegbBWn6",
        "label": "pending",
        "orderindex": 1,
        "color": "#fc0",
        "type": "custom"
    },
    {
        "value": "subcat152185323_subcat24726670_subcat24726295_subcat67371792_subcat40246481_subcat38252924_subcat27722344_subcat27722322_subcat23647187_subcat23599212_subcat23564660_subcat23564619_sc23553590_18MiXDIA",
        "label": "in progress",
        "orderindex": 2,
        "color": "#ff7800",
        "type": "custom"
    },
    {
        "value": "subcat152185323_subcat24726670_subcat24726295_subcat67371792_subcat40246481_subcat38252924_subcat27722344_subcat27722322_subcat23647187_subcat23599212_subcat23564660_subcat23564619_sc23553590_eiDMzcBo",
        "label": "in review",
        "orderindex": 3,
        "color": "#3397dd",
        "type": "custom"
    },
    {
        "value": "sc152185323_x6vRfapx",
        "label": "in testing",
        "orderindex": 4,
        "color": "#25CB89",
        "type": "custom"
    },
  ]
  // const [allOptions, setAllOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  function openTask(url) {
   
    window.open(url, "_blank"); //to open new page
  }
  const compareFn = (a: string, b: string) => {
    const start = a.parent;
    const end = b.parent;
    if(start > end) return -1;
    else if (start < end) return 1;
    else return 0;
  }

  async function getTask(item:any) {
    let itemTask = {};
    const config2 = {
        method: 'get',
        url: `${API_CLICKUP}/task/${item.parent}`,
        headers:  REQ_HEADER.headers
    };
    const response = axios(config2).then((res2) => {
        const data2 = res2.data;
        if(data2){
            itemTask = data2;
        }
        return itemTask;
    });
    console.log("response", response);
    return new Promise((resolve, reject) => {
        resolve(response);
    });
  }
  // setAllOptions(allOptions);
  /**
   * https://clickup.com/api/clickupreference/operation/GetTasks/
   * https://api.clickup.com/api/v2/list/{list_id}/task
   */
  const getTasks = async (listId) => {
    console.log("selectedOptions", selectedOptions);
    if(selectedOptions || selectedOptions.length == 0) {
        setSelectedOptions(defaultMem);
    }
    let assignees = selectedOptions.map(item => `assignees=${item.value}`).join('&');
    if(selectedStatus || selectedStatus.length == 0) {
        setSelectedStatus(defaultStatus);
    }
    let status = selectedStatus.map(item => `statuses=${item.label}`).join('&');
    const config = {
      method: 'get',
      url: `${API_CLICKUP}/list/${listId}/task?subtasks=true&order_by=due_date&${assignees}&` + status,
      headers:  REQ_HEADER.headers
    };
    axios(config)
    .then(async (res) => {
      const data = res.data;
      if(data && data.tasks){
        const newList = data.tasks.map(async function (item) {
            //Get task

            let parent_nm = "";
            if(item.parent){
                const task = await getTask(item);  
                if(task) {
                    parent_nm = task.name;
                }
            }
            let assignees = item.assignees.map(item => item.username).join(',');
            item.assignees_ls = assignees;
            item.creator_nm = item.creator.username;
            item.status_nm = item.status.status;
            item.status_tp = item.status.type;
            item.status_color = item.status.color;
            item.module = item.tags.length > 0 ? item.tags[0].name : "";
            if(item.due_date && item.due_date != null) {
                item.due_date_str = moment(Number(item.due_date)).format("ddd, MMM DD");
            } else {
                item.due_date_str = "";
            }
            item.parent_nm = parent_nm;
            
            return item;
        })
        console.log("newList", newList);
        const newListSrt = await Promise.all([...newList.sort(compareFn)]);
        setTaskList(newListSrt);
        // const memList = await getListMembers(listId);
        // setAllOptions(memList);
      }
      // return res.data;
    });
  }

  /**
   * 
   * @param listId 
   * https://clickup.com/api/clickupreference/operation/GetListMembers/
   */
  const getListMembers = async (listId) => {
   
    // const listId = "900800090277";
    var config = {
      method: 'get',
      url: `${API_CLICKUP}/list/${listId}/member`,
      headers:  REQ_HEADER.headers
    };
    return axios(config)
    .then(res => {
      const data = res.data;
      console.log("allOptions");
      if(data && data.members){
        const newList = data.members.map(function (item) {
        
        })
        return newList;
      }
      return [];
    });

    // return [
    //     { value: "option 1", label: "option 1" },
    //     { value: "option 2", label: "option 2" },
    //     { value: "option 3", label: "option 3" },
    //     { value: "option 4", label: "option 4" }
    // ]
  }
  // const allOptions = getListMembers(900800090277);
  return (
    <div className="grid grid-flow-col gap-2 px-4">
      <form className="grid grid-flow-row gap-2 col-span-2">
        
        <div className="grid grid-flow-row gap-1">
          <div className="grid grid-flow-col gap-1">
            <Select
              defaultValue={defaultMem}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              onChange={(options) => {
                if (Array.isArray(options)) {
                  setSelectedOptions(options);
                }
              }
              } 
              options={allOptions}
              components={{
                Option: InputOption
              }}
            />
           <button 
              type="button" 
              className="bg-blue-500 text-white py-2 px-4 rounded-lg w-100"
              onClick={ event => getTasks(900800090277)}>
              Search
            </button>
          </div>
          <div className="grid grid-flow-col gap-1">
            <Select
              defaultValue={defaultStatus}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              onChange={(options) => {
                if (Array.isArray(options)) {
                  setSelectedStatus(options);
                }
              }
              } 
              options={allStatus}
              components={{
                Option: InputOption
              }}
            />
            <Select
              components={{
                Option: InputOption
              }}
            />
            <Select
              components={{
                Option: InputOption
              }}
            />
            <Select
              components={{
                Option: InputOption
              }}
            />
            <Select
              components={{
                Option: InputOption
              }}
            />
          </div>
        </div>
        <div className="table-container-mgmt">
          <table className="w-full border border-gray-500 custom-scroll">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-2 w-30 text-center">#</th>
                <th className="px-2 py-2 w-100 text-center">ID</th>
                <th className="px-2 py-2 w-100 text-center">Module</th>
                <th className="px-2 py-2">Parent</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Assignee</th>
                <th className="px-2 py-2 w-100 text-center">Status</th>
                <th className="px-2 py-2 text-center">Due Date</th>
                <th className="px-2 py-2 text-center w-100">Created By</th>
                <th className="px-2 py-2 text-left">
                  URL
                </th>
              </tr>
            </thead>
            <tbody className="border-t">
              {taskList.map((item, idx) => (
                <tr key={item.id} className="border-t">
                  <td className="px-2 py-2 w-30 text-center">{idx + 1}</td>
                  <td className="px-2 py-2 w-100 text-center">{item.id}</td>
                  <td className="px-2 py-2 w-100 text-center">{item.module}</td>
                  <td className="px-2 py-2">{item.parent_nm}</td>
                  <td className="px-2 py-2 text-blue">
                    {item.name}
                  </td>
                  <td className="px-2 py-2">{item.assignees_ls}</td>
                  <td className="px-2 py-2 w-100 text-center" style={{
                    color: item.status_color,
                    fontWeight: "bold",

                  }}>{item.status_nm}</td>
                  <td className="px-2 py-2 text-center">{item.due_date_str}</td>
                  <td className="px-2 py-2 text-center w-100">{item.creator_nm}</td>
                  <td className="px-2 py-2 text-left">
                    <a onClick={event => openTask(item.url)}>
                        {item.url}
                    </a>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </form>
  </div>

  );
}
