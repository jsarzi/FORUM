console.log('eh')

var random_images_array = ["activite.jpeg", "activites1.jpeg", "activites3.jpeg"];

function getRandomImage(imgAr, path) {
    path = path || '/images/'; // default path here
    var num = Math.floor( Math.random() * imgAr.length );
    var img = imgAr[ num ];
    var imgStr = '<img src="' + path + img + '" alt = "image" width = 470px heigh=750px>';
    document.write(imgStr); document.close();
}

var random_images_array1 = ["restaurants.jpeg", "madridrestaurant4.jpeg", "madridrestaurant.jpeg","madridrestautant2.jpeg"];

function getRandomImage1(imgAr, path1) {
    path1 = path1 || '/images/'; // default path here
    var num1 = Math.floor( Math.random() * imgAr.length );
    var img1 = imgAr[ num1 ];
    var imgStr1 = '<img src="' + path1 + img1 + '" alt = "image" width = 470px heigh=750px>';
    document.write(imgStr1); document.close();
}

var random_images_array2 = ["madridhotel.jpeg", "madridhotel2.jpeg", "madridhotel3.jpeg"];

function getRandomImage2(imgAr, path2) {
    path2 = path2 || '/images/'; // default path here
    var num2 = Math.floor( Math.random() * imgAr.length );
    var img2 = imgAr[ num2 ];
    var imgStr2 = '<img src="' + path2 + img2 + '" alt = "image" width = 470px heigh=750px>';
    document.write(imgStr2); document.close();
}

