package bet.yaz.core.util;

import io.reactivex.rxjava3.plugins.RxJavaPlugins;
import io.vertx.core.Vertx;
import io.vertx.rxjava3.RxHelper;

public class RxUtil {

  public static void configureSchedulers(Vertx vertx) {
    RxJavaPlugins.setComputationSchedulerHandler(s -> RxHelper.scheduler(vertx));
    RxJavaPlugins.setIoSchedulerHandler(s -> RxHelper.blockingScheduler(vertx));
    RxJavaPlugins.setNewThreadSchedulerHandler(s -> RxHelper.scheduler(vertx));
  }

}
