package categories

import (
	"marketplace/internal/api"
	"net/http"
)

func Routes(holder *api.RouterHolder) {
	holder.GET("/api/g/categories", categoriesGet)
}

func categoriesGet(w http.ResponseWriter, r *http.Request) {

	array := []Category{
		{
			Name:        "HOGAR",
			Description: "Todo lo que necesitas para tu hogar",
			Icon:        "fa-solid fa-house",
			Image:       "https://example.com/images/home.jpg",
		},
		{
			Name:        "ELECTRODOMÉSTICOS",
			Description: "Electrodomésticos y tecnología",
			Icon:        "fa-solid fa-tv",
			Image:       "https://example.com/images/appliances.jpg",
		},
		{
			Name:        "TV - AUDIO",
			Description: "Televisores y sistemas de audio",
			Icon:        "fa-solid fa-tv",
			Image:       "https://example.com/images/tv-audio.jpg",
		},
		{
			Name:        "TECNOLOGÍA",
			Description: "Dispositivos tecnológicos y accesorios",
			Icon:        "fa-solid fa-laptop",
			Image:       "https://example.com/images/technology.jpg",
		},
	}

	w.Header().Add("Content-Type", "text/html; charset=utf-8")
	err := Cards(array).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
