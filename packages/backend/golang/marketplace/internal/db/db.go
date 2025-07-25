package db

import (
	"database/sql"
	"fmt"
	"github.com/go-sql-driver/mysql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/sst/sst/v3/sdk/golang/resource"
	"log"
	"sync"
)

type SqlDB struct {
	DB *sql.DB
}

var instance *SqlDB
var once sync.Once

func dbVar(name string) (string, error) {

	value, err := resource.Get("MyDatabase", name)
	if err != nil {
		return "", err
	}

	if strValue, ok := value.(string); ok {
		return strValue, nil
	}

	return "", fmt.Errorf("expected string value for %s, got %T", name, value)
}

func initDB() *sql.DB {
	username, err := dbVar("username")
	if err != nil {
		log.Fatalf("Error getting username: %v", err)
	}

	password, err := dbVar("password")
	if err != nil {
		log.Fatalf("Error getting password: %v", err)
	}

	host, err := dbVar("host")
	if err != nil {
		log.Fatalf("Error getting host: %v", err)
	}

	database, err := dbVar("database")
	if err != nil {
		log.Fatalf("Error getting database: %v", err)
	}

	portEnv, err := resource.Get("MyDatabase", "port")
	if err != nil {
		log.Fatalf("Error getting port: %v", err)
	}

	port := portEnv.(float64)

	cfg := mysql.Config{
		User:                 username,
		Passwd:               password,
		Net:                  "tcp",
		Addr:                 fmt.Sprintf("%s:%d", host, int(port)),
		DBName:               database,
		AllowNativePasswords: true,
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	return db
}

func GetDB() *SqlDB {

	once.Do(func() {

		instance = &SqlDB{DB: initDB()}
	})

	return instance
}
