package controller

import (
	"github.com/Amha-k/go-Project/config"
	//"github.com/Amha-k/go-Project/middleware"
	"github.com/Amha-k/go-Project/models"
	//"github.com/Amha-k/go-Project/utils"
	"github.com/gin-gonic/gin"
	"github.com/pquerna/otp/totp"
    "github.com/pquerna/otp"

	"time"
	"github.com/Amha-k/go-Project/utils"
	
)
func VerifyMFA(c *gin.Context) {

    var input struct {
        Code      string
    }

    c.ShouldBindJSON(&input)

   
userID:=c.GetUint("id")
var user models.User
	if err := config.Db.First(&user, userID).Error; err != nil {
		c.JSON(404, gin.H{"error": "user not found"})
		return
	}

    valid ,_:= totp.ValidateCustom(input.Code, user.MFASecret, time.Now(), totp.ValidateOpts{
		Period:    30,
		Skew:      1, 
		Digits:    6,
		Algorithm: otp.AlgorithmSHA1,
	})

	if !valid {
		c.JSON(401, gin.H{"error": "wrong otp"})
		return
	}

    token , _:= utils.GenerateToken(user.ID,"user")
tokenID, secret, hash, _ := utils.GenerateRefreshPair()

	rt := models.RefreshToken{
		TokenID:   tokenID,
		TokenHash: hash,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	config.Db.Create(&rt)
	cookieValue := tokenID + "." + secret

	c.SetCookie("refresh_token", cookieValue, 7*24*3600, "/", "", true, true)

 utils.JSONSuccess(c,token,"user loged in succesfuly logedin")

}