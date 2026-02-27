package models

import (
	"time"
	"gorm.io/gorm"
)

type RefreshToken struct {
	gorm.Model

	TokenID   string `gorm:"uniqueIndex;not null"`
	TokenHash string `gorm:"not null"`
	UserID    uint
	CompanyID uint
	ExpiresAt time.Time
	Revoked   bool
}