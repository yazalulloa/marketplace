package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/sst/sst/v3/sdk/golang/resource"
	"io"
	"log"
	"marketplace/internal/util"
	"strings"
)

func handler(ctx context.Context, sqsEvent events.SQSEvent) error {
	//eventJson, _ := json.MarshalIndent(sqsEvent, "", "    ")
	//log.Printf("EVENT: %s", eventJson)

	jUrl, err := resource.Get("JavaService", "url")
	if err != nil {
		log.Println("Error getting JavaService", err)
		return err
	}

	url := jUrl.(string)

	for _, sqsRecord := range sqsEvent.Records {
		//fmt.Printf("The sqsRecord %s for event source %s = %s \n", sqsRecord.MessageId, sqsRecord.EventSource, sqsRecord.Body)
		var s3Event events.S3Event
		err := json.Unmarshal([]byte(sqsRecord.Body), &s3Event)
		if err != nil {
			return err
		}

		for _, s3Record := range s3Event.Records {
			log.Printf("S3 Event %s %s %s", s3Record.EventName, s3Record.S3.Bucket.Name, s3Record.S3.Object.Key)

			if strings.Contains(s3Record.EventName, "ObjectCreated:Copy") {
				log.Printf("Skipping %s", s3Record.S3.Object.Key)
				continue
			}

			client := util.GetHttpClient()

			res, err := client.Get(fmt.Sprintf("%s/api/j/rates/bcv/process-file?bucket=%s&key=%s", url, s3Record.S3.Bucket.Name, s3Record.S3.Object.Key))
			if err != nil {
				log.Printf("Error processing file %s: %v", s3Record.S3.Object.Key, err)
				return fmt.Errorf("error processing file %s: %w", s3Record.S3.Object.Key, err)
			}

			if res.StatusCode >= 400 {

				data, err := io.ReadAll(res.Body)
				_ = res.Body.Close()

				if err != nil {
					log.Printf("Error reading response body for response %s: %v", s3Record.S3.Object.Key, err)
					return fmt.Errorf("error reading response body for response %s: %w", s3Record.S3.Object.Key, err)
				}

				body := strings.TrimSpace(string(data))

				log.Printf("Error processing file %s: %s", s3Record.S3.Object.Key, body)
				return fmt.Errorf("error processing file %s: %s", s3Record.S3.Object.Key, body)
			}

			//err := bcv.ParseFile(bcv.ParsingParams{
			//	Ctx:    ctx,
			//	Bucket: s3Record.S3.Bucket.Name,
			//	Key:    s3Record.S3.Object.Key,
			//})

			if err != nil {
				return err
			}
			log.Printf("S3 Event Processed %s", s3Record.S3.Object.Key)
		}
	}

	return nil
}

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	// Make the handler available for Remote Procedure Call by AWS Lambda
	lambda.Start(handler)
}
