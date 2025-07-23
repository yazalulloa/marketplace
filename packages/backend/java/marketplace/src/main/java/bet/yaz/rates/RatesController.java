package bet.yaz.rates;

import bet.yaz.core.aws.AwsConfig;
import bet.yaz.rates.BcvRateService.ParseRatesEvent;
import io.quarkiverse.amazon.s3.runtime.S3Crt;
import io.quarkiverse.renarde.htmx.HxController;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Event;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jboss.resteasy.reactive.RestQuery;
import software.amazon.awssdk.services.s3.S3AsyncClient;

@Slf4j
@ApplicationScoped
@RequiredArgsConstructor
@Path("rates")
public class RatesController extends HxController {

  @Inject
  @S3Crt
  S3AsyncClient s3;

  @Inject
  AwsConfig awsConfig;

  private final Event<BcvRateService.ParseRatesEvent> parseRatesEvent;

  @GET
  public String getRates() {
    // This is a placeholder implementation.
    // In a real application, you would fetch rates from a database or an external service.
    return "List of rates " + awsConfig.bcvBucketName() + s3.toString();
  }

  @GET
  @Path("bcv/process-file")
  public String processBcvFile(
      @RestQuery("bucket") @NotBlank String bucket,
      @RestQuery("key") @NotBlank String key) {

    parseRatesEvent.fireAsync(new ParseRatesEvent(bucket, key));
    return "Processing";
  }

}
