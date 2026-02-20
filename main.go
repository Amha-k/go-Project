package main

import (
	//"fmt"
	//"log"
	//"os"
	//"io"

	// "github.com/joho/godotenv"
	"github.com/gin-gonic/gin"
	"github.com/Amha-k/go-Project/routes"
	"github.com/Amha-k/go-Project/config"
)


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

func main() {

	config.LoadEnv()
	config.ConnectDB()

    router:=gin.Default()

	
routes.UserRoutes(router)

router.Run()
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
}