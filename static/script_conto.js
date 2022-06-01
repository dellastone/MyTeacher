const { body } = require("express-validator");

//chiama la API per ottenere i dati del conto dell'utente
function getConto() {

    const conto = document.getElementById("conto_div");
    const transazioni = document.getElementById("transazioni_div");

    fetch('../api/v2/getConto')
        .then(r => r.json().then(data => ({ status: r.status, body: data })))
        .then(obj => {

            const array_transazioni = obj.body.transazioni;

            if (obj.status == 200) {

                //stampa dei dati del conto e delle transazioni
                printConto(obj.body);
                printTransactions(array_transazioni);

            } else if (obj.status == 400 || obj.status == 500) {
                printError(conto, transazioni);
            }
        })
        .catch(error => {
            console.error(error);
            printError(conto, transazioni);
        });

}

function printTransactions(transazioni) {


}

//stampa i dati del conto 
function printConto(conto) {

    //stampa del nome dell'utente
    let nome_div = document.getElementById("name");
    nome_div.innerText = conto.nome + " " + conto.cognome;

    //stampa dell'id del conto
    let id_conto = document.getElementById("id_conto");
    id_conto.innerText = conto.id;

    //stampa del saldo
    let saldo = document.getElementById("saldo");
    saldo.innerText = conto.totale + " €";

    //stampa della data 
    let date = document.getElementById("date_info");
    date.innerText = "Saldo del conto alla data " + new Date();
    
}

//stampa a video dei messaggi di errore
function printError(conto, transazioni) {

    let error_div = document.createElement("div");
    let error_message = document.createElement("p");
    let retry_message = document.createElement("p");

    error_div.classList.add("p-2", "mt-3");
    error_message.classList.add("conto-text", "negative-number");
    retry_message.classList.add("conto-text", "negative-number");

    error_message.innerText = "Spiacenti, non è stato possibile recuperare il suo conto dal database!";
    retry_message.innerText = "La preghiamo di ricaricare la pagina.";

    error_div.appendChild(error_message);
    error_div.appendChild(retry_message);
    let error_div2 = error_div.cloneNode(true);
    conto.appendChild(error_div);
    transazioni.appendChild(error_div2);

}