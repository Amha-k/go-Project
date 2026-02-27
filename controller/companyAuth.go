package controller

import (
	"net/http"

	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/models"
	"github.com/Amha-k/go-Project/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"time"
)
// @Summary Register a new company
// @Description Create a company account
// @Tags company
// @Accept json
// @Produce json
// @Param company body models.UserRegisterRequest true "company registration info"
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /company/register [post]
func CompanyRegister(c *gin.Context) {
	var RegisterInput struct {
		Name     string `json:name`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding required,min=8`
	}
	if err := c.ShouldBindJSON(&RegisterInput); err != nil {
		utils.JSONError(c, "File Error", "Fill all fileds",http.StatusBadRequest , err.Error())
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(RegisterInput.Password), 10)

	if err != nil {
		utils.JSONError(c, "password", "Failed to hash password",http.StatusInternalServerError , err.Error())
		return
	}

	company := models.Company{
		Name:     RegisterInput.Name,
		Email:    RegisterInput.Email,
		Password: string(hashedPassword),
	}
	if err := config.Db.Create(&company).Error; err != nil {
		utils.JSONError(c, "create company", "Failed to create company ",http.StatusBadRequest , err.Error())
		return
		
	}
	token, _ := utils.GenerateToken(company.ID, "company")
	tokenID, secret, hash, _ := utils.GenerateRefreshPair()

	rt := models.RefreshToken{
		TokenID:   tokenID,
		TokenHash: hash,
		CompanyID:    company.ID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	config.Db.Create(&rt)

	cookieValue := tokenID + "." + secret

	c.SetCookie("refresh_token", cookieValue, 7*24*3600, "/", "", true, true)

	 utils.JSONSuccess(c,token,"company succesfuly registerd")
}

// @Summary  login company
// @Description login company account
// @Tags company
// @Accept json
// @Produce json
// @Param company body models.UserRegisterRequest true "company login info"
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /company/login [post]
func CompanyLogin(c *gin.Context) {
	var loginInput struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginInput); err != nil {
		utils.JSONError(c, "File Error", "Fill all fileds",http.StatusBadRequest , err.Error())
		return
	}

	var company models.Company

	if err := config.Db.Where("email=?", loginInput.Email).First(&company).Error; err != nil {
		
		utils.JSONError(c, "Authorization", "invalid email or password",http.StatusUnauthorized , err.Error())
		return
	}
	if err :=bcrypt.CompareHashAndPassword([]byte(company.Password), []byte(loginInput.Password)); err != nil {

		utils.JSONError(c, "Authorization", "invalid email or password",http.StatusUnauthorized , err.Error())
		return
	}
	token, _ := utils.GenerateToken(company.ID, "company")
tokenID, secret, hash, _ := utils.GenerateRefreshPair()

	rt := models.RefreshToken{
		TokenID:   tokenID,
		TokenHash: hash,
		CompanyID:    company.ID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	config.Db.Create(&rt)

	cookieValue := tokenID + "." + secret

	c.SetCookie("refresh_token", cookieValue, 7*24*3600, "/", "", true, true)

utils.JSONSuccess(c,token,"company succesfuly logedin")

}
