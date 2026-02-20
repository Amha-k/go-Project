package controller

import (
	"net/http"
	"strconv"

	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/models"
	"github.com/gin-gonic/gin"
	//"gorm.io/gorm"
	"github.com/Amha-k/go-Project/utils"
)

/*

func ListAllEvents(c *gin.Context) {
    var events []models.Event

    config.Db.
        Preload("Company", func(db *gorm.DB) *gorm.DB {
            return db.Select("id","name")
        }).
        Find(&events)

    var response []utils.EventResponse
        for _, event := range events {
		response = append( response, utils.EventResponse{
			ID:           event.ID,
			Name:         event.Name,
			Description:  event.Description,
			Price:        event.Price,
			CompanyID:    event.CompanyID,
			CompanyName:  event.Company.Name,
			EventDate:    event.EventDate,
			TicketNumber: event.TicketNumber,
		})
	}
    c.JSON(http.StatusOK, events)
	utils.JSONSuccess(c,events,"avilable events")
}


*/
func ListAllEvents(c *gin.Context) {
	var events []utils.EventResponse

	err := config.Db.
		Model(&models.Event{}).
		Select(`
			events.id,
			events.name,
			events.description,
			events.price,
			events.event_date,
			events.ticket_number,
			events.company_id,
			companies.name as company_name
		`).
		Joins("LEFT JOIN companies ON companies.id = events.company_id").
		Scan(&events).Error

	if err != nil {
		utils.JSONError(c, "DB_ERROR", "Failed to fetch events", 500, err.Error())
		return
	}

	utils.JSONSuccess(c, events, "Events fetched successfully")
}







func BuyTicket(c *gin.Context) {
    if c.GetString("entity") != "user" {
        utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "only users allowed")
        return
    }

    userID := c.GetUint("id")
    eventID,_:= strconv.Atoi(c.Param("id"))
    

    var event models.Event
    if err := config.Db.First(&event, eventID).Error; err != nil {
        c.JSON(404, gin.H{"error": "Event not found"})
        return
    }

    ticket := models.Ticket{
        UserID:  userID,
        EventID: uint(eventID),
        Price:   event.Price,
    }

    config.Db.Create(&ticket)
    event.TicketNumber=event.TicketNumber-1
    config.Db.Save(&event)
   utils.JSONSuccess(c,ticket,"Ticket purchesd")
}

func ListMyTickets(c *gin.Context) {
    if c.GetString("entity") != "user" {
        utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "only companys allowed")
        return
    }

    userID := c.GetUint("id")
    var tickets []models.Ticket
    config.Db.Preload("Event").Where("user_id = ?", userID).Find(&tickets)

    utils.JSONSuccess(c,tickets,"avilable tickets")
}
