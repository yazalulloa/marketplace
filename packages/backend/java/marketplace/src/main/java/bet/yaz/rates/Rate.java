package bet.yaz.rates;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import lombok.Builder;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@Builder
public record Rate(
    long id,
    String fromCurrency,
    String toCurrency,
    double rate,
    String source,
    LocalDate dateOfRate,
    ZonedDateTime dateOfFile,
    ZonedDateTime createdAt,
    String etag,
    String lastModified
) {

}
