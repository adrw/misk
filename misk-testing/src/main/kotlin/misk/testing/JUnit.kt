package misk.testing

import kotlin.test.assertFailsWith

/** Confirms that `block` throws `T`, and returns what was thrown. */
inline fun <reified T : Throwable> assertThrows(crossinline block: () -> Unit): T {
  return assertFailsWith<T> {
    block()
  }
//
//
//
//
//  var throwable: Throwable? = null
//  try {
//    block()
//  } catch (expected: Throwable) {
//    throwable = expected
//  }
//
//  when (throwable) {
//    is T -> return throwable
//    null -> throw AssertionError("expected ${T::class.simpleName} was not thrown")
//    else -> throw AssertionError(
//        "expected ${T::class.simpleName} but was ${throwable::class.simpleName}", throwable)
//  }
}
