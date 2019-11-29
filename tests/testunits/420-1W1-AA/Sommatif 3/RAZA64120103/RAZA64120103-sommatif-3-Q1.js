var codePermanent = prompt("Entrer votre code permanent.");

        if (codePermanent != null) {
            while (codePermanent.length != 12) {
                codePermanent = prompt("Entrez un code à 12 caractères.");
                if (codePermanent == null) {
                    alert("Vouz-avez annulé la saisie de votre code permanent.");
                    codePermanent = "Aucun Code Permanent";
                    break;
                }
            }
        }
        if (codePermanent == null) {
            alert("Vouz-avez annulé la saisie de votre code permanent.");
            codePermanent = "Aucun Code Permanent";
        }

        codePermanent = codePermanent.toUpperCase();
        document.getElementById("code-permanent").innerText = codePermanent;
        document.getElementsByTagName("title")[0].innerText += " (" + codePermanent + ")";
        var evaluation = document.getElementById("evaluation").content;
        console.log(evaluation);