package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB
func LoadEnv(){

if err:= godotenv.Load(".env"); err!=nil{
	fmt.Println("Error loading .env file")
}

}


func ConnectDB(){
	//dsn = Data Source Name
	dns :=fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
   os.Getenv("DB_HOST"), os.Getenv("DB_USER"),os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"))

	db, err:= gorm.Open(postgres.Open(dns), &gorm.Config{})
	if err!=nil{
		log.Fatal("Error connecting to database")
	}
	Db = db
	fmt.Println("database connected succesfully")
}


