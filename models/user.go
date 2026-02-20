package models

import(
	"github.com/Amha-k/go-Project/config"
	"gorm.io/gorm"
	
)


type User struct{

	gorm.Model

	Name string   `json:"name"`
	Email string  `json:"email"`
	/// Id int       `json:"id"`      // this is not needed to the database

}

func MigrateUser(){
	config.Db.AutoMigrate(&User{})
}

// this is not required in using database

/*
var Users []User

var NextID int = 1
*/