package middleware

import(
//	"net/http"
	"os"
//	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	//"github.com/Amha-k/go-Project/utils"
)

func AuthToken() gin.HandlerFunc {
    return func(c *gin.Context) {

        authHeader := c.GetHeader("Authorization")

        var tokenValid bool

        if authHeader != "" {
            parts := strings.Split(authHeader, " ")
            if len(parts) == 2 && parts[0] == "Bearer" {
                tokenString := parts[1]
                token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
                    return []byte(os.Getenv("JWT_SECRET_KEY")), nil
                })

                if err == nil && token.Valid {
                    claims := token.Claims.(jwt.MapClaims)
                    c.Set("id", uint(claims["id"].(float64)))
                    c.Set("entity", claims["entity"].(string))
                    tokenValid = true
                }
            }
        }

        if tokenValid {
            c.Next()
            return
        }

       
      if tryRefresh(c) {
          return // refresh successful → new token issued, request continues
      }
	

       
        c.AbortWithStatusJSON(401, gin.H{"error": "invalid or expired token"})
    }
}