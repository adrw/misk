package misk.web.actions

import misk.config.ConfigAdminAction
import misk.testing.MiskTest
import misk.testing.MiskTestModule
import org.junit.jupiter.api.Test
import javax.inject.Inject

@MiskTest(startService = true)
class ConfigAdminActionTest {
  @MiskTestModule
  val module = TestAdminDashboardActionModule()

  @Inject lateinit var configAdminAction: ConfigAdminAction

  @Test fun configAdminAction() {
    val response = configAdminAction.getAll()
    println(response)


  }

}