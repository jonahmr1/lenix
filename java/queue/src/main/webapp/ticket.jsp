<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reservation de ticket</title>
</head>
<body>
    <h2>Reservation de ticket – Bureau de poste</h2>

    <form method="POST" action="TicketS">

        <label>Nom du client :</label>
        <input type="text" name="nom" required/><br/><br/>

        <label>Numero de telephone :</label>
        <input type="number" name="tel" required/><br/><br/>

        <label>Service :</label>
        <select name="service">
            <option value="Envoi colis">Envoi colis</option>
            <option value="Retrait argent">Retrait argent</option>
            <option value="Paiement facture">Paiement facture</option>
            <option value="Compte CCP">Compte CCP</option>
        </select><br/><br/>

        <button type="submit">Reserver</button>
    </form>
</body>
</html>