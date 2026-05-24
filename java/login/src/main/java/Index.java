

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Servlet implementation class Index
 */
@WebServlet("/Index")
public class Index extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Index() {
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
		float temperature = Float.parseFloat(request.getParameter("temperature"));
		
		// glace
		if (temperature <= 0) {
			out.println("glace - " + "https://www.quebecscience.qc.ca/wp-content/uploads/2018/09/20110914152202-glaonsfondants.jpg");
			//vapeur
		} else if (temperature >= 100) {
			out.println("vapeur - " + "https://cfsalubrite.com/wp-content/uploads/2020/03/Désinfecter-avec-la-vapeur-sèche-2048x1365.jpg");
			//liquide
		} else {
			out.println("liquide - " + "https://medias.pourlascience.fr/api/v1/images/view/5a82b11f8fe56f7c1631e411/wide_1000-webp/image.jpg");
		}
	}

}
