
package utils

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)
// SuccessResponse represents a successful API response

type SuccessResponse struct {
	Success   bool        `json:"success"`
	Status    int         `json:"status"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data"`
	Timestamp string      `json:"timestamp"`
	RequestID string      `json:"request_id,omitempty"`
}

type ErrorResponse struct {
	Success   bool        `json:"success"`
	Status    int         `json:"status"`
	Error     ErrorDetail `json:"error"`
	Timestamp string      `json:"timestamp"`
	RequestID string      `json:"request_id,omitempty"`
}

type ErrorDetail struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

// @Description Standard success response
func JSONSuccess(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusOK, SuccessResponse{
		Success:   true,
		Status:    http.StatusOK,
		Message:   message,
		Data:      data,
		Timestamp: time.Now().Format(time.RFC3339),
	})
}
// @Description Standard error response
func JSONError(c *gin.Context, code string, message string, status int, details interface{}) {
	c.JSON(status, ErrorResponse{
		Success:   false,
		Status:    status,
		Error:     ErrorDetail{Code: code, Message: message, Details: details},
		Timestamp: time.Now().Format(time.RFC3339),
	})
}
