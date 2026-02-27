package routes


import (
	"github.com/gin-gonic/gin"
	"github.com/Amha-k/go-Project/controller"
)

func UserRoute(router *gin.RouterGroup){
    router.GET("/events", controller.ListAllEvents)       
    router.POST("/events/:id/buy", controller.BuyTicket) 
    router.GET("/tickets", controller.ListMyTickets) 
    router.POST("/logout",controller.Logout)    
    router.GET("/search",controller.SearchEvents)
    router.GET("/MFAoption",controller.EnableMFA)

}

