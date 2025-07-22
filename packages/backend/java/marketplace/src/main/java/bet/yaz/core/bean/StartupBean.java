package bet.yaz.core.bean;

import bet.yaz.core.util.RxUtil;
import io.quarkus.runtime.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ApplicationScoped
@RequiredArgsConstructor
public class StartupBean {

  @Startup(value = 0)
  void init(io.vertx.mutiny.core.Vertx vertx) {
    RxUtil.configureSchedulers(vertx.getDelegate());


    final var map = System.getenv();
    map.forEach((key, value) -> {

      if (key.startsWith("SST") || key.startsWith("AWS")) {
        log.info(key + ": " + value);
      }
    });

  }
}
