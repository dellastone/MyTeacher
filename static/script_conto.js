//funzione che ritorna un numero in modo che abbia due cifre prima della virgola (per data e ora)
function twoDigits(i) {
    return (`0${i}`).slice(-2);
}
//chiama la API per ottenere i dati del conto dell'utente
function getConto() {

    const conto = document.getElementById("conto_div");
    const transazioni = document.getElementById("transazioni_div");

    fetch('../api/v2/getConto')
        .then(r => r.json().then(data => ({ status: r.status, body: data })))
        .then(obj => {

            const array_transazioni = obj.body.elenco_transazioni;

            if (obj.status == 200) {

                //stampa dei dati del conto e delle transazioni
                printConto(obj.body);
                printTransactions(array_transazioni, transazioni);

            } else if (obj.status == 400 || obj.status == 500) {
                printError(conto, transazioni);
            }
        })
        .catch(error => {
            console.error(error);
            printError(conto, transazioni);
        });

}

function printTransactions(transazioni, transazioni_div) {

    const div_transazioni = document.getElementById("transazioni_div");

    for (transazione of transazioni) {

        //nuovo div per la transazione
        let newdiv = document.createElement("div");
        newdiv.classList.add("p-2");

        //creazione messaggio che indica se si tratta di una ricarica o di un pagamento
        let ricarica_pagamento = document.createElement("p");
        ricarica_pagamento.classList.add("conto-subtitle");
        ricarica_pagamento.style.opacity = 1.0;

        if (transazione.ricarica) {
            ricarica_pagamento.classList.add("positive-number");
            ricarica_pagamento.innerText = "Ricarica";
        }
        else {
            ricarica_pagamento.classList.add("negative-number");
            ricarica_pagamento.innerText = "Pagamento";
        }

        newdiv.appendChild(ricarica_pagamento);

        //linea di separazione transazioni
        let line = document.createElement("hr");

        //creazione testo dell'id transazione 
        let id_trans = document.createElement("span");
        id_trans.classList.add("conto-subtitle");
        let id = document.createElement("span");
        id.classList.add("conto-text");
        id_trans.innerText = "ID transazione: ";
        id.innerText = transazione._id;

        //inserimento dati nel div transazione 
        newdiv.appendChild(id_trans);
        newdiv.appendChild(id);

        //creazione valore transazione
        let valore_txt = document.createElement("span");
        valore_txt.classList.add("conto-subtitle");
        valore_txt.innerText = "Valore: "
        let valore = document.createElement("span");
        valore.classList.add("conto-text");
        valore.innerText = transazione.valore.toFixed(2) + " €";

        //inserimento valore nel div transazione
        newdiv.appendChild(document.createElement("br"));
        newdiv.appendChild(valore_txt);
        newdiv.appendChild(valore);

        if (!transazione.ricarica) {

            let sender_div = document.createElement("div");
            let receiver_div = document.createElement("div");

            //creazione testo mittente
            let sender_text = document.createElement("span");
            sender_text.classList.add("conto-subtitle");
            let sender_value = document.createElement("span");
            sender_value.classList.add("conto-text");
            sender_text.innerText = "Mittente: ";
            sender_value.innerText = transazione.username_mittente;

            //creazione testo ricevente
            let receiver_text = document.createElement("span");
            receiver_text.classList.add("conto-subtitle");
            let receiver_value = document.createElement("span");
            receiver_value.classList.add("conto-text");
            receiver_text.innerText = "Ricevente: ";
            receiver_value.innerText = transazione.username_ricevente;

            //tutto viene aggiunto al div 
            sender_div.appendChild(sender_text);
            sender_div.appendChild(sender_value);
            receiver_div.appendChild(receiver_text);
            receiver_div.appendChild(receiver_value);

            newdiv.appendChild(sender_div);
            newdiv.appendChild(receiver_div);
        }

        let date_div = document.createElement("div");
        let data_txt = document.createElement("span");
        data_txt.classList.add("conto-subtitle");
        let data_value = document.createElement("span");
        data_value.classList.add("conto-text");
        data_txt.innerText = "Data: ";
        const date_trans = new Date(transazione.data);
        data_value.innerText = twoDigits(date_trans.getDate()) + "/" + twoDigits(date_trans.getMonth()+1) + "/" 
            + date_trans.getFullYear() + "  " + twoDigits(date_trans.getHours()) + ":" 
            + twoDigits(date_trans.getMinutes()) + ":" + twoDigits(date_trans.getSeconds());
        date_div.appendChild(data_txt);
        date_div.appendChild(data_value);
        newdiv.appendChild(date_div);

        //inserimento dati nel div principale
        transazioni_div.appendChild(newdiv);
        transazioni_div.appendChild(line);

    }
    //rimozione ultima linea separatrice
    transazioni_div.removeChild(transazioni_div.lastChild);
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
    const today = new Date();
    const month = today.getMonth() + 1;
    const date_string = twoDigits(today.getDate()) + "/" + twoDigits(month) + "/" + today.getFullYear() + "  "
        + twoDigits(today.getHours()) + ":" + twoDigits(today.getMinutes()) + ":" + twoDigits(today.getSeconds());
    let date = document.getElementById("date_info");
    date.innerText = "Saldo del conto alla data  " + date_string;

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
    retry_message.innerText = "E' necessario effettuare il login prima di visualizzare il proprio conto.";

    error_div.appendChild(error_message);
    error_div.appendChild(retry_message);
    let error_div2 = error_div.cloneNode(true);
    conto.appendChild(error_div);
    transazioni.appendChild(error_div2);

}