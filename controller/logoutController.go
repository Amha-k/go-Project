package controller

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/models"
	"github.com/Amha-k/go-Project/utils"
)

func Logout(c *gin.Context) {

	entity := c.GetString("entity")
	userID := c.GetUint("id")

	if entity == "" || userID == 0 {
		utils.JSONError(c, "UNAUTHORIZED", "unauthorized access", http.StatusUnauthorized, nil)
		return
	}

	
	cookie, err := c.Cookie("refresh_token")
	if err != nil {
		utils.JSONError(c, "LOGOUT", "no refresh token provided", http.StatusBadRequest, nil)
		return
	}

	parts := strings.Split(cookie, ".")
	if len(parts) != 2 {
		utils.JSONError(c, "LOGOUT", "invalid refresh token", http.StatusBadRequest, nil)
		return
	}
	tokenID := parts[0]

	
	var rt models.RefreshToken
	if err := config.Db.Where("token_id = ?", tokenID).First(&rt).Error; err != nil {
		utils.JSONError(c, "LOGOUT", "refresh token not found", http.StatusNotFound, err.Error())
		return
	}

	
	if rt.Revoked {
		utils.JSONError(c, "LOGOUT", "token already revoked", http.StatusBadRequest, nil)
		return
	}

	rt.Revoked = true
	config.Db.Save(&rt)

	
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)

	utils.JSONSuccess(c, nil, "successfully logged out")
}