package bcv

import (
	"context"
	"crypto/tls"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"io"
	"log"
	"marketplace/internal/aws_h"
	"net"
	"net/http"
	"slices"
	"strings"
	"time"
)

const MetadataProcessedKey = "processed"
const MetadataLastProcessedKey = "lastprocessed"
const MetadataRatesParsedKey = "ratesparsed"
const MetadataNumOfSheetsKey = "numofsheets"

var (
	netTransport = &http.Transport{
		DialContext: (&net.Dialer{
			Timeout: time.Second * 10,
		}).DialContext,
		TLSHandshakeTimeout: time.Second * 8,
		TLSClientConfig:     &tls.Config{InsecureSkipVerify: true},
	}

	netClient = &http.Client{
		Timeout:   time.Second * 10,
		Transport: netTransport,
	}
)

type FileInfo struct {
	Pos       int    `json:"pos"`
	Url       string `json:"url"`
	Size      int64  `json:"size"`
	Etag      string `json:"etag"`
	Hash      int64  `json:"hash"`
	EtagWorks bool   `json:"etagWorks"`
}

func Check(ctx context.Context) error {

	bucketName, err := GetBcvBucket()
	if err != nil {
		return err
	}

	s3Client, err := aws_h.GetS3Client(ctx)
	if err != nil {
		return err
	}

	links, err := AllFileLinks()

	if err != nil {
		return err
	}

	for pos, link := range links {

		fileName := link[strings.LastIndex(link, "/")+1:]
		objectKey := fmt.Sprintf("rates/bcv=%d=%s", pos, fileName)

		headObj, err := s3Client.HeadObject(ctx, &s3.HeadObjectInput{
			Bucket: aws.String(bucketName),
			Key:    aws.String(objectKey),
		})

		if err != nil {
			//err.Error().contains("The specified key does not exist")
			is404 := strings.Contains(err.Error(), "response error StatusCode: 404")

			if !is404 {
				return err
			}

		} else {

			oldEtag := headObj.Metadata["etag"]
			oldLastModified := headObj.Metadata["lastmodified"]
			if oldEtag != "" && oldLastModified != "" {
				//log.Printf("old metadata: %s %s", oldEtag, oldLastModified)

				req, err := http.NewRequest("HEAD", link, nil)
				if err != nil {
					return err
				}
				req.Header.Add("If-None-Match", oldEtag)
				res, err := netClient.Do(req)
				if err != nil {
					return err
				}

				if res.StatusCode == 304 {
					//log.Printf("etag matches, skipping")
					continue
				}

				err = res.Body.Close()
				if err != nil {
					return err
				}
			}

			//bs, _ := json.Marshal(headObj.Metadata)
			//log.Printf("Metadata: %s", string(bs))

		}

		res, err := netClient.Get(link)
		//log.Errorf("Downloaded: %s %v", processor.Filepath, wgErr)
		if err != nil {
			return err
		}

		//hash, err := FileHash(res.Body)
		//if err != nil {
		//	return err
		//}

		etag := res.Header.Get("ETag")

		metadata := make(map[string]string)
		metadata["etag"] = etag
		metadata["lastmodified"] = res.Header.Get("Last-Modified")
		metadata["url"] = link

		if headObj == nil || headObj.Metadata[MetadataProcessedKey] == "" {
			metadata[MetadataProcessedKey] = "false"
		}

		_, err = s3Client.PutObject(ctx, &s3.PutObjectInput{
			Bucket:            aws.String(bucketName),
			Key:               aws.String(objectKey),
			Body:              res.Body,
			ChecksumAlgorithm: types.ChecksumAlgorithmCrc64nvme,
			//ChecksumCRC32:             nil,
			//ChecksumCRC32C:            nil,
			//ChecksumSHA1:              nil,
			//ChecksumSHA256:            nil,
			ContentLength: &res.ContentLength,
			//ContentType:                 res.ty,
			Metadata: metadata,
		})

		if err != nil {
			return err
		}

		err = res.Body.Close()
		if err != nil {
			return err
		}
	}

	return nil
}

func AllFileLinks() ([]string, error) {

	bcvUrl := "https://www.bcv.org.ve"
	historicFilesUrl := bcvUrl + "/estadisticas/tipo-cambio-de-referencia-smc"

	var links []string
	var pagelinks []string
	err := historicLinks(&links, historicFilesUrl)
	pagelinks = append(pagelinks, historicFilesUrl)

	if err != nil {
		return nil, err
	}

	checkLinks := func() (bool, error) {
		execute := false
		for _, link := range links {
			if !strings.HasSuffix(link, ".xls") {
				nextUrl := bcvUrl + link
				if !slices.Contains(pagelinks, nextUrl) {
					err := historicLinks(&links, nextUrl)
					execute = true
					pagelinks = append(pagelinks, nextUrl)
					if err != nil {
						return execute, err
					}
				}
			}
		}

		return execute, nil
	}

	while := true
	counter := 0
	for while {
		counter++
		while, err = checkLinks()
		if err != nil {
			return nil, err
		}
	}

	links = slices.DeleteFunc(links, func(link string) bool {
		return !strings.HasSuffix(link, ".xls")
	})
	slices.Reverse(links)

	return links, nil
}

func historicLinks(links *[]string, url string) error {

	res, err := netClient.Get(url)

	if err != nil {
		return err
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Println("Error closing response body:", err)
			return
		}
	}(res.Body)

	if res.StatusCode != 200 {
		return fmt.Errorf("error bcv res: %d", res.StatusCode)
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return err
	}

	section := doc.Find("#block-system-main")

	if section == nil {
		log.Printf("#block-system-main Section not found")
		return fmt.Errorf("error getting section")
	}

	sel := section.Find("a")
	for i := range sel.Nodes {
		single := sel.Eq(i)
		href, b := single.Attr("href")
		if b {
			if !slices.Contains(*links, href) {
				*links = append(*links, href)
			}
		}
	}

	return nil
}
