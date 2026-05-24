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
	<form method='POST'>
		<input name='name' type='text' />
		<input name='pass' type='password'/>
		<button type='submit' value="Login">login</button>
	</form>
	
	<c:if test="${empty param.name or empty param.pass}">
	    <p style="color: red;">Fields are required</p>
	</c:if>
	
</body>
</html>