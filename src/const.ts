export const URLS = [
  {
    name: 'Vince Amaziong',
    url: '/index.html',
    image: 'https://blueprint.cyberlogitec.com.vn/style/images/default/logo-menu-3.png'
  },
  // {
  //   name: 'Wikipedia',
  //   url: '//wikipedia.com/',
  //   image: '//upload.wikimedia.org/wikipedia/commons/thumb/7/75/Wikipedia_mobile_app_logo.png/64px-Wikipedia_mobile_app_logo.png'
  // },
  // {
  //   name: 'Gitlab',
  //   url: '//gitlab.com',
  //   image: '//about.gitlab.com/images/press/press-kit-icon.svg'
  // },
  // {
  //   name: 'React',
  //   url: '//reactjs.org/',
  //   image: '//upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
  // },
  // {
  //   name: 'Parcel',
  //   url: '//parceljs.org/',
  //   image: '//parceljs.org/avatar.733335a8.avif'
  // },
] as const;

export const APP_EXTEND_MGMT_WIDTH = 1900;
export const APP_EXTEND_MGMT_HEIGHT = 900;
export const APP_COLLAPSE_MGMT_WIDTH = 65;
export const APP_COLLAPSE_MGMT_HEIGHT = 60;

export const CLICKUP_INFO = {
  SPACE_ID: 26265831,
  CLICKUP_TOKEN: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjozMjE5MzA1NCwidmFsaWRhdGVkIjp0cnVlLCJ3c19rZXkiOjcyMDU5ODY2OTIsInNlc3Npb25fdG9rZW4iOnRydWUsImlhdCI6MTY5MDc3MzczNCwiZXhwIjoxNjkwOTQ2NTM0fQ.UTHt4CURDiUzm3xlE8-1HTqVnnvf7oMemn-zuknmi10`

}
export const REQ_HEADER = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'pk_32193054_YQNFO05VHHM9ABEJUTOE8YUPS7RII2JN'
  },
  headersBear: { 
    headers: {
      Authorization: `Bearer ${CLICKUP_INFO.CLICKUP_TOKEN}` 

    }
  }
}



export const WEB_INFO = {
  BLUEPRINT: {
    API: 'https://blueprint.cyberlogitec.com.vn/api',
    PROJECTS: {
      NEW_FWD: {
        ID: 'PJT20211119000000001',
        NAME: 'NEW FWD',
      }
    }
   
  },
  WORKING_API: "http://localhost:81/workingapi/api",
  TASK_MEMBER_API: "http://localhost:81/fapi/working",
  CLICKUP: {
    SPACE_ID: 26265831,
    
  }
}