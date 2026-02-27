package routes

import(
	"github.com/gin-gonic/gin"
	"github.com/Amha-k/go-Project/controller"
)

func CompanyRoutes(router *gin.RouterGroup){
	router.GET("/event",controller.GetMyEvents)
	router.POST("/event",controller.CreateEvent)
	router.DELETE("/event/:id",controller.DeleteEvent)
	router.PATCH("/event/:id",controller.UpdateEvent)
	router.POST("/logout",controller.Logout)
}


