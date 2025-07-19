package bet.yaz.categories;

import io.quarkus.qute.CheckedTemplate;
import io.quarkus.qute.TemplateInstance;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("categories")
public class CategoriesController {

  private int counter = 0;

  private List<Categories> categoriesList() {

    return List.of(
        new Categories("Sports", "All about sports", "sports-icon.png", "sports-image.jpg"),
        new Categories("Technology", "Latest in tech", "tech-icon.png", "tech-image.jpg"),
        new Categories("Health", "Wellness and health tips", "health-icon.png", "health-image.jpg"),
        new Categories("Travel " + (++counter), "Explore the world", "travel-icon.png", "travel-image.jpg")
    );
  }


  @CheckedTemplate
  public static class Templates {

    public static native TemplateInstance list(List<Categories> list);
  }

  @GET
  @Produces(MediaType.TEXT_HTML)
  public TemplateInstance get() {
    return Templates.list(categoriesList());
  }


}
