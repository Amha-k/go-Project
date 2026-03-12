package controller

import (
	"encoding/json"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/webhook"

	//"github.com/stripe/stripe-go/v72/paymentintent"
	//"fmt"
	"net/http"
	"os"
	"strconv"

	//"time"
	"log"

	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/models"
	"github.com/Amha-k/go-Project/utils"
	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72/checkout/session"
)
func StripePayment(c *gin.Context) {

	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	if c.GetString("entity") != "user" {
		utils.JSONError(c, "Authorization", "access denied", http.StatusBadRequest, "must have user Authorization")
		return
	}

	userID := c.GetUint("id")
	eventID, _ := strconv.Atoi(c.Param("id"))

	var event models.Event
	if err := config.Db.First(&event, eventID).Error; err != nil {
		utils.JSONError(c, "BAD_REQUEST", "cant find event", http.StatusNotFound, err.Error())
		return
	}

	var user models.User
	if err := config.Db.First(&user, userID).Error; err != nil {
		utils.JSONError(c, "BAD_REQUEST", "cant find user", http.StatusNotFound, err.Error())
		return
	}

	var totalTicket int64
	config.Db.Model(&models.Ticket{}).
		Where("event_id=? AND user_id=? AND payment_status=?", eventID, userID, "paid").
		Count(&totalTicket)

	if totalTicket >= 6 {
		utils.JSONError(c, "BAD_REQUEST", "cant buy more than 6 tickets", http.StatusBadRequest, nil)
		return
	}

	if event.TicketNumber <= 0 {
		utils.JSONError(c, "BAD_REQUEST", "no tickets available", http.StatusBadRequest, nil)
		return
	}

	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),

		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String("usd"),

					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String(event.Name),
					},

					UnitAmount: stripe.Int64(int64(event.Price * 100)),
				},

				Quantity: stripe.Int64(1),
			},
		},

		Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),

		SuccessURL: stripe.String("http://localhost:5000/api/users/payment/stripe/success?session_id={CHECKOUT_SESSION_ID}"),

		CancelURL: stripe.String("http://localhost:5000/payment-cancel"),
	}

	params.AddMetadata("user_id", strconv.Itoa(int(userID)))
	params.AddMetadata("event_id", strconv.Itoa(eventID))

	s, err := session.New(params)

	if err != nil {
		utils.JSONError(c, "STRIPE_ERROR", "checkout creation failed", http.StatusInternalServerError, err.Error())
		return
	}

	ticket := models.Ticket{
		UserID:        userID,
		EventID:       uint(eventID),
		Price:         event.Price,
		PaymentStatus: "pending",
		PaymentRef:    s.ID,
	}

	config.Db.Create(&ticket)

	utils.JSONSuccess(c, gin.H{
		"checkout_url": s.URL,
		"payment_ref":  s.ID,
	}, "Redirect to payment")
}





func StripeWebhook(c *gin.Context) {

	payload, err := c.GetRawData()

	if err != nil {
		
		utils.JSONError(c, "STRIPE_ERROR", "invalid payload", http.StatusBadRequest, err.Error())
		return
	}

	sigHeader := c.GetHeader("Stripe-Signature")

	endpointSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")

	event, err := webhook.ConstructEvent(payload, sigHeader, endpointSecret)

	if err != nil {
		
		utils.JSONError(c, "STRIPE_ERROR", "signature verification failed", http.StatusBadRequest, err.Error())
		return
	}

	if event.Type == "checkout.session.completed" {

		var checkoutSession stripe.CheckoutSession

		err := json.Unmarshal(event.Data.Raw, &checkoutSession)

		if err != nil {
			log.Println("Webhook parse error:", err)
			
			utils.JSONError(c, "STRIPE_ERROR", "parse error", http.StatusBadRequest, err.Error())
		return
			
		}

		var ticket models.Ticket

		if err := config.Db.Where("payment_ref = ?", checkoutSession.ID).First(&ticket).Error; err != nil {

			log.Println("Ticket not found")

			utils.JSONSuccess(c, gin.H{"received": true},"payment recived")
			return
		}

		ticket.PaymentStatus = "paid"

		config.Db.Save(&ticket)

		var event models.Event

		config.Db.First(&event, ticket.EventID)

		event.TicketNumber -= 1

		config.Db.Save(&event)

		var user models.User

		config.Db.First(&user, ticket.UserID)

		go utils.SendEmail(
			user.Email,
			"Ticket Purchase Successful",
			utils.TicketEmailTemplate(user.Name, event.Name, event.EventDate),
		)

		log.Println("Payment successful for user:", user.ID)
	}

	utils.JSONSuccess(c, gin.H{"received": true},"payment recived")
}

func StripeSuccess(c *gin.Context) {

	sessionID := c.Query("session_id")

	if sessionID == "" {
		utils.JSONError(c, "STRIPE_ERROR", "parse error", http.StatusBadRequest, nil)
		return
		
	}

	utils.JSONSuccess(c, gin.H{
		"message":    "payment successful",
		"session_id": sessionID,
	},"success")
}

