package controller

import (
	"net/http"

	"github.com/Amha-k/go-Project/models"
	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)



func UserRegister(c *gin.Context){
var RegisterInput struct{
	  Name string   `json:name`
      Email string  `json:"email" binding:"required,email"`
	  Password string  `json:"password" binding:"required,min=8"`

	}
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

utils.JSONSuccess(c,token,"company succesfuly registerd")

}



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

utils.JSONSuccess(c,token,"company succesfuly logedin")


}