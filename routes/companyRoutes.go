package routes

import(
	"github.com/gin-gonic/gin"
	"github.com/Amha-k/go-Project/controller"
)

func CompanyRoutes(router *gin.RouterGroup){
	router.GET("",controller.GetMyEvents)
	router.POST("",controller.CreateEvent)
	router.DELETE("/:id",controller.DeleteEvent)
	router.PATCH("/:id",controller.UpdateEvent)
}


