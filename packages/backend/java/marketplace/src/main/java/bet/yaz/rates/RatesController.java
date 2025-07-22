package bet.yaz.rates;

import bet.yaz.core.aws.AwsConfig;
import io.quarkiverse.amazon.s3.runtime.S3Crt;
import io.quarkiverse.renarde.htmx.HxController;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import software.amazon.awssdk.services.s3.S3AsyncClient;

@Path("rates")
public class RatesController extends HxController {

  @Inject
  @S3Crt
  S3AsyncClient s3;

  @Inject
  AwsConfig awsConfig;

  @GET
  public String getRates() {
    // This is a placeholder implementation.
    // In a real application, you would fetch rates from a database or an external service.
    return "List of rates " + awsConfig.bcvBucketName() + s3.toString();
  }

}
