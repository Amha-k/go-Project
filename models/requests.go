package models
import "time"


type UserRegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}


type UserLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}



type CreateEventRequest struct {
	Name         string    `json:"name" binding:"required"`
	Description  string    `json:"description" binding:"required"`
	Price        float64   `json:"price" binding:"required"`
	EventDate    time.Time `json:"eventdate" binding:"required"`
	TicketNumber uint      `json:"ticketNumber" binding:"required"`
}


type UpdateEventRequest struct {
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Price        float64   `json:"price"`
	EventDate    time.Time `json:"eventdate"`
	TicketNumber uint      `json:"ticketNumber"`
}