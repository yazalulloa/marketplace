package bet.yaz.rates;

import bet.yaz.core.util.DateUtil;
import bet.yaz.core.util.MutinyUtil;
import bet.yaz.core.util.PoiUtil;
import io.quarkiverse.amazon.s3.runtime.S3Crt;
import io.reactivex.rxjava3.core.Single;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.ObservesAsync;
import jakarta.inject.Inject;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.hibernate.reactive.mutiny.Mutiny;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.services.s3.S3AsyncClient;

@Slf4j
@ApplicationScoped
@RequiredArgsConstructor
public class BcvRateService {

  private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a");
  private static final DateTimeFormatter LOCAL_DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

  private final Mutiny.SessionFactory sf;


  @Inject
  @S3Crt
  S3AsyncClient s3;

  public record ParseRatesEvent(
      String bucketName,
      String key
  ) {

  }

  public void parseRates(@ObservesAsync ParseRatesEvent event) {
    log.info("Processing BCV file: {} {}", event.bucketName(), event.key());

    parseFile(event.bucketName(), event.key())
        .subscribe()
        .with(
            v -> log.info("Successfully processed BCV file: {} {}", event.bucketName(), event.key()),
            t -> log.error("Error processing BCV file: {} {}", event.bucketName(), event.key(), t));
  }


  public Uni<Void> parseFile(String bucketName, String key) {

    final var tmp = Paths.get("tmp", UUID.randomUUID().toString());

    final var single = Single.fromCallable(() ->
            s3.getObject(builder -> builder.bucket(bucketName).key(key),
                AsyncResponseTransformer.toFile(tmp)))
        .flatMap(Single::fromFuture)
        .map(res -> {

          final var etag = res.eTag();
          final var lastModified = res.lastModified().toEpochMilli();

          final var rates = new ArrayList<Rate>();

          try (final var workbook = new HSSFWorkbook(new FileInputStream(tmp.toFile()))) {
            log.debug("Reading workbook {} {}", tmp, workbook.getNumberOfSheets());

            for (Sheet sheet : workbook) {
              final var sheetName = sheet.getSheetName();
              log.debug("Sheet name: {}", sheetName);

              final var date = PoiUtil.cellToString(sheet.getRow(0).getCell(6));

              final var createdAt = (date.endsWith("M") ? LocalDateTime.from(DATE_TIME_FORMATTER.parse(date))
                  : LocalDateTime.parse(date))
                  .atZone(DateUtil.VE_ZONE);

              final var dateStr = sheet.getRow(4).getCell(3).getStringCellValue();
              final var dateOfRateStr = dateStr.substring(dateStr.indexOf(":") + 1).trim();
              final var dateOfRate = LocalDate.parse(dateOfRateStr, LOCAL_DATE_FORMATTER);

              for (var row : sheet) {
                if (row.getRowNum() <= 10) {
                  continue;
                }

                final var currency = row.getCell(1).getStringCellValue();
                final var rate = row.getCell(6).getNumericCellValue();

                rates.add(Rate.builder()
                    .fromCurrency(currency)
                    .toCurrency("VED")
                    .rate(rate)
                    .dateOfRate(dateOfRate)
                    .source("BCV")
                    .createdAt(createdAt.withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime())
                    .etag(etag)
                    .lastModified(lastModified)
                    .build());
              }

            }
          }

          return rates;

        });

    return MutinyUtil.toUni(single)
        .flatMap(this::persist);
  }

  public Uni<Void> persist(List<Rate> rates) {
    if (rates.isEmpty()) {
      return Uni.createFrom().voidItem();
    }

    return sf.withTransaction(session -> session.persistAll(rates));
  }
}
