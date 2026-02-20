package utils


import "time"

type EventResponse struct {
	ID           uint      `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Price        float64   `json:"price"`
	CompanyID    uint      `json:"company_id"`
	CompanyName  string    `json:"company_name"`
	EventDate    time.Time `json:"eventdate"`
	TicketNumber uint      `json:"ticket_number"`
}
