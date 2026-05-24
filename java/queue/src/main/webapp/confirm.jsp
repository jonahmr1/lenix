<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Confirmation de reservation</title>
</head>
<body>
    <h2>Confirmation de votre reservation</h2>

    <p><strong>Nom du client :</strong> <c:out value="${ticket.nomClient}"/></p>
    <p><strong>Numero de telephone :</strong> <c:out value="${ticket.numeroTelephone}"/></p>
    <p><strong>Service choisi :</strong> <c:out value="${ticket.service}"/></p>
    <p><strong>Numero de ticket :</strong> <c:out value="${ticket.numeroTicket}"/></p>

    <a href="ticket.jsp">Nouvelle reservation</a>
</body>
</html>