package middleware

import(

	"time"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/Amha-k/go-Project/models"
	"github.com/Amha-k/go-Project/utils"
	"github.com/Amha-k/go-Project/config"
	
)
func tryRefresh(c *gin.Context) bool {

    cookie, err := c.Cookie("refresh_token")
    if err != nil {
        return false
    }

    parts := strings.Split(cookie, ".")
    if len(parts) != 2 {
        return false
    }

    var rt models.RefreshToken
    if err := config.Db.Where("token_id = ?", parts[0]).First(&rt).Error; err != nil {
        return false
    }

    if rt.Revoked || time.Now().After(rt.ExpiresAt) {
        return false
    }

    if utils.CompareToken(rt.TokenHash, parts[1]) != nil {
        return false
    }

    entity := "user"
    id := rt.UserID
	
    if rt.CompanyID !=0 {
        entity = "company"
        id = rt.CompanyID
    }

   
    newAccess, _ := utils.GenerateToken(id, entity)
    c.Header("X-New-Access-Token", newAccess)

    c.Set("id", id)
    c.Set("entity", entity)

   
    c.Next()
    return true
}