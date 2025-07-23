package bet.yaz.core.bean;

import bet.yaz.core.util.RxUtil;
import io.quarkus.runtime.Startup;
import io.vertx.mutiny.core.Vertx;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ApplicationScoped
@RequiredArgsConstructor
public class StartupBean {

  private final Vertx vertx;

  @Startup(value = 0)
  void init() {
    RxUtil.configureSchedulers(vertx.getDelegate());

    final var map = System.getenv();
    map.forEach((key, value) -> {

      if (key.startsWith("SST") || key.startsWith("AWS") || key.startsWith("APP")) {
        log.info(key + ": " + value);
      }
    });

  }
}
