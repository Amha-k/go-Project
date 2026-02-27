package controller

import (
	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/middleware"
	"github.com/Amha-k/go-Project/models"
	//"github.com/Amha-k/go-Project/utils"
	"github.com/gin-gonic/gin"
	"github.com/pquerna/otp/totp"
	"time"
	"github.com/Amha-k/go-Project/utils"
)
func VerifyMFA(c *gin.Context) {

    var input struct {
        TempToken string
        Code      string
    }

    c.ShouldBindJSON(&input)

    userID, err := middleware.ValidateTempToken(input.TempToken)
    if err != nil {
        c.JSON(401, gin.H{"error": "invalid temp token"})
        return
    }
var user models.User
	if err := config.Db.First(&user, userID).Error; err != nil {
		c.JSON(404, gin.H{"error": "user not found"})
		return
	}

    if !totp.Validate(input.Code, user.MFASecret) {
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

 utils.JSONSuccess(c,token,"company succesfuly logedin")

}