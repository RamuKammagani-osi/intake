import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {getUserNameSelector} from 'selectors/userInfoSelectors'
import {fetch as fetchUserInfoAction} from 'actions/userInfoActions'
import {fetch as fetchSystemCodesAction} from 'actions/systemCodesActions'
import {checkStaffPermission} from 'actions/staffActions'
import {bindActionCreators} from 'redux'
import Footer from 'views/Footer'
import userNameFormatter from 'utils/userNameFormatter'
import {config} from 'common/config'
import {ScrollToTop} from 'common/app/ScrollToTop'
import {Page, CaresProvider, MenuItem, UncontrolledUserMenu} from '@cwds/components'

const RouterScrollToTop = withRouter(ScrollToTop)

export class App extends React.Component {
  componentDidMount() {
    const {fetchSystemCodesAction, checkStaffPermission, fetchUserInfoAction} = this.props.actions
    fetchUserInfoAction()
    fetchSystemCodesAction()
    checkStaffPermission('add_sensitive_people')
    checkStaffPermission('has_state_override')
  }

  render() {
    const logoutUrl = `${config().base_path.replace(/\/$/, '')}/logout`

    const UserMenu = (state) => {
      const name = this.props.fullName
      return (
        <UncontrolledUserMenu label={name}>
          <MenuItem className={'no-uppercase'} tag={'a'} href={logoutUrl}>
            Logout
          </MenuItem>
        </UncontrolledUserMenu>
      )
    }

    return (
      <RouterScrollToTop>
        <CaresProvider UserMenu={UserMenu}>
          <Page layout= 'dashboard'/>
          {this.props.children}
          <Footer />
        </CaresProvider>
      </RouterScrollToTop>
    )
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  fullName: PropTypes.string,
}
const mapStateToProps = (state) => ({
  fullName: userNameFormatter(getUserNameSelector(state)),
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators({fetchUserInfoAction, fetchSystemCodesAction, checkStaffPermission}, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
