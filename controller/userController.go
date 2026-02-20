package controller

import (
	"github.com/Amha-k/go-Project/models"
	"net/http"
	"github.com/gin-gonic/gin"
//	"github.com/joho/godotenv"
    "strconv"
)
func GetUsers(c * gin.Context){
	c.JSON(http.StatusOK,gin.H{
		"users": models.Users,
	})
}


func CreateUser(c *gin.Context){
var newUser models.User

if err :=c.ShouldBind(&newUser); err !=nil{
	c.JSON(http.StatusBadRequest, gin.H{
		"error": err.Error(),
	})
return 
}
newUser.Id = models.NextID
models.NextID++

models.Users = append(models.Users, newUser)

c.JSON(http.StatusCreated, gin.H{
	"message": "user created successfully",
})

}


func GetByID(c *gin.Context){
id , _ := strconv.Atoi(c.Param("id"))

for _ ,user:= range models.Users{
	if user.Id == id{
		c.JSON(http.StatusOK, gin.H{
			"user": user,
		})
		return 
	}
}

c.JSON(http.StatusNotFound, gin.H{
	"message": "user not found",
})
}


func DeleteUser(c *gin.Context){
	id ,_:=strconv.Atoi(c.Param("id"))

	for i,user:=range models.Users{
		if user.Id == id{
			models.Users=append(models.Users[:i],models.Users[i+1:]...)
			c.JSON(http.StatusOK, gin.H{
				"message":"user deleted successfully",
			})
			return
		}
	}
   c.JSON(http.StatusNotFound, gin.H{
	"message": "no user with this id",
   }) 
}


func UpdateUser(c *gin.Context){
	id,_:= strconv.Atoi(c.Param("id"))

	var updatedUser models.User

	if err:= c.ShouldBindJSON(&updatedUser); err !=nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return 
	}

	for i, user:= range models.Users{
		if user.Id == id{
			models.Users[i].Name= updatedUser.Name
			models.Users[i].Email= updatedUser.Email

			c.JSON(http.StatusOK, gin.H{
				"message": "user updated successfully",
			})
		}
	}
}