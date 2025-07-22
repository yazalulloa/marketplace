package bet.yaz.bcv;

import lombok.Builder;

@Builder
public record S3FileInfo(
    String name,
    long size,
    String sizeFormatted,
    String etag,
    long lastModified,
    String url,
    int rates,
    int numOfSheets,
    boolean processed,
    long processedAt
) {

}
