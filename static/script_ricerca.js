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

    if (resultsSpace != null) {

        for (d of data) {

            let div = document.createElement("div");
            div.classList.add("container", "d-inline-flex", "flex-row", "justify-content-between", "align-items-center", "result-div");
            div.setAttribute("onclick", "window.location='html_prenotazione.html?professor=" + d.username +"';");

            //creazione immagine profilo dell'utente, se l'utente non ne ha scelta una ne viene mostrata una di default
            let profilePicture = document.createElement("img");
            profilePicture.classList.add("profile-picture", "mx-4");

            if (d.image == "" || d.image == null || d.image == undefined) {
                profilePicture.src = "media/account_circle_FILL0_wght400_GRAD0_opsz48.png";
            } else {
                profilePicture.src = "data:image/jpg;base64," + d.image;
            }

            //aggiunta dello username e del nome dell'utente 
            let nameDiv = document.createElement("div");
            nameDiv.classList.add("d-flex", "flex-column", "justify-content-start", "align-items-start", "professor-div");

            //nome
            let profName = document.createElement("p");
            profName.classList.add("professor-name", "my-0");
            profName.innerText = d.nome + " " + d.cognome;

            //username
            let profUsername = document.createElement("p");
            profUsername.classList.add("professor-username", "my-0");
            profUsername.innerText = d.username;

            //aggiunta delle materie insegnate
            let materieDiv = document.createElement("div");
            materieDiv.classList.add("d-flex", "flex-row", "justify-content-start", "align-items-start", "materie-div");
    
            //materie
            let materie = document.createElement("p");
            materie.classList.add("subtitle", "my-0", "mx-1");
            materie.innerText = "materie insegnate:"

            //lista delle materie
            let materieList = document.createElement("p");
            materieList.classList.add("professor-name", "my-0",  "mx-1");
            let innerTextMaterie = "";
            for (m of d.materie) {
                if (innerTextMaterie != "") {
                    innerTextMaterie = innerTextMaterie + ", " + m;
                }
                else{
                    innerTextMaterie = m;
                }
            }
            materieList.innerText = innerTextMaterie;

            //aggiunta del prezzo richiesto per lezione
            let priceDiv = document.createElement("div");
            priceDiv.classList.add("d-flex", "flex-row", "justify-content-start", "align-items-start", "professor-div");

            //prezzo
            let price = document.createElement("p");
            price.classList.add("subtitle", "my-0", "mx-1");
            price.innerText = "prezzo lezioni:";

            //prezzo orario per lezione
            let prezzo_lezioni = document.createElement("p");
            prezzo_lezioni.classList.add("professor-name", "my-0", "mx-1");
            prezzo_lezioni.innerText = d.prezzo + " €/h";

            //tutti gli elementi aggiunti al proprio div
            nameDiv.appendChild(profUsername);
            nameDiv.appendChild(profName);
            materieDiv.appendChild(materie);
            materieDiv.appendChild(materieList);
            priceDiv.appendChild(price);
            priceDiv.appendChild(prezzo_lezioni);

            let hr = document.createElement("hr");
            hr.classList.add("my-0");

            //tutti gli elementi sono aggiunti al div principale
            div.appendChild(profilePicture);
            div.appendChild(nameDiv);
            div.appendChild(materieDiv);
            div.appendChild(priceDiv);

            //il div viene aggiunto alla schermata di ricerca seguito da una linea orizzontale
            resultsSpace.appendChild(div);
            resultsSpace.appendChild(hr);
        }
    }
    resultsSpace.removeChild(resultsSpace.lastChild);
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

        let line_break = document.createElement("br");

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