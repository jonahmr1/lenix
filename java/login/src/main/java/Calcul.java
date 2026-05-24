

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Servlet implementation class Calcul
 */
@WebServlet("/Calcul")
public class Calcul extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Calcul() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		PrintWriter out = response.getWriter();
		try {
			double num_a = Double.parseDouble(request.getParameter("num-a"));
			double num_b = Double.parseDouble(request.getParameter("num-b"));
			String operator = request.getParameter("operator");
			
			switch(operator) {
				case "+": out.println(num_a + num_b); break;
				case "-": out.println(num_a - num_b); break;
				case "*": out.println(num_a * num_b); break;
				case "/":
					if (num_a == 0 || num_b == 0) {
						out.println("Division by 0 is forbidden");
						break;
					}
					out.println(num_a / num_b);
				break;
				default: out.println("Invalid operator"); break;
			}
			
//			if (operator.equals("+")) {
//				out.println(num_a + num_b);
//			} else if (operator.equals("-")) {
//				out.println(num_a - num_b);
//			} else if (operator.equals("*")) {
//				out.println(num_a * num_b);
//			} else if (operator.equals("/")) {
//				out.println(num_a / num_b);
//			} else {
//				out.println("Invalid operator");
//			}
		} catch (NumberFormatException e) {
			out.println("Something went wrong: " + e);
		}
	}

}
