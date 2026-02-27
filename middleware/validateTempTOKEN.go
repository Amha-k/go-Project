
package middleware

import (
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"os"
)

func ValidateTempToken(tokenStr string) (uint, error) {

    token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
        return os.Getenv("JWT_SECRET_KEY"), nil
    })

    if err != nil || !token.Valid {
        return 0, err
    }

    claims := token.Claims.(jwt.MapClaims)

    if claims["type"] != "mfa_temp" {
        return 0, errors.New("not temp token")
    }

    return uint(claims["user_id"].(float64)), nil
}