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

//stampa nella pagina i risultati della ricerca contenuti nella variabile data
function printResults(data) {
    const resultsSpace = document.getElementById("search_results");

    //elimina i risultati di eventuali ricerche precedenti
    while (resultsSpace.firstChild) {
        resultsSpace.removeChild(resultsSpace.lastChild);
    }

    if(resultsSpace != null){
        
        for( d of data ){
            
            let div = document.createElement("div");
            div.classList.add("container", "d-flex", "flex-row", "justify-content-start", "align-items-center", "my-3");

            //creazione immagine profilo dell'utente, se l'utente non ne ha scelta una ne viene mostrata una di default
            let profilePicture = document.createElement("img");
            profilePicture.classList.add("profile-picture", "mx-3");
            
            if(d.image == "" || d.image == null || d.image == undefined)
            {
                profilePicture.src = "media/account_circle_FILL0_wght400_GRAD0_opsz48.png";   
            }else{
                profilePicture.src = d.image;
            }

            //aggiunta del nome dell'utente al profilo 
            let profName = document.createElement("p");
            profName.classList.add("no-results-message", "mx-3");
            profName.innerText = d.nome + " "+ d.cognome;

            div.appendChild(profilePicture);
            div.appendChild(profName);

            resultsSpace.appendChild(div);
        }
    }

};

//stampa nella pagina un messaggio che indica all'utente che la ricerca non ha prodotto risultati
function printNoResults(toSearch) {
    console.log("La ricerca non ha prodotto nessun risultato");

    const resultsSpace = document.getElementById("search_results");
    while (resultsSpace.firstChild) {
        resultsSpace.removeChild(resultsSpace.lastChild);
    }

    if (resultsSpace != null) {
        let noResultsSpace = document.createElement("div");
        noResultsSpace.id = "no_result_space";
        noResultsSpace.classList.add("container", "d-flex", "flex-column", "justify-content-center", "align-items-center");

        let noResultsText = document.createElement("p");
        noResultsText.classList.add("no-results-message");
        noResultsText.innerText = "Nessun risultato trovato per " + toSearch;

        let secondMessage = document.createElement("p");
        secondMessage.classList.add("no-results-message");
        secondMessage.innerText = "Ti ricordiamo che puoi cercare un massimo di due parole!";
        
        let line_break =  document.createElement("br");

        noResultsSpace.appendChild(noResultsText);
        noResultsSpace.appendChild(line_break);
        noResultsSpace.appendChild(line_break);
        noResultsSpace.appendChild(secondMessage);

        resultsSpace.appendChild(noResultsSpace);
    }
};

//prende il valore del campo di ricerca e invia una richiesta GET al backend di MyTeacher
//ottiene il risultato della ricerca in formato JSON
function ricerca() {
    const toSearch = document.getElementById("search_bar").value;
    if (toSearch != undefined && toSearch != null) {
        const words = toSearch.split(' ');
        if (words.length == 1) {
            console.log("Searching for " + words[0]);
            fetch('../api/v1/ricerca/' + words[0])
                .then((resp) => resp.json())
                .then(function (data) {
                    if (data.length > 0) {
                        printResults(data);
                    }
                    else {
                        printNoResults(toSearch);
                    }
                })
                .catch((err) => function () {
                    console.log(err);
                });
        } else if (words.length == 2) {
            console.log("Searching for " + words[0] + " " + words[1]);
            fetch('../api/v1/ricerca/' + words[0] + '/' + words[1])
                .then((response) => response.json())
                .then(function (data) {
                    if (data.length > 0) {
                        printResults(data);
                    }
                    else {
                        printNoResults();
                    }
                })
                .catch((err) => function () {
                    console.log(err);
                });
        } else {
            console.log("troppe parole");
            printNoResults(toSearch);
        }
    }
}