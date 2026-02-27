package models

import(
	// "github.com/Amha-k/go-Project/config"
	"gorm.io/gorm"
	
)

type User struct{

	gorm.Model

	Name string   `gorm:"not null"`
	Email string  `gorm:"unique;not null"`
	Password string `gorm:"not null"`
	MFASecret string
	MFAEnabled bool
	Tickets []Ticket    `gorm:"foreignKey:UserID"`

	/// Id int       `json:"id"`      // this is not needed to the database

}

//////////////////////////////////////////
/*
func MigrateUser(){
	config.Db.AutoMigrate(&User{})
}
	*


	////////////////////////////////////////////
// this is not required in using database

/*
var Users []User

var NextID int = 1
*/