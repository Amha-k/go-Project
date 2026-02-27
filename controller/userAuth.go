package controller

import (
	"net/http"
	"time"

	"github.com/Amha-k/go-Project/models"
	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"github.com/pquerna/otp/totp"
)


// @Summary Register a new user
// @Description Create a user account
// @Tags user
// @Accept json
// @Produce json
// @Param user body models.UserRegisterRequest true "company registration info"
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /company/register [post]
func UserRegister(c *gin.Context){

var RegisterInput models.UserRegisterRequest
  if err:=c.ShouldBindJSON(&RegisterInput); err!=nil{
	utils.JSONError(c, "File Error", "Fill all fileds",http.StatusBadRequest , err.Error())
		return
  }

  hashedPassword,err := bcrypt.GenerateFromPassword([]byte(RegisterInput.Password),10)

  if err!=nil{
	  utils.JSONError(c, "password", "Failed to hash password",http.StatusInternalServerError , err.Error())
		return
  }

user :=models.User{
	Email:RegisterInput.Email, 
	Password:string(hashedPassword),
}
if err := config.Db.Create(&user).Error; err!=nil{
	utils.JSONError(c, "create company", "Failed to create company ",http.StatusBadRequest , err.Error())
		return

}
token ,_:= utils.GenerateToken(user.ID,"user")
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

utils.JSONSuccess(c,token,"company succesfuly registerd")

}



// @Summary Login as a user
// @Description Login and get access token
// @Tags user
// @Accept json
// @Produce json
// @Param user body models.UserLoginRequest true "Login credentials"
// @Success 200 {object} utils.SuccessResponse
// @Failure 401 {object} utils.ErrorResponse
// @Router /users/login [post]
func UserLogin(c *gin.Context){
	var loginInput struct{
		Email string   `json:"email"`
		Password string `json:"password"`
	}

if err:=c.ShouldBindJSON(&loginInput); err!=nil{
utils.JSONError(c, "File Error", "Fill all fileds",http.StatusBadRequest , err.Error())
		return
}

var user models.User

if err:=config.Db.Where("email=?",loginInput.Email).First(&user).Error; err!=nil{
 c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
        return
}
if err:=bcrypt.CompareHashAndPassword([]byte(user.Password),[]byte(loginInput.Password)); err!=nil{

utils.JSONError(c, "Authorization", "invalid email or password",http.StatusUnauthorized , err.Error())
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



	if user.MFAEnabled{
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

tempToken,err :=utils.GenerateTempToken(user.ID)

	utils.JSONSuccess(c, gin.H{
		"secret": key.Secret(),
		"qr_url": key.URL(),
        "tep_token": tempToken,
	}, "Scan QR with Authenticator app")
		return 
	}
	cookieValue := tokenID + "." + secret

	c.SetCookie("refresh_token", cookieValue, 7*24*3600, "/", "", true, true)

 utils.JSONSuccess(c,token,"company succesfuly logedin")


}
