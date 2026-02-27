package utils

import (
	"crypto/rand"
	"encoding/base64"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func GenerateRefreshPair() (tokenID string, secret string, hash string, err error) {
	tokenID = uuid.NewString()

	b := make([]byte, 32)
	_, err = rand.Read(b)
	if err != nil {
		return
	}

	secret = base64.URLEncoding.EncodeToString(b)
	hashBytes, err := bcrypt.GenerateFromPassword([]byte(secret), bcrypt.DefaultCost)
	hash = string(hashBytes)

	return tokenID, secret ,hash ,nil
}
func CompareToken(hash, token string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(token))
}