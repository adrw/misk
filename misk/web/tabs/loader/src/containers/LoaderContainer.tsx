import { Card, Classes, NonIdealState } from "@blueprintjs/core"
import { IconNames } from "@blueprintjs/icons"
import { IMiskAdminTab } from "@misk/common"
import { ResponsiveContainer, TopbarComponent } from "@misk/components"
import { RouterState } from "connected-react-router"
import * as React from "react"
import { connect } from "react-redux"
import { Route } from "react-router"
import styled from "styled-components"
import { dispatchLoader } from "../actions"
import { MountingDivComponent, ScriptComponent } from "../components"
import { ILoaderState, IState } from "../reducers"

export interface ILoaderProps {
  loader: ILoaderState
  router: RouterState
  getTabs: (url: string) => any
  getComponent: (tab: IMiskAdminTab) => any
}

const TabContainer = styled(ResponsiveContainer)`
  position: relative;
  top: 100px;
  padding-left: 5px;
`

const adminTabsUrl = "/api/admintabs"

class LoaderContainer extends React.Component<ILoaderProps> {
  async componentDidMount() {
    this.props.getTabs(adminTabsUrl)
  }

  buildTabRouteMountingDiv(tab: IMiskAdminTab) {
    return(<Route path={`/_admin/${tab.slug}/`} render={() => <MountingDivComponent tab={tab}/>}/>)
  }

  render() {
    const { adminTabs } = this.props.loader
    if (adminTabs) {
      return (
        <div>
          <TopbarComponent homeName="URL Shortener" homeUrl="/_admin/" links={adminTabs} menuButtonShow={true}/>
          <TabContainer>
            {Object.entries(adminTabs).map(([key,tab]) => (<ScriptComponent key={key} tab={tab}/>))}
          </TabContainer>
        </div>
      )
    } else {
      return (
        <div>
          <TopbarComponent homeName="Misk" homeUrl="/_admin/" menuButtonShow={true}/>
          <TabContainer>
            <NonIdealState 
              icon={IconNames.OFFLINE}
              title="Error Loading Tabs" 
              description={`Unable to get list of tabs from server to begin dashbaord render. Server endpoint '${adminTabsUrl}' is unavailable.`}
            >
            <Card>
              <h5 className={Classes.SKELETON}>Your head is not an artifact!</h5>
              <p className={Classes.SKELETON}>Maybe we better talk out here; the observation lounge has turned into a swamp. Some days you get the bear, and some days the bear gets you.</p>
            </Card>
            </NonIdealState>
          </TabContainer>
        </div>
      )
    }
  }
}

const mapStateToProps = (state: IState) => ({
  loader: state.loader.toJS(),
  router: state.router
})

const mapDispatchToProps = {
  getComponent: dispatchLoader.getOneComponent,
  getTabs: dispatchLoader.getAllTabs,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderContainer)