package controller

import (
	//"crypto/rand"
	//"encoding/base64"
	"net/http"

	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/models"
	"github.com/gin-gonic/gin"
	//"github.com/pquerna/otp"
	"github.com/pquerna/otp/totp"
	"github.com/Amha-k/go-Project/utils"
)


func EnableMFA(c *gin.Context) {

	

	userID := c.GetUint("id")

	var user models.User
	config.Db.First(&user, userID)

	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "eventx",
		AccountName: user.Email,
	})

	if err != nil {
		utils.JSONError(c, "MFA", "Failed to generate key", http.StatusInternalServerError, err.Error())
		return
	}

	user.MFASecret = key.Secret()
	config.Db.Save(&user)

	utils.JSONSuccess(c, gin.H{
		"secret": key.Secret(),
		"qr_url": key.URL(),
	}, "Scan QR with Authenticator app")
}