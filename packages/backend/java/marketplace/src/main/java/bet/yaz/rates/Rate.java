package bet.yaz.rates;

import com.fasterxml.jackson.databind.PropertyNamingStrategies.SnakeCaseStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@JsonNaming(SnakeCaseStrategy.class)
@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rate {

  @Id
  private long id;
  private String fromCurrency;
  private String toCurrency;
  private double rate;
  private String source;
  private LocalDate dateOfRate;
  private ZonedDateTime dateOfFile;
  private LocalDateTime createdAt;
  private String etag;
  private long lastModified;

}
