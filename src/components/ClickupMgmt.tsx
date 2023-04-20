import React, { useState, CSSProperties } from "react";
import axios from "axios";
import 'moment-timezone';
import moment from 'moment'

import { REQ_HEADER } from '../const';
import Select, { components } from "react-select";
import ScaleLoader from "react-spinners/ScaleLoader";

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
        "value": 49534669,
        "label": "Vi Vo",
        "email": "vi.vo@cyberlogitec.com",
        "color": "#827718",
        "initials": "VV",
        "profilePicture": null,
        "scope": "TEST",
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
        "scope": "TEST",
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
  },
  {
    "value": "2",
    "label": "code review",
    "orderindex": 4,
    "color": "#25CB89",
    "type": "custom"
},
{
    "value": "3",
    "label": "design approval",
    "orderindex": 4,
    "color": "#25CB89",
    "type": "custom"
},
{
    "value": "4",
    "label": "po review",
    "orderindex": 4,
    "color": "#25CB89",
    "type": "custom"
},
];

const allTags = [
    {
        "value": "accounting",
        "label": "accounting",
        "tag_fg": "#FF7FAB",
        "tag_bg": "#FF7FAB",
        "creator": 32188582
    },
    {
        "value": "dashboard",
        "label": "dashboard",
        "tag_fg": "#7C4DFF",
        "tag_bg": "#7C4DFF",
        "creator": 32188582
    },
    {
        "value": "system",
        "label": "system",
        "tag_fg": "#BF55EC",
        "tag_bg": "#BF55EC",
        "creator": 32188582
    },
    {
        "value": "shipment",
        "label": "shipment",
        "tag_fg": "#E50000",
        "tag_bg": "#E50000",
        "creator": 32188582
    },
    {
        "value": "mobile",
        "label": "mobile",
        "tag_fg": "#0231E8",
        "tag_bg": "#0231E8",
        "creator": 32188582
    },
    {
        "value": "masterdata",
        "label": "master data",
        "tag_fg": "#800000",
        "tag_bg": "#800000",
        "creator": 32193035
    },
    {
        "value": "visibility",
        "label": "visibility",
        "tag_fg": "#F900EA",
        "tag_bg": "#F900EA",
        "creator": 32188582
    },
    {
        "value": "tradepartnermgmt",
        "label": "trade partner mgmt",
        "tag_fg": "#81B1FF",
        "tag_bg": "#81B1FF",
        "creator": 32193035
    },
    {
        "value": "reporting",
        "label": "reporting",
        "tag_fg": "#EA80FC",
        "tag_bg": "#EA80FC",
        "creator": 32188582
    },
    {
        "value": "admin",
        "label": "admin",
        "tag_fg": "#9B59B6",
        "tag_bg": "#9B59B6",
        "creator": 32188582
    },
    {
        "value": "sales",
        "label": "sales",
        "tag_fg": "#FF4081",
        "tag_bg": "#FF4081",
        "creator": 32188582
    }
        
]

const allEpic = [
        {
            "value": "152185323",
            "label": "🏆 Epics",
            "orderindex": 6,
            "status": null,
            "priority": null,
            "assignee": null,
            "task_count": 111,
            "due_date": null,
            "start_date": null,
            "folder": {
                "id": "104188201",
                "name": "Product Backlogs",
                "hidden": false,
                "access": true
            },
            "space": {
                "id": "26265831",
                "name": "New FWD",
                "access": true
            },
            "archived": false,
            "override_statuses": true,
            "permission_level": "create"
        },
        {
            "value": "900800090277",
            "label": "🏆 Epics - Target 1",
            "orderindex": 8,
            "status": null,
            "priority": null,
            "assignee": null,
            "task_count": 63,
            "due_date": null,
            "start_date": null,
            "folder": {
                "id": "104188201",
                "name": "Product Backlogs",
                "hidden": false,
                "access": true
            },
            "space": {
                "id": "26265831",
                "name": "New FWD",
                "access": true
            },
            "archived": false,
            "override_statuses": true,
            "permission_level": "create"
        },
        {
            "value": "900800996894",
            "label": "🏆 Epics - Target 2",
            "orderindex": 9,
            "content": "",
            "status": null,
            "priority": null,
            "assignee": null,
            "task_count": 10,
            "due_date": null,
            "start_date": null,
            "folder": {
                "id": "104188201",
                "name": "Product Backlogs",
                "hidden": false,
                "access": true
            },
            "space": {
                "id": "26265831",
                "name": "New FWD",
                "access": true
            },
            "archived": false,
            "override_statuses": false,
            "permission_level": "create"
        }
    ]

const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "#36d7b7",
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgb(255, 255, 255, 0.4)",
        textAlign: "center",
        paddingTop: "21%",
    };
export default function ClickupMgmt(props) {
  const API_CLICKUP = 'https://api.clickup.com/api/v2';
  const API_WORKNG = 'http://anvatchibeo.ddns.net:9789/api';

  let [taskList, setTaskList] = React.useState([]);
  let [originTaskList, setOriginTaskList] = useState([]);

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
      "scope": "TEST",
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
      "scope": "TEST",
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
    {
        "value": "2",
        "label": "code review",
        "orderindex": 4,
        "color": "#25CB89",
        "type": "custom"
    },
    {
        "value": "3",
        "label": "design approval",
        "orderindex": 4,
        "color": "#25CB89",
        "type": "custom"
    },
    {
        "value": "4",
        "label": "po review",
        "orderindex": 4,
        "color": "#25CB89",
        "type": "custom"
    },
  ]

  let defaultTags = [
    // {
    //     "value": "accounting",
    //     "label": "accounting",
    //     "tag_fg": "#FF7FAB",
    //     "tag_bg": "#FF7FAB",
    //     "creator": 32188582
    // },
    // {
    //     "value": "sales",
    //     "label": "sales",
    //     "tag_fg": "#FF4081",
    //     "tag_bg": "#FF4081",
    //     "creator": 32188582
    // }
        
]

let defaultEpic = 
    {
        "value": "900800090277",
        "label": "🏆 Epics - Target 1",
        "orderindex": 8,
        "status": null,
        "priority": null,
        "assignee": null,
        "task_count": 63,
        "due_date": null,
        "start_date": null,
        "folder": {
            "id": "104188201",
            "name": "Product Backlogs",
            "hidden": false,
            "access": true
        },
        "space": {
            "id": "26265831",
            "name": "New FWD",
            "access": true
        },
        "archived": false,
        "override_statuses": true,
        "permission_level": "create"
    }
;
  // const [allOptions, setAllOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(defaultMem);
  const [selectedStatus, setSelectedStatus] = useState(defaultStatus);
  const [selectedTags, setSelectedTags] = useState(defaultTags);
  const [selectEpic, setSelectEpic] = useState(defaultEpic);
  const [oneSelectMember, setOneSelectMember] = useState({});
  const [taskName, setTaskName] = useState("");
  const [idList, setIdList] = useState("");
  const [page, setPage] = useState(1);
  const [countId, setCountId] = useState(0);
  
  let isEnableSearch = false;
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#0E71CC");

//   setSelectedOptions(defaultMem);
//   setSelectedStatus(defaultStatus);
//   setSelectedTags(defaultTags);
//   window['chrome'].storage?.local.set({defaultMem});
//   window['chrome'].storage?.local.set({defaultStatus});
//   window['chrome'].storage?.local.set({defaultTags});

  function openTask(url) {
   
    window.open(url, "_blank"); //to open new page
  }
  const compareFn = (a: any, b: any) => {
    const start = a.parent == null ? a.id : a.parent;
    const end = b.parent == null ? b.id : b.parent;
    if(start < end) return 1;
    else if (start > end) return -1;
    else return 0;
  }

  const compareFn2 = (a: any, b: any) => {
    const start = a.orderindex;
    const end = b.orderindex;
    if(a.parent_nm == b.parent_nm) {
        if(start < end) return -1;
        else if (start > end) return 1;
        else return 0;
    } else {
        return 0;
    }
    
  }
  async function getTask(item:any) {
    let itemTask = {};
    const config2 = {
        method: 'get',
        url: `${API_CLICKUP}/task/${item.parent}?subtasks=true`,
        headers:  REQ_HEADER.headers,
        delayed: false  // use this custom option to allow overrides
    };
    const response = axios(config2).then((res2) => {
        const data2 = res2.data;
        if(data2){
            itemTask = data2;
        }
        return itemTask;
    });
    return new Promise((resolve, reject) => {
        resolve(response);
    });
  }

  const checkStatus = (statusNm: any, listStatusValid: any) => {
    if (!statusNm && !listStatusValid) return true;

    let result = listStatusValid.find(item => item.label == statusNm);
    if (result > 0) {
        return true;
    }
    return false

  }
  // setAllOptions(allOptions);
  /**
   * https://clickup.com/api/clickupreference/operation/GetTasks/
   * https://api.clickup.com/api/v2/list/{list_id}/task
   */
  const getTasks = async (listId) => {
    isEnableSearch = true;
    setLoading(true);
    setTaskList([]);
    setOriginTaskList([]);
    // if(selectedOptions || selectedOptions.length == 0) {
    //     setSelectedOptions(defaultMem);
    //     // _url = `${API_CLICKUP}/list/${listId}/task?subtasks=true&` + status;
    // }

    
    // if(selectedStatus || selectedStatus.length == 0) {
    //     setSelectedStatus(defaultStatus);
    //     // _url = `${API_CLICKUP}/list/${listId}/task?subtasks=true`;
    // }
   
    let assignees = selectedOptions.map(item => `assignees=${item.value}`).join('&');
    let status = selectedStatus.map(item => `statuses=${item.label}`).join('&');
    let tags = selectedTags.map(item => `tags=${item.label}`).join('&');
    let promiseTask = [];
    let lsFinalParent = [];
    for(let iPage = 0; iPage < page; iPage ++) {
        let  _url = `${API_CLICKUP}/list/${listId}/task?subtasks=true&page=${iPage}`;
        // let _url = `${API_CLICKUP}/list/${listId}/task?subtasks=true&${assignees}&` + status;
        if(selectedOptions && selectedOptions.length > 0) {
            _url += `&` + assignees;
        }

        if(selectedStatus && selectedStatus.length > 0) {
            _url += `&` + status;
        }

        if(selectedTags && selectedTags.length > 0) {
            _url += `&` + tags;
        }
    
        const config = {
            method: 'get',
            url: _url,
            headers:  REQ_HEADER.headers,
            delayed: false  // use this custom option to allow overrides
        };
        const apiResponseTask =  axios(config).then(async (res) => {
            const data = res.data;
            // console.log("data", data);
            if(data && data.tasks) {
                return data.tasks;
            }
            return [];
        });
        const pm = await Promise.resolve(apiResponseTask);
        promiseTask.push(pm);
    }
    // console.log("promiseTask", promiseTask);
    const result = await Promise.all(promiseTask).then(async (data) => {
        // console.log("data", data);
        if(data && data.length > 0) {
            let arr = [];
            for(let i = 0; i < data.length; i ++) {
                if(data[i].length > 0) {
                    arr = [...arr, ...data[i]];
                }
            }

            //Process mapping name

            // console.log("arr", arr);
            const resultTaskList = await Promise.resolve(genTaskInformation(arr));
            // console.log("resultTaskList", resultTaskList);
            setTaskList(resultTaskList);
            setOriginTaskList(resultTaskList);
            setLoading(false);
        }
    });

   
    
  }

  const genTaskInformation = async (taskList: any) => {
    if(taskList) {
        let uniqueIds = [];
        let finalListTask = [];
        let lsFinalParent = [];
        const lsMainParent = [...taskList.filter(item => item.parent == null)];
        const parentNotExitsTmp = [...taskList.filter(item => item.parent != null && lsMainParent.find(item2 => item2.id == item.parent) == undefined)];
        if(parentNotExitsTmp){
            const parentNotExits = [...parentNotExitsTmp.filter(element => {
                const isDuplicate = uniqueIds.includes(element.parent);
            
                if (!isDuplicate) {
                    //check status
                    let isAdd = true;
                    if(status && status.length > 0){
                        isAdd = checkStatus(element.status.status, selectedStatus);
                    }

                    if(isAdd){
                        uniqueIds.push(element.parent);

                    }
                    return true;
                }
            
                return false;
            })];
        }

        //get parent infor
        let parentMissingArr = [];
        if(uniqueIds && uniqueIds.length > 0){
            for(let i = 0; i < uniqueIds.length; i ++) {
                
                let task = await getTask({
                    parent: uniqueIds[i]
                });  

                if(task.parent) {
                    task = await getTask({
                        parent: task.parent
                    });  
                }

                let assignees = task.assignees.map(item => item.username).join(',');
                task.assignees_ls = assignees;
                task.creator_nm = task.creator.username;
                task.status_nm = task.status.status;
                task.status_tp = task.status.type;
                task.status_color = task.status.color;
                task.module = task.tags.length > 0 ? task.tags[0].name : "";
                if(task.due_date && task.due_date != null) {
                    task.due_date_str = moment(Number(task.due_date)).format("ddd, MMM DD");
                } else {
                    task.due_date_str = "";
                }
                task.parent_nm = task.name;
                // taskListByParent.push(item); // push parent;
                const isExit = parentMissingArr.find(item => item.id == task.id);
                if(task && isExit == undefined) {
                    parentMissingArr.push(task);
                }
                
            
            }
        }

        lsFinalParent = lsMainParent.concat(await Promise.all([...parentMissingArr]));
        // let lsFinalParent = lsMainParent.concat([...parentMissingArr]);
        // console.log("lsFinalParent", lsFinalParent);
        lsFinalParent.map(function(item) {
            let _assignees = item.assignees.map(item4 => item4.username).join(',');
            item.assignees_ls = _assignees;
            item.creator_nm = item.creator.username;
            item.status_nm = item.status.status;
            item.status_tp = item.status.type;
            item.status_color = item.status.color;
            item.module = item.tags.length > 0 ? item.tags[0].name : "";
            if(item.due_date && item.due_date != null) {
                item.due_date_str = moment(Number(item.due_date)).format("MM-DD-YYYY");
            } else {
                item.due_date_str = "";
            }
            item.USP = splitUSP(item);

            finalListTask.push(item);

            let lsTaskByParent = [...taskList.filter(item2 => item2.parent == item.id)];
            if(lsTaskByParent){
                // console.log("lsTaskByParent", lsTaskByParent);
                lsTaskByParent.map(function(item3) {
                    let assignees = item3.assignees.map(item => item.username).join(',');
                    item3.assignees_ls = assignees;
                    // item3.username = assignees;
                    item3.creator_nm = item3.creator.username;
                    item3.status_nm = item3.status.status;
                    item3.status_tp = item3.status.type;
                    item3.status_color = item3.status.color;
                    item3.module = item3.tags.length > 0 ? item3.tags[0].name : "";
                    if(item3.due_date && item3.due_date != null) {
                        item3.due_date_str = moment(Number(item3.due_date)).format("MM-DD-YYYY");
                    } else {
                        item3.due_date_str = "";
                    }
                    item3.USP = splitUSP(item3);
                    if (moment(Number(item3.due_date)) < moment(new Date())) {
                        item3.class_over = "over-due-date";
                    } else if (moment(Number(item3.due_date)) == moment(new Date())) {
                        item3.class_over = "due-date";
                    }
                
                })
                finalListTask = [...finalListTask, ...lsTaskByParent];
            }
        });
    
    
        isEnableSearch = false;
        // const memList = await getListMembers(listId);
        // setAllOptions(memList);
        return finalListTask;

    }
  } //End GenTask

  const splitUSP = (item: any) => {
    let usp = {
        dev_nm: "",
        dev_point: 0,
        test_nm: "",
        test_point: 0,
        cross_nm: "",
        cross_point: 0
    }

    if(item && item.name) {
        let regexp = /\[(.*?)\]/gi;
        const matches = item.name.matchAll(regexp);
        // let arr = item.name.match(regexp);
       
        for (const match of matches) {
            // console.log(match);
            // console.log(match.index);
            if(match) {
                let arr = match[1].split(":");
                let scope = [];
                let point = [];
                if(arr.length == 2) { //dev & Test
                    scope = arr[0].split("-");
                    point = arr[1].split("-");
                }
                let arrAssignees =  (item.assignees_ls && item.assignees_ls.length > 0) ? item.assignees_ls.split(",") : [];

                let devArr = [];
                let testArr = [];

                if(arrAssignees && arrAssignees.length > 0) {
                    for(let i = 0; i < arrAssignees.length; i ++){
                        let mem = allOptions.filter(item => item.label == arrAssignees[i]);

                        if(mem && mem.length > 0) {
                            if("TEST" == mem[0].scope) {
                                testArr.push(mem[0].label);
                            } else {
                                devArr.push(mem[0].label);
                            } 

                        }
                    }
                }
                
                usp.dev_nm = (devArr && devArr.length > 0) ? devArr.join(",") : "";
                usp.dev_point = (point && point.length > 0) ? point[0] : "";
                usp.test_nm = (testArr && testArr.length > 0) ? testArr.join(",") : "";
                usp.test_point = (point && point.length > 1) ? point[1] : "";
            }
        }
    }
    return usp;

  }

  const filterTaskList = async (member: any) => {
    setTaskList([]);
    let originList = [...originTaskList];
    let filterList = [];
    if(member && member.value){
        filterList = originList.filter(item => 
            item.assignees.filter(item3=>item3.username === member.label).length > 0
            

        );
        setTaskList(filterList);

    } else {
        setTaskList(originList);
    }
    
  }

  const filterTaskContent = (type) =>{
    setTaskList([]);
    let originList = [...originTaskList];
    let filterList = [];
    console.log("ty", type);
    if(type) {
        
        filterList = originList.filter(function (item) { 
            let flag = "";
            if (moment(Number(item.due_date)) < moment(new Date())) {
                flag = "over-due-date";
            } else if (moment(Number(item.due_date)) == moment(new Date())) {
                flag = "today";
            } else {
                let usp = splitUSP(item);
                if(usp.test_nm && usp.length > 0) {
                    flag = "dev-test";
                }
            }
            if(flag == type) {
                return item;
            }
            
        });
        setTaskList(filterList);
    } else {
        setTaskList(originList);
    }

  };

  const filterTaskLContent = async (name: any) => {
    setTaskList([]);
    let originList = [...originTaskList];
    let filterList = [];
    if(name && name.target && name.target.value && name.target.value.length > 0){
        let nameCondition = name.target.value;
        filterList = originList.filter((item) => { 
                let firstCharacter = Array.from(nameCondition)[0];
                if("#" == firstCharacter){
                    return item.id.toUpperCase().includes(nameCondition.replace("#", "").toUpperCase());

                } else {
                    let tmp = item.name;
                    if(item.parent_nm && item.parent_nm.length > 0){
                        tmp = `${tmp} ${item.parent_nm}`;
                    }
                    
                    return tmp.toUpperCase().includes(nameCondition.toUpperCase());
                }            
            }
        );
        setTaskList(filterList);

    } else {
        setTaskList(originList);
    }
    
  }
  
  const onChangeTaskList = (event: any) => {
    event.preventDefault(); // Otherwise the form will be submitted

    let ids = event.target.value.trim();
    let taskIdArr = ids.split("\n");
    setCountId(taskIdArr ? taskIdArr.length : 0);
    setIdList(ids);
   
  }
//   useEffect(() => { searchTaskById()})}

    const searchTaskById = async (event: any) => {  
    // useEffect(() => { 
        setLoading(true);
        setTaskList([]);
        if(idList && idList.length > 0) {
            let taskIdArr = idList.split("\n");
           
            if(taskIdArr && taskIdArr.length > 0) {
                let promiseTaskID = [];

                for( let i = 0; i < taskIdArr.length; i ++) {
                    let task = getTask({
                        parent: taskIdArr[i].trim()
                    });
                    if(task) {
                        //Check parent
                        let parent = null;
                        if(task.parent) {
                            parent = getTask({
                                parent: task.parent
                            });  
                        }
                        const pm = await Promise.resolve(task);
                        promiseTaskID.push(pm);
                    }
                
                }


                //Process data
                const result = await Promise.all(promiseTaskID).then(async (data) => {
                    // console.log("data", data);
                    let finalListTask = [];
                    if(data && data.length > 0) {
                        data.map(function (task) {
                            const assignees = task.assignees.map(item => task.username).join(',');
                            task.assignees_ls = assignees;
                            task.creator_nm = task.creator.username;
                            task.status_nm = task.status.status;
                            task.status_tp = task.status.type;
                            task.status_color = task.status.color;
                            task.module = task.tags.length > 0 ? task.tags[0].name : "";
                            if(task.due_date && task.due_date != null) {
                                task.due_date_str = moment(Number(task.due_date)).format("MM-DD-YYYY");
                            } else {
                                task.due_date_str = "";
                            }
                            if(parent && parent != null) {
                                task.parent_nm = parent.name;
                            }
                            task.USP = splitUSP(task);
                            finalListTask.push(task);
                        })

                        setTaskList(finalListTask);
                        setOriginTaskList(finalListTask);
                        setLoading(false);
                    }
                });

              
            
            }
            
        };
    // })

  }
  const bpSearchRequirement = async (prjId: string, reqTitNm: string) => {
    // API_WORKNG
    const data = {
        "reqBody": {
            "pjtId": prjId,
            "reqNm": reqTitNm,
            "advFlg": "N",
            "reqStsCd": [
                "REQ_STS_CDPRC",
                "REQ_STS_CDOPN"
            ],
            "jbTpCd": "_ALL_",
            "itrtnId": "_ALL_",
            "beginIdx": 0,
            "endIdx": 200,
            "picId": "_ALL_"
        }
      };
    // let lsPharseMember = requirementDetail.lstSkdUsr
    const config = {
        method: 'post',
        url: `${API_WORKNG}/searchRequirement`,
        // headers:  REQ_HEADER.headers,
        delayed: false,  // use this custom option to allow overrides
        data: data
    };
    // const apiResponseTask =  axios(config).then(async (res) => {
    //     // const data = res.data;
    //     console.log("data", res.data.lsReq);
    //     return res.data.lsReq;
    // });

    const response = await axios
        .request({
            url:  `${API_WORKNG}/searchRequirement`,
            method: "POST",
            data: data,
            //     proxy: {
            //     host: "103.155.217.105",
            //     port: 41416,
            // },
        })
        .then((response) => {
            return  response.data.lsReq;
        })
        .catch((error) => {
            console.log(error);
        });
        
    const pm = Promise.resolve(response);
    return pm;

  }

  const syncBlueprint = async () => {
    // API_WORKNG
    const prjId = "PJT20211119000000001";
    let promiseArr = [];
   
    // setLoading(true);
    if(originTaskList) {
        // bpSearchRequirement
        console.log("originTaskList", originTaskList);
        for(let i = 0; originTaskList.length; i++) {
            const item = originTaskList[i];
            if(item && item.name) {
                const promise = await bpSearchRequirement(prjId, item.name);
                // const pm = Promise.resolve(promise);
                // promiseArr.push(promise);
                originTaskList.blueprint = promise[0];
                console.log("originTaskList", JSON.stringify(promise[0]));
            }
           
        }
        setTaskList(originTaskList);
        setLoading(false);
        console.log("originTaskList", originTaskList);
        // const result = await Promise.all(promiseArr).then(async (data) => {
        //     console.log("data", JSON.stringify(data));
        // //     let finalListTask = [];
        // //     if(data && data.length > 0) {
        // //         // data.map(function (task) {
        // //         //     // const assignees = task.assignees.map(item => task.username).join(',');
        // //         //     // task.assignees_ls = assignees;
        // //         //     // task.creator_nm = task.creator.username;
        // //         //     // task.status_nm = task.status.status;
        // //         //     // task.status_tp = task.status.type;
        // //         //     // task.status_color = task.status.color;
        // //         //     // task.module = task.tags.length > 0 ? task.tags[0].name : "";
        // //         //     // if(task.due_date && task.due_date != null) {
        // //         //     //     task.due_date_str = moment(Number(task.due_date)).format("MM-DD-YYYY");
        // //         //     // } else {
        // //         //     //     task.due_date_str = "";
        // //         //     // }
        // //         //     // if(parent && parent != null) {
        // //         //     //     task.parent_nm = parent.name;
        // //         //     // }
        // //         //     // task.USP = splitUSP(task);
        // //         //     // finalListTask.push(task);
        // //         // })

        // //         setTaskList(finalListTask);
        //         setLoading(false);
        // //     }
        // }) .catch((error) => {
        //     console.log(error);
        //     setLoading(false);
        // });


    //     const pm = await Promise.resolve(apiResponseTask);
    //     promiseTask.push(pm);
    // }
    // // console.log("promiseTask", promiseTask);
    // const result = await Promise.all(promiseTask).then(async (data) => {
    //     // console.log("data", data);
    //     if(data && data.length > 0) {
    //         let arr = [];
    //         for(let i = 0; i < data.length; i ++) {
    //             if(data[i].length > 0) {
    //                 arr = [...arr, ...data[i]];
    //             }
    //         }

    //         //Process mapping name

    //         // console.log("arr", arr);
    //         const resultTaskList = await Promise.resolve(genTaskInformation(arr));
    //         // console.log("resultTaskList", resultTaskList);
    //         setTaskList(resultTaskList);
    //         setOriginTaskList(resultTaskList);
    //         setLoading(false);
    //     }
    // });
    } else {
        setLoading(false);
    }

  }

  const setPageSearch = (val) => {
    if(val > 0) {
        setPage(val);
    } else {
        setPage(1);
    }
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
      headers:  REQ_HEADER.headers,
      delayed: false  // use this custom option to allow overrides
    };
    return axios(config)
    .then(res => {
      const data = res.data;
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
    <div className="grid grid-flow-col gap-2 px-4 sweet-loading">
      <form>
        <div className="grid grid-flow-row gap-2 col-span-2">
            <div className="flex flex-flow-col gap-1">
                <div className="grid grid-flow-row gap-3 w-full">
                    <div className="flex flex-flow-col gap-1">
                        <div className="w-300">
                            <Select
                                defaultValue={defaultEpic}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                onChange={(options) => {
                                    setSelectEpic(options);
                                }
                                } 
                                options={allEpic}
                                components={{
                                    Option: InputOption
                                }}
                            />
                        </div>
                        <div className="w-300">
                            <Select
                            defaultValue={defaultTags}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            onChange={(options) => {
                                    if (Array.isArray(options)) {
                                        setSelectedTags(options);
                                    }
                                }
                            } 
                            options={allTags}
                            components={{
                                Option: InputOption
                            }}
                            />
                        </div>
                        <div>
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
                        
                        </div>
                    </div>
                    <div className="flex flex-flow-col gap-1">
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
                        <div className="w-100">
                            <input
                                type="text"
                                defaultValue={page}
                                className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg w-100"
                                onChange={(event) => { setPageSearch(event.target.value)}}
                            />
                        </div>
                        <button 
                            type="button" 
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg w-100"
                            onClick={ event => getTasks(selectEpic.value)}>
                            Search
                        </button>
                    </div>
                </div>
                <div className="grid grid-flow-row gap-1 w-300">
                    <textarea
                        type="text"
                        className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg w-300"
                        onChange={(event) => {onChangeTaskList(event)}}
                    />
                    <button 
                        type="button" 
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg w-150"
                        onClick={ event => syncBlueprint()}>
                            SYNC BLUEPRINT
                    </button>
                    <button 
                        type="button" 
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg w-150"
                        onClick={ event => searchTaskById()}>
                            Get Task By Ids ({countId})
                    </button>
                </div>
                
            </div>
            
            <div className="table-container-mgmt">
                
                <div className="flex flex-flow-col gap-1">
                    <div className="w-100 vertical-middle">
                    Size: {taskList.length}
                    </div>
                    <div className="grid grid-flow-col w-500">
                        <div className="over-due-date"
                          onClick={ event => filterTaskContent("over-due-date")}
                        >
                        OVER DUE-DATE 
                        </div>
                        <div className="due-date-lbl"
                        onClick={ event => filterTaskContent("today")}>
                        TODAY 
                        </div>
                        <div className="dev-test"
                        onClick={ event => filterTaskContent("dev-test")}>
                        DEV & TEST 
                        </div>
                        <div
                        onClick={ event => filterTaskContent()}>
                            ALL
                        </div>
                    </div>
                
                    <div className="w-100 vertical-middle text-right">
                        Filter:
                    </div>
                    <div className="w-full">
                        <input
                            type="text"
                            className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg w-full"
                            onChange={(value) => {filterTaskLContent(value)}}
                        />
                    </div>
                    <div className="w-500">
                        <Select
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            isMulti
                            options={defaultMem}
                            onChange={(options) => {
                                    if (Array.isArray(options)) {
                                        let tmp = options[0];
                                        if(options.length > 1){
                                            tmp = options[options.length - 1];
                                            
                                        }
                                        filterTaskList(tmp);

                                    }
                                }
                            }  
                            components={{
                            Option: InputOption
                        }}
                        />
                    </div>
                </div>
                
            <table className="w-full border border-gray-500 custom-scroll">
                <thead>
                <tr className="bg-gray-200">
                    <th className="px-2 py-2 w-150">Backlogs</th>
                    <th className="px-2 py-2 w-30 text-center">#</th>
                    <th className="px-2 py-2 w-100 text-center">ID</th>
                    <th className="px-2 py-2 w-100 text-center">Module</th>
                    <th className="px-2 py-2">Parent</th>
                    <th className="px-2 py-2">Name</th>
                    <th className="px-2 py-2 w-150">Assignee</th>
                    <th className="px-2 py-2 w-100 text-center">PIC DEV</th>
                    <th className="px-2 py-2 w-30 text-right">USP</th>
                    <th className="px-2 py-2 w-100 text-center">PIC TEST</th>
                    <th className="px-2 py-2 w-30 text-right">USP</th>
                    <th className="px-2 py-2 w-100 text-center">Status</th>
                    <th className="px-2 py-2 text-center w-100">Due Date</th>
                    <th className="px-2 py-2 text-center w-100">Created By</th>
                    <th className="px-2 py-2 text-center w-100">Blueprint#ID</th>
                
                    
                </tr>
                </thead>
                <tbody className="border-t">
                {taskList.map((item, idx) => (
                    <tr key={item.id} className={ (item.USP.test_nm && item.USP.test_nm.length > 0) ? "border-t dev-test ".concat(item.class_over): "border-t ".concat(item.class_over)}>
                    <td className="px-2 py-2 w-150">{item.list.name}</td>
                    <td className="px-2 py-2 w-30 text-center">{idx + 1}</td>
                    <td className="px-2 py-2 w-100 text-center">
                        <a onClick={event => openTask(item.url)}>
                            {item.id}
                        </a>
                    </td>
                    
                    <td className="px-2 py-2 w-100 text-center">{item.module}</td>
                    <td className="px-2 py-2" style={{
                        color: item.status_color,
                        fontWeight: "bold",
                    }}>
                        {item.parent == null ? item.name : item.parent_nm}
                    </td>
                    <td className="px-2 py-2 text-blue">
                        {item.parent ? item.name : ""}
                    </td>
                    <td className="px-2 py-2 w-150">{item.assignees_ls}</td>
                    <td className="px-2 py-2 w-100 text-center">{item.USP.dev_nm}</td>
                    <td className="px-2 py-2 w-30 text-right">{item.USP.dev_point}</td>
                    <td className="px-2 py-2 w-100 text-center">{item.USP.test_nm}</td>
                    <td className="px-2 py-2 w-30 text-right">{item.USP.test_point}</td>

                    <td className="px-2 py-2 w-100 text-center w-100" style={{
                        color: item.status_color,
                        fontWeight: "bold",

                    }}>{item.status_nm}</td>
                    <td className="px-2 py-2 text-center w-100">{item.due_date_str}</td>
                    <td className="px-2 py-2 text-center w-100">{item.creator_nm}</td> 
                    <td className="px-2 py-2 text-center w-100">
                        <a onClick={event => openTask(item.url)}>
                            {item.blueprintSeq}
                        </a>
                    </td> 
                    
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        <ScaleLoader
            color={color}
            loading={loading}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
      </form>
    
  </div>

  );
}
