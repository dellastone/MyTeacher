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

/**
 * 
 * @param {*} name (string) name of the cookie
 * @returns value of the the cookie with that name
 * 
 * The function take a name (string) and return the value of the cookie with that name.
 */
function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function (el) {
        let [k, v] = el.split('=');
        cookie[k.trim()] = v;
    })
    return cookie[name];
}

/**
 * The function check if a user is logged.
 * Based on this the function call two different function to printi two different headers.
 */
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
                login = obj.body.login;
                username = obj.body.username;
                if (obj.body.image != "" && obj.body.image != undefined) {
                    img = "data:image/jpeg;base64," + obj.body.image;
                } else {
                    img = "media/account_circle_FILL0_wght400_GRAD0_opsz48.png";
                }


                if (login) {
                    printLoggedHeader(username, img);
                } else {
                    printLoginHeader();
                }


            } else if (obj.status == 201) {
                printLoginHeader();

            } else if (obj.status == 400) {
                printLoginHeader();

            } else if (obj.status == 500) {
                printLoginHeader();

            }
        })
        .catch(error => console.error(error));

};

/**
 * 
 * @param {*} usr (string) username of the account logged
 * @param {*} img (string) Base64 img of the account logged if present.
 * 
 * The function print the version of the header for a current logged user.
 * Instead of the "Accedi" button, there is the image and username of the account.
 * If clicked a dropdown menu is shown with a link for logout and personal profile page.
 */
function printLoggedHeader(usr, img) {
    document.getElementById("divLogged").removeAttribute("hidden");
    document.getElementById("divNotLogged").setAttribute("hidden", "");
    document.getElementById("imgLogged").setAttribute("src", img);
    if (img == "media/account_circle_FILL0_wght400_GRAD0_opsz48.png") {
        document.getElementById("imgLogged").setAttribute("style", "background-color:#adacac");
    } else {
        document.getElementById("imgLogged").setAttribute("style", "");
    }
    document.getElementById("nameLogged").innerHTML = usr;
    document.getElementById("profileLink").setAttribute("href", "html_profile.html?username=" + usr);
    document.getElementById("logoutLink").setAttribute("onclick", "logoutHeader()");
};

/**
 * The function print the version of the header for no current logged user.
 * It prints a "Accedi" button to go to the login page.
 */
function printLoginHeader() {
    document.getElementById("divNotLogged").removeAttribute("hidden");
    document.getElementById("divLogged").setAttribute("hidden", "");
};

/**
   * Delete token cookie to logout the user
  **/
function logoutHeader() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
};