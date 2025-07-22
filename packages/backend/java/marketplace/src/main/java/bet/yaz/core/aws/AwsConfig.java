package bet.yaz.core.aws;

import lombok.Builder;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(fluent = true)
@Builder
public final class AwsConfig {

  private final String bcvBucketName;

}
