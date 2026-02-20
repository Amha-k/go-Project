package models


import(
	"gorm.io/gorm"
	"time"
)

type Event struct{
	gorm.Model

	Name string `gorm:"not null"`
	Description string `gorm:""`
	Price float64 `gorm:"not null"`
	CompanyID uint `gorm:"not null"`
	Company   Company `gorm:"foreignKey:CompanyID;<-:false" json:"-"`
	EventDate   time.Time `json:"eventdate" gorm:"not null"` 
	TicketNumber uint
	Tickets []Ticket `gorm:"foreignKey:EventID"`

}