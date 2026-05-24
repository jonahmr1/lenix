public class Ticket {
    private String nomClient;
    private String numeroTelephone;
    private String service;
    private String numeroTicket;

    public Ticket() {}

    public String getNomClient() { return nomClient; }
    public void setNomClient(String nomClient) { this.nomClient = nomClient; }

    public String getNumeroTelephone() { return numeroTelephone; }
    public void setNumeroTelephone(String numeroTelephone) { this.numeroTelephone = numeroTelephone; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public String getNumeroTicket() { return numeroTicket; }
    public void setNumeroTicket(String numeroTicket) { this.numeroTicket = numeroTicket; }
}