<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="beans.Bean" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<%
	Bean mr = new Bean();
%>

<form method="post"> 
	name: <input type="text" id="name" name="name" value="${mr.name}" /><br />
	age: <input type="number" id="age" name="age" value="${mr.age}" /><br />
	<button type="submit" value="save">submit</button>
</form>
</body>
</html>