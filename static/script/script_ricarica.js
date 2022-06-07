function ricarica() {
    cardNumber = document.getElementById("cardNumber").value
    expirationDate = document.getElementById("yy").value  + "-" + document.getElementById("mm").value +"-01"
    cvv = document.getElementById("cvv").value
    amount = document.getElementById("amount").value
    cardOwner = document.getElementById("owner").value
   

    jsonToSend = '{"cardNumber":"' +cardNumber+ '","expirationDate":"'+expirationDate+'","cvv":"'+cvv+'","amount": "'+amount+'"}';

    fetch('../api/v2/ricarica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonToSend,
    })

        .then(r => r.json().then(data => ({ status: r.status, body: data })))
        .then(obj => {
            msg = obj.body.message;
            if (obj.status == 200 && cardOwner === "") {
                document.getElementById("hidden_div").setAttribute("class", "show_div");
                document.getElementById("alert_msg").innerHTML = "Inserisci proprietario carta";

            } else if (obj.status == 400) {
                document.getElementById("hidden_div").setAttribute("class", "show_div");
                document.getElementById("alert_msg").innerHTML = msg;

            } else if (obj.status == 500) {
                document.getElementById("hidden_div").setAttribute("class", "show_div");
                document.getElementById("alert_msg").innerHTML = msg;

            }else if(obj.status == 200 ){
                
                $("#success").modal('toggle');
            }
        })
        .catch(error => console.error(error));
}
