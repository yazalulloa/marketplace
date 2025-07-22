package bet.yaz.core.aws;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.Produces;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ConfigProducers {

  @Produces
  @ApplicationScoped
  AwsConfig produceAwsConfig(ObjectMapper mapper) {

    String bcvBucketName;

    try {
      final var json = mapper.readTree(System.getenv("SST_RESOURCE_BcvBucket"));
      bcvBucketName = json.get("name").asText();
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to parse SST_RESOURCE_BcvBucket", e);
    }

    return AwsConfig.builder()
        .bcvBucketName(bcvBucketName)
        .build();
  }


//  S3AsyncClient bcvBucketClient() {
//    final var json = System.getenv("SST_RESOURCE_BcvBucket");
//    if (json == null || json.isBlank()) {
//      throw new RuntimeException("SST_RESOURCE_BcvBucket environment variable is empty");
//    }
//
//    final var builder = new DefaultS3CrtClientBuilder();
//
//    return null;
//  }


}
