import {
  Navbar,
  response,
  ResponsiveContainer,
  OfflineComponent,
  TabLoaderComponent
} from "@misk/core"
import * as React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { IDispatchProps, IState, rootDispatcher, rootSelectors } from "../ducks"

interface IContainerProps extends IState, IDispatchProps {}

const DashboardTabContainer = styled(ResponsiveContainer)`
  position: relative;
  top: 110px;
  padding-left: 5px;
`

class AdminDashboardContainer extends React.Component<IContainerProps> {
  async componentDidMount() {
    this.props.get("/api/admindashboardtabs", "admindashboardtabs")
    this.props.get("/api/service/metadata", "serviceMetadata")
  }

  render() {
    const { simpleNetwork } = this.props
    // const { adminDashboardTabs, serviceMetadata, error } = this.props.loader
    // let unavailableEndpointUrls = ""
    // if (!adminDashboardTabs) {
    //   unavailableEndpointUrls += tabsUrl + " "
    // }
    // if (!serviceMetadata) {
    //   unavailableEndpointUrls += serviceUrl + " "
    // }

    if (
      response(simpleNetwork, "admindashboardtabs").data &&
      response(simpleNetwork, "serviceMetadata").data
    ) {
      return (
        <span>
          <Navbar
            environment={
              response(simpleNetwork, "serviceMetadata").data.environment
            }
            links={response(simpleNetwork, "admindashboardtabs").data}
            homeName={response(simpleNetwork, "serviceMetadata").data.app_name}
            homeUrl={
              response(simpleNetwork, "serviceMetadata").data
                .admin_dashboard_url
            }
            navbar_items={
              response(simpleNetwork, "serviceMetadata").data.navbar_items
            }
            status={
              response(simpleNetwork, "serviceMetadata").data.navbar_status
            }
          />
          <DashboardTabContainer>
            <TabLoaderComponent
              tabs={response(simpleNetwork, "admindashboardtabs").data}
            />
          </DashboardTabContainer>
        </span>
      )
    } else {
      return (
        <span>
          <Navbar />
          <DashboardTabContainer>
            <OfflineComponent title={"Error Loading Multibound Admin Tabs"} />
          </DashboardTabContainer>
        </span>
      )
    }
  }
}

const mapStateToProps = (state: IState) => rootSelectors(state)

const mapDispatchToProps = {
  ...rootDispatcher
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminDashboardContainer)
