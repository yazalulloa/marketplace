package bet.yaz.bcv;

import lombok.Builder;
import software.amazon.awssdk.services.s3.model.S3Object;

@Builder
public record Item(
    S3FileInfo item,
    String key,
    String cardId
) {

}
