package controller

import (
	"net/http"
	"strconv"

	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/models"
	"github.com/gin-gonic/gin"
	"github.com/Amha-k/go-Project/utils"
)

// @Summary List all available events
// @Description Get all events with company name (Users only)
// @Tags Users
// @Produce json
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /users/events [get]
// @Security BearerAuth
func ListAllEvents(c *gin.Context) {
	var events []utils.EventResponse
if c.GetString("entity") != "user" {
        utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "only users allowed")
        return
    }

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






// @Summary Buy ticket for an event
// @Description Purchase a ticket (Max 6 per user)
// @Tags Users
// @Param id path int true "Event ID"
// @Produce json
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Failure 404 {object} utils.ErrorResponse
// @Router /users/events/{id}/buy [post]
// @Security BearerAuth
func BuyTicket(c *gin.Context) {
    if c.GetString("entity") != "user" {
        utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "only companys allowed")
        return
    }

    userID := c.GetUint("id")
    eventID,_:= strconv.Atoi(c.Param("id"))
    

    var event models.Event
    if err := config.Db.First(&event, eventID).Error; err != nil {
       utils.JSONError(c,"BAD_REQUEST","cant find a event", http.StatusNotFound,nil)
	return 

    }
  var user models.User
    if err := config.Db.First(&user, userID).Error; err != nil {
       
        utils.JSONError(c,"BAD_REQUEST","cant find a user", http.StatusNotFound,nil)
	return 
    }


    ticket := models.Ticket{
        UserID:  userID,
        EventID: uint(eventID),
        Price:   event.Price,
    }
   var totalTicket int64
    config.Db.Model(&models.Ticket{}).Where("event_id=? AND user_id=?",eventID,userID).Count(&totalTicket)
  if totalTicket >=6 {
	utils.JSONError(c,"BAD_REQUEST","cant buy more than 6 TICKETS", http.StatusBadRequest,nil)
	return 
  }
   
	if event.TicketNumber<=0{
		 utils.JSONError(c, "BAD_REQUEST", "there is no avillable ticket",http.StatusBadRequest , nil)
        return
	}
    go utils.SendEmail(
    user.Email,
    "Ticket Purchase Successful",
    utils.TicketEmailTemplate(user.Name, event.Name, event.EventDate),
)
	 config.Db.Create(&ticket)
    event.TicketNumber=event.TicketNumber-1
    config.Db.Save(&event)
   utils.JSONSuccess(c,ticket,"Ticket purchesd")

}


// @Summary List my purchased tickets
// @Description Get all tickets for logged-in user
// @Tags Users
// @Produce json
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /users/tickets [get]
// // @Security BearerAuth
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



// @Summary Search events
// @Description Search events by name, date, min price, max price
// @Tags Users
// @Param name query string false "Event name"
// @Param eventDate query string false "Event Date (YYYY-MM-DD)"
// @Param minPrice query number false "Minimum Price"
// @Param maxPrice query number false "Maximum Price"
// @Produce json
// @Success 200 {object} utils.SuccessResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /users/search [get]
// @Security BearerAuth
func SearchEvents(c *gin.Context) {
    name := c.Query("name")
    eventDate := c.Query("eventDate")
    minPriceStr := c.Query("minPrice")
    maxPriceStr := c.Query("maxPrice")

    db := config.Db.Model(&models.Event{})

    if name != "" {
        db = db.Where("name ILIKE ?", "%"+name+"%")
    }

    if eventDate != "" {
        db = db.Where("DATE(event_date) = ?", eventDate)
    }

    if minPriceStr != "" {
        if minPrice, err := strconv.ParseFloat(minPriceStr, 64); err == nil {
            db = db.Where("price >= ?", minPrice)
        }
    }

    if maxPriceStr != "" {
        if maxPrice, err := strconv.ParseFloat(maxPriceStr, 64); err == nil {
            db = db.Where("price <= ?", maxPrice)
        }
    }

    var events []models.Event
    if err := db.Find(&events).Error; err != nil {
        utils.JSONError(c,"DATABASE_ERROR","couldn't find data", http.StatusInternalServerError,nil)
        return
    }

    utils.JSONSuccess(c,events,"available events")
}












////////////////////////////////////////////////////

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

