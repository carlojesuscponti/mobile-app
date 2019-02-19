const axios = require("axios");

let userData = {
  email: "example@gmail.com",
  username: "carlo",
  password: "123456789"
};

// axios
//     .post('http://localhost:3000/user/register', userData)
//     .then((response) => {
//         console.log(response.status);
//     })
//     .catch((err) => {
//         console.log('username already exist or email is invalid');
//     })

// axios
//     .post('http://localhost:3000/user/login', userData)
//     .then((response) => {
//         console.log(response.headers);
//     })
//     .catch((err) => {
//         console.log('error user');
//     })

// axios
//   .get("http://localhost:3000/private/private", {
//     headers: {
//       "x-auth":
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzU1ODY5MmY0NGQzYTEyMDQxMGZmNDgiLCJpYXQiOjE1NDkxMTE5MDJ9.1udykuCtYuc-uFHIIt5J9UK62pu6-LXxvwLPfSv64vo"
//     }
//   })
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(err => {
//     console.log(err);
//   });

axios
  .get("https://mysterious-badlands-94221.herokuapp.com/api/profile/all")
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err);
  });
