<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
    
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<c:set var="noms" value="'HADIL','LOUMANI','WISSAL'" />

<ul>
	<c:forEach var="nom" items="${noms}">
	    <li>${nom}</li>
	</c:forEach>
</ul>

</body>
</html>