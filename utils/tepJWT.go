package utils

import (
    "time"
    "github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("super-secret-key")

func GenerateTempToken(userID uint) (string, error) {

    claims := jwt.MapClaims{
        "user_id": userID,
        "type":    "mfa_temp",
        "exp":     time.Now().Add(5 * time.Minute).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtKey)
}