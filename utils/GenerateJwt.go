package utils

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)



func GenerateToken(id uint , entity string) (string ,error){

	secret:=[]byte(os.Getenv("JWT_SECRET_KEY"))

	if len(secret)==0{
		return "",errors.New("jtw secret not found")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,jwt.MapClaims{
		"id":id,
		"entity":entity,
		"expires":time.Now().Add(24*time.Hour).Unix(),
	})


return token.SignedString(secret)
}