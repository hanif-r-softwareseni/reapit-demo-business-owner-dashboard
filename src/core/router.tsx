import * as React from 'react'
import { Route, Router as BrowserRouter, Switch, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Routes } from '../constants/routes'
import PrivateRouteWrapper from './private-route-wrapper'

export const history = createBrowserHistory()

export const catchChunkError = (
  fn: Function,
  retriesLeft = 3,
  interval = 500,
): Promise<{ default: React.ComponentType<any> }> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error: Error) => {
        // Ignore chunk cache error and retry to fetch, if cannot reload browser
        console.info(error)
        setTimeout(() => {
          if (retriesLeft === 1) {
            window.location.reload()
            return
          }
          catchChunkError(fn, retriesLeft - 1, interval).then(resolve, reject)
        }, interval)
      })
  })
}

const LoginPage = React.lazy(() => catchChunkError(() => import('../components/pages/login-page')))
const HomePage = React.lazy(() => catchChunkError(() => import('../components/pages/home-page')))
const ExamplesPage = React.lazy(() => catchChunkError(() => import('../components/pages/examples-page')))
const PropertyListPage = React.lazy(() => catchChunkError(() => import('../components/pages/properties-page')))
const PropertyDetailsPage = React.lazy(() => catchChunkError(() => import('../components/pages/property-details-page')))
const MessagesPage = React.lazy(() => catchChunkError(() => import('../components/pages/messages-page')))
const FilesPage = React.lazy(() => catchChunkError(() => import('../components/pages/files-page')))
const UserProfilePage = React.lazy(() => catchChunkError(() => import('components/pages/user-profile-page')))
const AgentsPage = React.lazy(() => catchChunkError(() => import('components/pages/agents-page')))

const Router = () => (
  <BrowserRouter history={history}>
    <React.Suspense fallback={null}>
      <Switch>
        <Route path={Routes.LOGIN} component={LoginPage} />
        <PrivateRouteWrapper>
          <Switch>
            <Route path={Routes.HOME} exact component={HomePage} />
            <Route path={Routes.FORM} exact component={ExamplesPage} />
            <Route path={Routes.TABLE} exact component={ExamplesPage} />
            <Route path={Routes.LIST} exact component={ExamplesPage} />
            <Route path={Routes.PROPERTIES} exact component={PropertyListPage} />
            <Route path={`${Routes.PROPERTIES}/:id`} exact component={PropertyDetailsPage} />
            <Route path={`${Routes.MESSAGES}`} exact component={MessagesPage} />
            <Route path={`${Routes.FILES}`} exact component={FilesPage} />
            <Route path={`${Routes.USER_PROFILE}`} exact component={UserProfilePage} />
            <Route path={`${Routes.AGENTS}`} exact component={AgentsPage} />
          </Switch>
        </PrivateRouteWrapper>
        <Redirect to={Routes.LOGIN} />
      </Switch>
    </React.Suspense>
  </BrowserRouter>
)

export default Router
