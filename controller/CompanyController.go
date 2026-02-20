package controller

import (
	"github.com/Amha-k/go-Project/config"
	"github.com/Amha-k/go-Project/models"
	"net/http"
	"github.com/gin-gonic/gin"
//	"github.com/joho/godotenv"
    "strconv"
	"github.com/Amha-k/go-Project/utils"
	"time"
	"gorm.io/gorm"
)




func CreateEvent(c *gin.Context) {
    if c.GetString("entity") != "company" {
        
		utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "only companys allowed")
        return
    }

    companyID := c.GetUint("id")

    var input struct {
        Name         string    `json:"name"`
        Description  string    `json:"description"`
        Price        float64   `json:"price"`
        EventDate    time.Time `json:"eventdate"`
        TicketNumber uint      `json:"ticketNumber"`
  
    }

    if err := c.BindJSON(&input); err != nil {
		utils.JSONError(c, "Fill Error", "Fill all fileds",http.StatusBadRequest , err.Error())
        return
    }


var events []models.Event

if err:= config.Db.Where("name = ? AND event_date = ?",input.Name,input.EventDate).First(&events).Error; err!=nil{
if err==gorm.ErrRecordNotFound{
}else{
utils.JSONError(c,"DATABASE_ERROR","database error happened",http.StatusInternalServerError,err.Error())
}
}else{
	utils.JSONError(c, "EVENT_EXISTS", "An event with this name and date already exists", http.StatusBadRequest, nil)
	return
}



    event := models.Event{
        Name: input.Name,
        Description: input.Description,
        Price: input.Price,
        CompanyID: companyID,
		EventDate: input.EventDate,
		TicketNumber: input.TicketNumber,
    }

   result := config.Db.Create(&event)
if result.Error != nil {
    utils.JSONError(c, "DB Error", "Failed to create event", http.StatusInternalServerError, result.Error.Error())
    return
}


var company models.Company
	if err := config.Db.First(&company, companyID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.JSONError(c, "COMPANY_NOT_FOUND", "Company does not exist", http.StatusBadRequest, nil)
			return
		}
		utils.JSONError(c, "DB_ERROR", "Database error", http.StatusInternalServerError, err.Error())
		return
	}
resp := utils.EventResponse{
		ID:           event.ID,
		Name:         event.Name,
		Description:  event.Description,
		Price:        event.Price,
		CompanyID:    event.CompanyID,
		CompanyName:  company.Name,
		EventDate:    event.EventDate,
		TicketNumber: event.TicketNumber,
	}

utils.JSONSuccess(c, resp, "Event created")
}




func GetMyEvents(c *gin.Context) {
    if c.GetString("entity") != "company" {
        utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "only companys allowed")
        return
    }

    companyID := c.GetUint("id")

    var events []models.Event
    config.Db.Where("company_id = ?", companyID).Find(&events)

    utils.JSONSuccess(c,events,"avilable events")
}



func UpdateEvent(c *gin.Context) {
    if c.GetString("entity") != "company" {
       utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "only companys allowed")
        return
    }

    companyID := c.GetUint("id")
    eventID,_ :=strconv.Atoi(c.Param("id"))

    var event models.Event
    if err := config.Db.First(&event, eventID).Error; err != nil {
        c.JSON(404, gin.H{"error": "Event not found"})
        return
    }

    if event.CompanyID != companyID {
        utils.JSONError(c, "Authorization", "only can update your own event",http.StatusBadRequest , "only your event")
        return
    }

    var input struct {
        Name         string    `json:"name"`
        Description  string    `json:"description"`
        Price        float64   `json:"price"`
        EventDate    time.Time `json:"eventdate"`
        TicketNumber uint      `json:"ticketNumber"`
  
    }

    c.BindJSON(&input)

    event.Name = input.Name
    event.Description = input.Description
    event.Price = input.Price
	event.EventDate=input.EventDate
	event.TicketNumber=input.TicketNumber

    config.Db.Save(&event)
   utils.JSONSuccess(c,event,"event updated")
}

func DeleteEvent(c *gin.Context) {
    if c.GetString("entity") != "company" {
        utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "only companys allowed")
        return
    }

    companyID := c.GetUint("id")
    eventID,_:=strconv.Atoi(c.Param("id"))

    var event models.Event
    if err := config.Db.First(&event, eventID).Error; err != nil {
       utils.JSONError(c, "Fill Error", "event not found",http.StatusNotFound , err.Error())
        return
    }

    if event.CompanyID != companyID {
        utils.JSONError(c, "Authorization", "access denied",http.StatusBadRequest , "only companys allowed")
        return
    }

    config.Db.Delete(&event)
    utils.JSONSuccess(c,event,"event succesfuly deleted")
}










/*
func GetUsers(c * gin.Context){
	var users []models.User
	config.Db.Find(&users)
	c.JSON(http.StatusOK,gin.H{
		"users":users,
	})
}


func CreatEvent(c *gin.Context){
var newUser models.User

if err :=c.ShouldBindJSON(&newUser); err!=nil{
	c.JSON(http.StatusBadRequest, gin.H{
		"error": err,
	})
return 
}

if err:= config.Db.Create(&newUser).Error; err!=nil{
	c.JSON(http.StatusInternalServerError, gin.H{
		"error":"failed to create a user",
	})
	return 

}


 // this is not for using database
/*
newUser.Id = models.NextID
models.NextID++

models.Users = append(models.Users, newUser)
///////////////////////////////////

c.JSON(http.StatusCreated, gin.H{
	"message": "user created successfully",
})

}


func GetByID(c *gin.Context){

	var user models.User
id , _ := strconv.Atoi(c.Param("id"))
 if err:= config.Db.First(&user, id).Error; err!=nil{
	c.JSON(http.StatusNotFound, gin.H{
		"error":" user not found",
	})
	return 
 }

c.JSON(http.StatusOK, gin.H{
	"user":user,
})

/// this does not work for database
/*
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

///////////////////////////////
}


func DeleteUser(c *gin.Context){
	id ,_:=strconv.Atoi(c.Param("id"))
var user models.User

if err:= config.Db.Delete(&user,id).Error; err!=nil{
	c.JSON(http.StatusBadRequest, gin.H{
		"error":"user not found",
	})
	return
}
  c.JSON(http.StatusOK, gin.H{
	"message":"user deleted succesfully",
  })

/*
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
   
   //////////////////////////////////
}


func UpdateUser(c *gin.Context){
	id,_:= strconv.Atoi(c.Param("id"))

	var user models.User
	var updatedUser models.User

  if err:= c.ShouldBindJSON(&updatedUser); err!=nil{
	c.JSON(http.StatusBadRequest, gin.H{
		"error":err.Error(),
	})
	return 
  }
 if err:= config.Db.First(&user,id); err!=nil{
	c.JSON(http.StatusNotFound, gin.H{
		"error":"user not found",
	})
	return 
 }
 
 user.Name=updatedUser.Name
 user.Email=updatedUser.Email

 config.Db.Save(&user)

 c.JSON(http.StatusOK, gin.H{
	"message": "user updated successfully",
	"user": user,
 })



	/*
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
		////////////////////////////////
}

*/