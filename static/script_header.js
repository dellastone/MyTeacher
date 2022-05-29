function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /*loop through a collection of all HTML elements:*/
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /*make an HTTP request using the attribute value as the file name:*/
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /*remove the attribute, and call this function once more:*/
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /*exit the function:*/
            return;
        }
    }
};

function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function (el) {
        let [k, v] = el.split('=');
        cookie[k.trim()] = v;
    })
    return cookie[name];
}

function checkLoggedUser() {

    let token = getCookie("token");

    json = '{"token": "' + token + '"}';

    fetch('../api/v2/checkLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
    })

        .then(r => r.json().then(data => ({ status: r.status, body: data })))
        .then(obj => {

            if (obj.status == 200) {
                console.log("User logged: " + JSON.stringify(obj))
                login = obj.body.login;
                username = obj.body.username;
                if (obj.body.image != "") {
                    img = "data:image/jpeg;base64," + obj.body.image;
                } else {
                    img = "media/account_circle_FILL0_wght400_GRAD0_opsz48.png";
                }
                console.log("DATA: " + login);


                if (login) {
                    printLoggedHeader(username, img);
                } else {
                    printLoginHeader();
                }


            } else if (obj.status == 201) {
                console.log("User NOT logged")
                printLoginHeader();

            } else if (obj.status == 400) {
                console.log("MSG400: " + obj.body.message);
                printLoginHeader();

            } else if (obj.status == 500) {
                console.log("MSG500: " + obj.body.message);
                printLoginHeader();

            }
        })
        .catch(error => console.error(error));


};

function printLoggedHeader(usr, img) {
    document.getElementById("divLogged").removeAttribute("hidden");
    document.getElementById("divNotLogged").setAttribute("hidden","");
    document.getElementById("imgLogged").setAttribute("src", img);
    if(img=="media/account_circle_FILL0_wght400_GRAD0_opsz48.png"){
        document.getElementById("imgLogged").setAttribute("style", "background-color:#adacac");
    } else {
        document.getElementById("imgLogged").setAttribute("style", "");
    }
    document.getElementById("nameLogged").innerHTML = usr;
};

function printLoginHeader() {
    document.getElementById("divNotLogged").removeAttribute("hidden");
    document.getElementById("divLogged").setAttribute("hidden","");
};