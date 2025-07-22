package main

import (
	"context"
	"github.com/aws/aws-lambda-go/lambda"
	"log"
	"marketplace/internal/bcv"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	lambda.Start(handler)
}

func handler(ctx context.Context, event interface{}) (string, error) {
	err := bcv.Check(ctx)
	if err != nil {
		return "", err
	}
	return "OK", nil
}
