const { redirect } = require("express/lib/response");
const axios = require('axios')
//---------------------------------VERIFICATION DES INPUTS----------------------------------------------------//
let id = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);

let username = id("username"),
  email = id("email"),
  password = id("password"),
  confirm = id("confirm"),
  form = id("form"),
  errorMsg = classes("error"),
  successIcon = classes("success-icon"),
  failureIcon = classes("failure-icon");

// Adding the submit event Listener
if (username) {
  username.addEventListener("blur", (e) => {
    e.preventDefault();
    engine(username, 0, "Username cannot be blank");
  });  
}

if (email) {
  email.addEventListener("blur", (e) => {
    e.preventDefault();
    engine(email, 1, "Email cannot be blank");
  });
};

if (password) {
  password.addEventListener("blur", (e) => {
    e.preventDefault();
    engine(password, 2, "Password cannot be blank");
  });
}

if (confirm) {
  confirm.addEventListener("blur", (e) => {
    e.preventDefault();
    if(password) {
      if (password.value === confirm.value) {
        engine(confirm, 3, "Password cannot be blank");
      } else {
        alert('Les deux mots de passe saisis sont différents. Veuillez vérifier votre saisie')
      }
    }
    });
}

// engine function which will do all the works
let engine = (id, serial, message) => {

  if (id.value.trim() === "") {
    errorMsg[serial].innerHTML = message;
    id.style.border = "2px solid red";

    // icons
    failureIcon[serial].style.opacity = "1";
    successIcon[serial].style.opacity = "0";
  } else {
    errorMsg[serial].innerHTML = "";
    id.style.border = "2px solid green";
    if (id == username) {
      if (id.value !== "" || id.value !== null || id.value !== false) {
        localStorage.setItem('username', username.value);
        console.log( localStorage.getItem('username'));
      }
    }
    
    // icons
    failureIcon[serial].style.opacity = "0";
    successIcon[serial].style.opacity = "1";
  }

};

//---------------------------------IS LOGGED / WELCOME MESSAGE----------------------------------------------------//
  function greetings() {
    alert( 'Welcome back ' + localStorage.getItem('username') + ' !');
  }

//---------------------------------GOOGLE SIGN IN----------------------------------------------------//
  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('Name: ' + profile.getName());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present*

    window.location.replace('/');
    
  }

  function redirectU() {
    let storage = document.getElementById('storage')
    let userName = profile.getName();
    let userEmail = profile.getEmail();
    storage.innerHTML = userName + '<br>' + userEmail
    console.log(storage)
    localStorage.setItem('username', userName);
    localStorage.setItem('email', userEmail);

    setTimeout(function() {
      email.value = userEmail;
      username.value = userName;
    }, 2000);
     /*$.post('http://localhost:3000/signupGoogle?username='+username+'&email='+userEmail, { n: "203000"} );*/
     var link = 'http://localhost:3000/signupGoogle?username='+userName+'&email='+userEmail;
     var config = {
       method: 'post',
       url: link,
     };
     axios(config)
       .then(response => (console.log(response.data)))
       .catch(function (error) {
         console.log(error);
     }); 
     window.location.replace("http://localhost:3000/signupGoogle");
 
 
     /* <!-- data-scope="https://www.googleapis.com/auth/plus.login"
                 data-accesstype="offline"
                 data-redirecturi="http://localhost:3000/" -->*/
  }

  //---------------------------------GOOGLE SIGN OUT----------------------------------------------------//
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

function greetings() {
  var profile = googleUser.getBasicProfile();
    console.log('Name: ' + profile.getName());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present*
  alert('salut ' + profile.getName);
}