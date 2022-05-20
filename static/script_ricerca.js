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

//Funzione che attiva il bottone di ricerca quando viene premuto il tasto invio
function keyPressButton() {
    let input = document.getElementById("search_bar");
    input.addEventListener("keydown", function (event) {
        if (event.key === 'Enter') {
            console.log("pressed");
            event.preventDefault();
            document.getElementById("search_button").click();
        }
    });
};

//prende il valore del campo di ricerca e invia una richiesta GET al backend di MyTeacher
//ottiene il risultato della ricerca in formato JSON
function ricerca() {
    const toSearch = document.getElementById("search_bar").value;
    if (toSearch != undefined && toSearch != null) {
        const words = toSearch.split(' ');
        if (words.length == 0) {
            console.log("Searching...");
            fetch('../api/v1/ricerca')
                .then((resp) => resp.json())
                .then(function (data) {
                    console.log(data);
                });
        }else if(words.length == 1){
            console.log("Searching for " + words[0]);
            fetch('../api/v1/ricerca/'+words[0])
                .then((resp) => resp.json())
                .then(function (data) {
                    console.log(data);
                });
        }else if(words.length == 2){
            console.log("Searching for "+words[0]+" "+words[1]);
            fetch('../api/v1/ricerca/' + words[0] + '/' + words[1])
                .then((resp) => resp.json())
                .then(function (data) {
                    console.log(data);
                });
        }else{
            console.log("troppe parole");
        }
    }
}