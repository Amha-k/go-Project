package models

import(
	"gorm.io/gorm"
)

type Ticket struct{
	gorm.Model
    UserID uint 
	Price float64 
	EventID uint 
	Event Event `gorm:"foreignKey:EventID;<-:false" json:"-"`
}