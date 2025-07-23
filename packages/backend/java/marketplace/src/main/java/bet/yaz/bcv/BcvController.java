package bet.yaz.bcv;

import bet.yaz.core.aws.AwsConfig;
import bet.yaz.core.util.FileUtil;
import bet.yaz.core.util.MutinyUtil;
import io.quarkiverse.amazon.s3.runtime.S3Crt;
import io.quarkiverse.renarde.htmx.HxController;
import io.quarkus.qute.CheckedTemplate;
import io.quarkus.qute.TemplateInstance;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.Scheduler;
import io.reactivex.rxjava3.core.Single;
import io.reactivex.rxjava3.schedulers.Schedulers;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.jboss.resteasy.reactive.RestPath;
import software.amazon.awssdk.services.s3.S3AsyncClient;

@Slf4j
@Path(BcvController.PATH)
public class BcvController extends HxController {

  public static final String PATH = "/bcv";

  @Inject
  @S3Crt
  S3AsyncClient s3;

  @Inject
  AwsConfig awsConfig;


  @CheckedTemplate
  public static class Templates {

    public static native TemplateInstance list(List<Item> list);
  }

  @GET
  @Path("list")
  @Produces(MediaType.TEXT_HTML)
  public Uni<TemplateInstance> get() {

    final var single = Single.fromFuture(s3.listObjectsV2(builder -> {
          builder.bucket(awsConfig.bcvBucketName());
        }))
        .subscribeOn(Schedulers.io())
        .flatMap(response -> {

          return Observable.fromIterable(response.contents())
              .flatMapSingle(s3Object -> {

                return Single.fromFuture(s3.headObject(builder -> {
                      builder.bucket(awsConfig.bcvBucketName())
                          .key(s3Object.key());
                    }))
                    .map(obj -> {

                      final var metadata = obj.metadata();
                      final var url = metadata.get("url");
                      final var processed = Optional.ofNullable(metadata.get("processed"))
                          .map(Boolean::parseBoolean)
                          .orElse(false);

                      final var ratesParsed = Optional.ofNullable(metadata.get("ratesparsed"))
                          .map(Integer::parseInt)
                          .orElse(0);

                      final var lastProcessed = Optional.ofNullable(metadata.get("lastprocessed"))
                          .map(Long::parseLong)
                          .orElse(0L);

                      final var numOfSheets = Optional.ofNullable(metadata.get("numofsheets"))
                          .map(Integer::parseInt)
                          .orElse(0);

                      return Item.builder()

                          .key(s3Object.key())
                          .cardId("bcv-s3-obj-" + UUID.randomUUID())
                          .item(S3FileInfo.builder()
                              .name(s3Object.key())
                              .size(s3Object.size())
                              .sizeFormatted(FileUtil.byteCountToDisplaySize(s3Object.size()))
                              .etag(s3Object.eTag())
                              .lastModified(s3Object.lastModified().toEpochMilli())

                              .url(url)
                              .rates(ratesParsed)
                              .numOfSheets(numOfSheets)
                              .processed(processed)
                              .processedAt(lastProcessed)
                              .build())
                          .build();
                    });
              })
              .toList();
        })
        .map(Templates::list);

    return MutinyUtil.toUni(single);
  }

  @DELETE
  @Path("{str}")
  @Produces
  public Uni<Response> delete(@RestPath @NotBlank String str) {
    return Uni.createFrom().item(Response.noContent().build());
  }
}
