package bet.yaz.core.util;

import io.reactivex.rxjava3.core.Completable;
import io.reactivex.rxjava3.core.Maybe;
import io.reactivex.rxjava3.core.Single;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.uni.UniRx3Converters;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;
import java.util.function.LongConsumer;

public class MutinyUtil {

  private MutinyUtil() {

  }

  public static <T> Uni<T> toUni(Single<T> single) {
    return UniRx3Converters.<T>fromSingle().from(single);
  }

  public static <T> Uni<T> toUni(Maybe<T> maybe) {
    return UniRx3Converters.<T>fromMaybe().from(maybe);
  }

  public static <T> Maybe<T> toMaybe(Uni<T> uni) {
    return UniRx3Converters.<T>toMaybe().apply(uni);
  }

  public static <T> Single<Optional<T>> toSingle(Uni<T> uni) {
    return UniRx3Converters.<T>toSingle().apply(uni);
  }

  public static <T> Single<T> single(Uni<T> uni) {
    return toMaybe(uni).toSingle();
  }

  public static Uni<Void> toUni(Completable completable) {
    return UniRx3Converters.fromCompletable().from(completable);
  }

  public static Function<Integer, Uni<? extends Integer>> cacheCall(Uni<?> call) {
    return i -> {

      if (i > 0) {
        return call.replaceWith(i);
      }

      return Uni.createFrom().item(i);
    };
  }

  public static <T> Uni<T> measure(Uni<T> uni, LongConsumer consumer) {

    final var atomicLong = new AtomicLong(0);
    return uni
        .onSubscription().invoke(() -> {
          atomicLong.set(System.currentTimeMillis());
        })
        .onTermination().invoke(() -> {
          final var duration = System.currentTimeMillis() - atomicLong.get();
          consumer.accept(duration);
        });
  }
}
