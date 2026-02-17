package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {

	godotenv.Load(".env")

	fmt.Println("uj")

	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("PORT is not set")
	}
	fmt.Printf("Server is running on port %s", port)
}
