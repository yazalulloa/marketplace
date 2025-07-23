package bet.yaz.core.aws;

import bet.yaz.core.util.DateUtil;
import bet.yaz.core.util.PoiUtil;
import bet.yaz.rates.Rate;
import io.quarkiverse.amazon.s3.runtime.S3Crt;
import io.reactivex.rxjava3.core.Single;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.services.s3.S3AsyncClient;

@Slf4j
@ApplicationScoped
public class S3Wrapper {

  private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a");
  private static final DateTimeFormatter LOCAL_DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

  @Inject
  @S3Crt
  S3AsyncClient s3;


  public Single<File> downloadFile(String bucketName, String key) {

    final var tmp = Paths.get("tmp", UUID.randomUUID().toString());

    Single.fromCallable(() ->
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

    return null;
  }
}
