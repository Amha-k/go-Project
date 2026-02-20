package routes

import(
	"github.com/gin-gonic/gin"
	"github.com/Amha-k/go-Project/controller"
)

func AuthRoutes(router *gin.RouterGroup){
	router.POST("/users/register",controller.UserRegister)
	router.POST("/company/register",controller.CompanyRegister)
	router.POST("/users/login",controller.UserLogin)
	router.POST("/company/login",controller.CompanyLogin)
	
}


