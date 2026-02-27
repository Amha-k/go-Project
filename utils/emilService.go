package utils

import (
	"fmt"
	"net/smtp"
	"os"
)


func SendEmail(to string, subject string, body string) error {

	from := os.Getenv("EMAIL_FROM")
	password := os.Getenv("EMAIL_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	auth := smtp.PlainAuth("", from, password, smtpHost)

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: " + subject + "\n" +
		"MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n" +
		body

	addr := fmt.Sprintf("%s:%s", smtpHost, smtpPort)

	return smtp.SendMail(addr, auth, from, []string{to}, []byte(msg))
}
func TicketEmailTemplate(name, event string, date interface{}) string {
	return fmt.Sprintf(`
	<h2>Ticket Confirmed</h2>
	<p>Hello %s,</p>
	<p>You successfully bought a ticket for <b>%s</b></p>
	<p>Date: %v</p>
	<br>
	<p>Enjoy the event! </p>
	`, name, event, date)
}