package middleware

import(
	"net/http"
	"os"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/Amha-k/go-Project/utils"
)


func AuthToken() gin.HandlerFunc{
	return  func(c *gin.Context){
		authHeader := c.GetHeader("Authorization")
		parts := strings.Split(authHeader, " ")
        tokenString := parts[1]
		if tokenString==""{
			utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "cant acces this ")
    
			c.Abort()
			return 
		}

		token ,err := jwt.Parse(tokenString,func(token *jwt.Token)(interface{},error){
			 if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method")
            }
			return []byte(os.Getenv("JWT_SECRET_KEY")),nil
		})

		if err!=nil  {
        utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "cant acces this ")
    
			
			c.Abort()
			return 
	}
	if !token.Valid {
       utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "cant acces this ")
    
			
			c.Abort()
			return 
	}

	claims:= token.Claims.(jwt.MapClaims)
	c.Set("id",uint(claims["id"].(float64)))
	c.Set("entity",claims["entity"].(string))

	c.Next()
}
}