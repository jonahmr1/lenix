import java.io.IOException;
import java.util.Random;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/TicketServlet")
public class TicketS extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String nom = request.getParameter("nom");
        String tel = request.getParameter("tel");
        String service = request.getParameter("service");

        int numero = new Random().nextInt(900);
        String numeroTicket = "TK-" + numero;

        Ticket ticket = new Ticket();
        ticket.setNomClient(nom);
        ticket.setNumeroTelephone(tel);
        ticket.setService(service);
        ticket.setNumeroTicket(numeroTicket);

        request.setAttribute("ticket", ticket);
        request.getRequestDispatcher("confirm.jsp").forward(request, response);
    }
}