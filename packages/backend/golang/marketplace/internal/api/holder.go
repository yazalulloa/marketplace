package api

import (
	"github.com/gorilla/mux"
	"log"
	"marketplace/internal/util"
	"net/http"
	"sync"
)

type HttpMethod string

const (
	GET     HttpMethod = "GET"
	POST    HttpMethod = "POST"
	PUT     HttpMethod = "PUT"
	DELETE  HttpMethod = "DELETE"
	PATCH   HttpMethod = "PATCH"
	OPTIONS HttpMethod = "OPTIONS"
)

func (receiver HttpMethod) Name() string {
	return string(receiver)
}

func NewRouterHolder(router *mux.Router) *RouterHolder {
	return &RouterHolder{router: router}
}

type RouterHolder struct {
	router *mux.Router
}

func (holder *RouterHolder) AddRoute(params RouteParams) {
	holder.router.HandleFunc(params.Path, params.routeHandler()).Methods(params.Method.Name())
}

func processApiChecks(providers []ApiCheckProvider) []ApiChecks {
	checks := make([]ApiChecks, 0)
	//perms := make([]PERM, 0)
	//
	//for _, provider := range providers {
	//	permProvider, ok := provider.(PermApiCheckProvider)
	//	if ok {
	//		if len(permProvider.Perms) > 0 {
	//			perms = append(perms, permProvider.Perms...)
	//		}
	//		continue
	//	}
	//
	//	check := provider.ApiCheck()
	//	if check != nil {
	//		checks = append(checks, check)
	//	}
	//}
	//
	//if len(perms) > 0 {
	//	checks = append(checks, apiCheckPerms(perms...))
	//}

	return checks

}

func (holder *RouterHolder) GET(path string, handler func(http.ResponseWriter, *http.Request),
	providers ...ApiCheckProvider) {

	holder.AddRoute(RouteParams{
		Method:    GET,
		Path:      path,
		Handler:   handler,
		ApiChecks: processApiChecks(providers),
	})
}

func (holder *RouterHolder) POST(path string, handler func(http.ResponseWriter, *http.Request),
	providers ...ApiCheckProvider) {

	holder.AddRoute(RouteParams{
		Method:    POST,
		Path:      path,
		Handler:   handler,
		ApiChecks: processApiChecks(providers),
	})
}

func (holder *RouterHolder) PUT(path string, handler func(http.ResponseWriter, *http.Request),
	providers ...ApiCheckProvider) {

	holder.AddRoute(RouteParams{
		Method:    PUT,
		Path:      path,
		Handler:   handler,
		ApiChecks: processApiChecks(providers),
	})
}

func (holder *RouterHolder) DELETE(path string, handler func(http.ResponseWriter, *http.Request),
	providers ...ApiCheckProvider) {

	holder.AddRoute(RouteParams{
		Method:    DELETE,
		Path:      path,
		Handler:   handler,
		ApiChecks: processApiChecks(providers),
	})
}

type RouteParams struct {
	Method    HttpMethod
	Path      string
	Handler   func(http.ResponseWriter, *http.Request)
	ApiChecks []ApiChecks
}

func (rec RouteParams) routeHandler() func(http.ResponseWriter,
	*http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		if rec.ApiChecks != nil {

			checks := len(rec.ApiChecks)

			if checks > 0 {
				if checks == 1 {
					err := rec.ApiChecks[0](r)
					if err != nil {
						log.Printf("Error in API check: %s", err)
						http.Error(w, "Unauthorized", http.StatusUnauthorized)
						return
					}
				} else {
					var wg sync.WaitGroup
					wg.Add(checks)
					errorChan := make(chan error, checks)

					for _, check := range rec.ApiChecks {
						go func(check ApiChecks) {
							defer wg.Done()
							err := check(r)
							if err != nil {
								errorChan <- err
							}
						}(check)
					}

					wg.Wait()
					close(errorChan)

					err := util.HasErrors(errorChan)
					if err != nil {
						log.Printf("Error in API checks: %s", err)
						http.Error(w, "Unauthorized", http.StatusUnauthorized)
						return
					}
				}

			}

		}

		//log.Printf("Middleware took %d ms", time.Now().UnixMilli()-timestamp)
		rec.Handler(w, r)
	}
}

type ApiCheckProvider interface {
	ApiCheck() ApiChecks
}
type ApiChecks func(r *http.Request) error
