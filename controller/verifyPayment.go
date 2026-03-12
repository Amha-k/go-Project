package controller

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/models"
	"github.com/Amha-k/go-Project/utils"
	"github.com/gin-gonic/gin"
	//"golang.org/x/tools/internal/event"
)

func VerifyPayment(c *gin.Context) {
	txref := c.Param("txref")
	userID := 12//c.GetUint("id") 
	
	url := "https://api.chapa.co/v1/transaction/verify/" + txref

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("CHAPA_SECRET"))

	client := &http.Client{}
	resp, err := client.Do(req)
	
     if err!=nil{ 
    utils.JSONError(c, "BAD_REQUEST", "payment request failed",http.StatusBadRequest , err.Error())
        return
    }
defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	data := result["data"].(map[string]interface{})
	status := data["status"]
var ticket models.Ticket

if status == "success" {
		
	
if err := config.Db.Where("payment_ref = ?", txref).First(&ticket).Error; err != nil {
utils.JSONError(c, "BAD_REQUEST", "ticket not found",http.StatusBadRequest , err.Error())
        return

}

eventID := ticket.EventID


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
ticket.PaymentStatus = "paid"
 go utils.SendEmail(
    user.Email,
    "Ticket Purchase Successful",
    utils.TicketEmailTemplate(user.Name, event.Name, event.EventDate),
)
config.Db.Save(&ticket)
 event.TicketNumber=event.TicketNumber-1
    config.Db.Save(&event)
}
utils.JSONSuccess(c,ticket,"Ticket purchased")

}

/*
func ChapaSuccess(c *gin.Context) {

	sessionID := c.Query("txrfef")

	if sessionID == "" {
		utils.JSONError(c, "chapa", "parse error", http.StatusBadRequest, nil)
		return
		
	}

	utils.JSONSuccess(c, gin.H{
		"message":    "payment successful",
		"session_id": sessionID,
	},"success")
}
*/