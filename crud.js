/*---------CONFIGURATION VARIABLES--------*/

/*FETCH EXISTING TABLES*/
var admins = document.querySelectorAll('.adminsRows');
var users = document.querySelectorAll('.usersRows');
var posts = document.querySelectorAll('.postsRows');
/*FETCH THE POPING TABLE IN THE TABLEAUX*/
var modalScreen = document.getElementById('modalScreen');
var modalButton = document.getElementById('modalButton');
var modalSelection = document.getElementById('modalSelection');
var rowSelection = modalSelection.children[1].firstElementChild;
/*FETCH THE POPING FORM TO CREATE USER/ADMIN*/
var modalScreen2 = document.getElementById('modalScreen2')
var modalButton2 = document.getElementById('modalButton2');
var formUsers = document.getElementById('formUsers');
var createAdmin = document.getElementById('createAdmin')
var createUser = document.getElementById('createUser')

adminKey = 2;
adminInput = document.getElementById('adminInput')

/*FETCH THE POPING FORM TO CREATE POST*/
var modalScreen3 = document.getElementById('modalScreen3')
var modalButton3 = document.getElementById('modalButton3');
var formPosts = document.getElementById('formPosts');
var newTitle = '1';
var titleForm = formUsers.children[0];
var createPost = document.getElementById('createPost')

var sqlTable = '';
var input = {type:'', value:''}

var upgradeButton = document.getElementsByClassName('upgrade');
console.log(upgradeButton)
console.log(upgradeButton[0])
/*---------PREPARE EVENTS FOR DISPLAY DATAS AND CLOSING THE SCREEN--------*/
function prepareFunctions(tableau) {
  for (i=0; i<tableau.length; i++) {
    tableau[i].addEventListener('click', function() {
      modalScreen.style.visibility = 'visible';
      modalButton.style.visibility = 'visible';
      modalSelection.style.visibility = 'visible';
      modalScreen.style.animation = '';
      displayElement(this);
    })
  }
}

prepareFunctions(admins);
prepareFunctions(users);
prepareFunctions(posts);

function prepareForm(button) {
  if (button.id == 'createPost') {
    button.addEventListener('click', function() {
      modalScreen3.style.visibility = 'visible';
      modalButton3.style.visibility = 'visible';
      formPosts.style.visibility = 'visible';
      modalScreen3.style.animation = '';
      console.log(3)
    }) 
  } else {
    button.addEventListener('click', function() {
      modalScreen2.style.visibility = 'visible';
      modalButton2.style.visibility = 'visible';
      formUsers.style.visibility = 'visible';
      modalScreen2.style.animation = '';
      if (button.id == 'createAdmin') {
        newTitle = 'Créer un nouvel admin';
        adminKey = 1;
  
      } else if (button.id == 'createUser') {
        newTitle = 'Créer un nouvel utilisateur';
        adminKey = 0;
      } 
      adminInput.value = adminKey;
      titleForm.innerHTML = newTitle;
    });
  }
}

prepareForm(createAdmin);
prepareForm(createUser);
prepareForm(createPost);


/*---------INSERT DATAS INTO THE POP UP SCREEN TABLE--------*/
function displayElement(element) {
  var datas = (element.children);
  for (i=1; i<datas.length; i++) {
    index = i-1;
    if (index === 0) {
      rowSelection.children[index].innerHTML = '<input disabled = true value="' + datas[index].innerHTML + '">';
    } else {
      rowSelection.children[index].innerHTML = '<input value="' + datas[index].innerHTML + '">';
    }
  }
  sqlTable = element.parentElement.parentElement.id;
  if (sqlTable === 'posts') {
    upgradeButton[0].disabled = true;
    upgradeButton[0].style.border = "lightgray";
    upgradeButton[0].style.background = "lightgray";
    upgradeButton[0].style.color = "gray";
  } else {
    upgradeButton[0].disabled = false;
    upgradeButton[0].style.border = "#f2796e";
    upgradeButton[0].style.background = "#f2796e";
    upgradeButton[0].style.color = "white";
  };
  return sqlTable;
}
/*---------ADD THE ANIMATION TO HIDE THE BLACK SCREEN--------*/
//FOR THE LOOP SELECTION
modalButton.addEventListener('click', function() {
  modalButton.style.visibility = 'hidden';
  modalSelection.style.visibility = 'hidden';
  modalScreen.style.animation = 'hide 0.2s forwards';
  modalScreen.style.visibility = 'hidden';
})
//FOR THE FORM USERS CREATION
modalButton2.addEventListener('click', function() {
  modalButton2.style.visibility = 'hidden';
  formUsers.style.visibility = 'hidden';
  modalScreen2.style.animation = 'hide 0.2s forwards';
  modalScreen2.style.visibility = 'hidden';
})
//FOR THE FORM USERS CREATION
modalButton3.addEventListener('click', function() {
  modalButton3.style.visibility = 'hidden';
  formPosts.style.visibility = 'hidden';
  modalScreen3.style.animation = 'hide 0.2s forwards';
  modalScreen3.style.visibility = 'hidden';
})
/*---------UPDATE THE SELECTED ITEM BY CLICKING ON THE DISQUETTE MDR--------*/
function updateItem(item) {
  //ON RECUPERE LA LIGNE DE L'ITEM
  var thisItem = item.parentElement.parentElement;
  // PUIS CHAQUE INPUT 
  var itemID = thisItem.children[0].children[0].value.replace(/\s+/g, '');
  var itemUsername = thisItem.children[1].children[0].value.replace(/\s+/g, '');
  var itemEmail = thisItem.children[2].children[0].value.replace(/\s+/g, '');
  //GET ID DE LA LIGNE SELECTIONNEE
  var thisID = itemID.match(/(\d+)/)[0];
  //TRANSFORME LES ADMIN EN USERS POUR AL REQUETE DB
  if (sqlTable === 'admin') sqlTable = 'users';
    window.location.replace('/admin/update/'+sqlTable+'/'+thisID+'/'+itemUsername+'/'+itemEmail);
}

/*---------DELETE THE SELECTED ITEM BY CLICKING ON THE BIN--------*/
function deleteItem(item) {
  var itemID = item.parentElement.parentElement.firstElementChild.innerHTML;
  console.log(itemID)
  //GET ID DE LA LIGNE SELECTIONNEE
  var thisID = itemID.match(/(\d+)/)[0];
  //TRANSFORME LES ADMIN EN USERS POUR AL REQUETE DB
  if (sqlTable === 'admin') sqlTable = 'users';
  window.location.replace('/admin/delete/'+sqlTable+'/'+thisID);
}

function upgradeItem(item) {
  var itemID = item.parentElement.parentElement.firstElementChild.innerHTML;
  var thisID = itemID.match(/(\d+)/)[0];
  if (sqlTable === 'posts') return alert("Can't upgrade a post ! duh");
  if (sqlTable === 'admin') sqlTable = 'users';
  window.location.replace('/admin/upgrade/'+sqlTable+'/'+thisID);
}