package main

import (
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"log"
	"marketplace/internal/api"
	"marketplace/internal/categories"
	"marketplace/internal/compress"
	"net/http"
	"os"
	"time"
)

func main() {
	//log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.SetFlags(log.LstdFlags | log.Llongfile)
	lambda.StartWithOptions(httpadapter.NewV2(router()).ProxyWithContext)
}

func router() http.Handler {
	newRouter := mux.NewRouter()

	//newRouter.Use(mainApiMetricMiddleware)
	//newRouter.Use(loggingMiddleware)
	//newRouter.Use(authenticationMiddleware)
	newRouter.Use(compress.Middleware)

	newRouter.HandleFunc("/api/logged_in", func(w http.ResponseWriter, r *http.Request) {

		log.Printf("Logged in: %s", r.Header.Get("Authorization"))
		w.WriteHeader(http.StatusOK)
	}).Methods("GET")

	newRouter.HandleFunc("/api/logout", func(w http.ResponseWriter, r *http.Request) {

		accessTokenCookie, err := r.Cookie("access_token")
		if err != nil {
			http.Error(w, "Failed to get access token", http.StatusInternalServerError)
			return
		}

		accessTokenCookie.HttpOnly = true
		accessTokenCookie.Secure = true
		accessTokenCookie.SameSite = http.SameSiteStrictMode
		accessTokenCookie.Expires = time.Now().Add(-48 * time.Hour)
		accessTokenCookie.Path = "/"
		http.SetCookie(w, accessTokenCookie)
		url := fmt.Sprintf("%s://%s", r.URL.Scheme, r.URL.Host)
		// TODO handle non htmx requests
		w.Header().Add("HX-Redirect", url)
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("Logout"))
		//log.Printf("Logging out")

		//
		//http.Redirect(w, r, url, http.StatusTemporaryRedirect)

	}).Methods("GET")

	holder := api.NewRouterHolder(newRouter)

	categories.Routes(holder)
	//rates.Routes(holder)
	//bcv_bucket.Routes(holder)
	//buildings.Routes(holder)
	//reserveFundsApi.Routes(holder)
	//apartments.Routes(holder)
	//extraCharges.Routes(holder)
	//receipts.Routes(holder)
	//expenses_api.Routes(holder)
	//debts.Routes(holder)
	//users.Routes(holder)
	//permissions.Routes(holder)
	//roles.Routes(holder)
	//isr.Routes(holder)
	//telegram_api.Routes(holder)

	//return handlers.CombinedLoggingHandler(os.Stdout, newRouter)
	return handlers.CustomLoggingHandler(os.Stdout, newRouter, api.WriteCombinedLog)
	//return handlers.CompressHandler(newRouter)

	//newRouter.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	//
	//	_, err := w.Write([]byte("Req: " + " -> " + r.URL.Path + " " + time.Now().String()))
	//	if err != nil {
	//		log.Printf("Error writing response: %v", err)
	//	}
	//})

	//if util.IsDevMode() {
	//	return handlers.CompressHandler(newRouter)
	//}
	//
	//CSRF := csrf.Protect([]byte("32-byte-long-auth-key"),
	//	csrf.TrustedOrigins([]string{
	//		"localhost:5173",
	//	}),
	//	csrf.ErrorHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	//		err := csrf.FailureReason(r)
	//
	//		log.Printf("CSRF failure: %v", err)
	//		http.Error(w, fmt.Sprintf("%s - %s",
	//			http.StatusText(http.StatusForbidden), err),
	//			http.StatusForbidden)
	//	})),
	//)
	//
	//return CSRF(newRouter)
}
