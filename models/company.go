package models

import(
	"gorm.io/gorm"
)


type Company struct{
	gorm.Model
	Name string `gorm:"not null"`
	Email string `gorm:"unique;not null"`
	Password string `gorm:"not null"`

	Events []Event 
}