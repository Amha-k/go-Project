package routes

import(
	"github.com/gin-gonic/gin"
	"github.com/Amha-k/go-Project/controller"
)

func UserRoutes(router *gin.Engine){
	router.GET("/users",controller.GetUsers)
	router.POST("/users",controller.CreateUser)
	router.GET("/users/:id",controller.GetByID)
	router.DELETE("/users/:id",controller.DeleteUser)
	router.PATCH("/users/:id",controller.UpdateUser)
}


