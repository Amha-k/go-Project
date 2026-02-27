// @title Go Project
// @version 1.0
// @description event posting webapp
// @termsOfService http://example.com/terms/

// @contact.name amha
// @contact.email amhakifle09@gmail.com.com

// @host localhost:5000
// @BasePath /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization






package main

import (
	//"fmt"
	//"log"
	//"os"
	//"io"

 ginSwagger "github.com/swaggo/gin-swagger"
    swaggerFiles "github.com/swaggo/files"
    _ "github.com/Amha-k/go-Project/docs" 



	// "github.com/joho/godotenv"
	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/middleware"
	// "github.com/Amha-k/go-Project/models"
	"github.com/Amha-k/go-Project/routes"
	"github.com/gin-gonic/gin"
	"github.com/didip/tollbooth/v7"
    tollbooth_gin "github.com/didip/tollbooth_gin"
)



func main() {

	config.LoadEnv()
	config.ConnectDB()

    router:=gin.Default()
api:=router.Group("/api")
limiter := tollbooth.NewLimiter(5, nil)
router.Use(tollbooth_gin.LimitHandler(limiter))


router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

routes.AuthRoutes(api)
api.Use(middleware.AuthToken())





companyApi:=api.Group("/company")

routes.CompanyRoutes(companyApi)
userRoutes:=api.Group("/users")
routes.UserRoute(userRoutes)

router.Run()



}










//////////////////////////////////////////////////////////////////////////////////////////



/*
router.GET("/getData", getData)
    router.POST("/postData", postDataHandler)
*/
/////////////////


// use to read row data from the request bodey and parse it
/*
func postDataHandler(c *gin.Context){
	body :=c.Request.Body
	value,_=io.ReadAll(body)
	c.JSON(200, gin.H{
		"message": "Data recived",
		"data": string(value),
	})
}

*/
//////////////////////////////////////////////////////
/*
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("PORT is not set")
	}
	fmt.Printf("Server is running on port %s", port)

	*/
	/////////// this is like a controller

/*
func getData(c *gin.Context) {
		c.JSON(200, gin.H{

			"message": "Hello World",
		})
	}
func postDataHandler(c *gin.Context) {
		var jsonData map[string]interface{}
		if err := c.ShouldBindJSON(&jsonData); err != nil {
			c.JSON(400, gin.H{"error": "Invalid JSON"})
			return
		}
	c.JSON(200,gin.H{
		"message": "Data recived",
		"data": jsonData,

	})
	}

*/
