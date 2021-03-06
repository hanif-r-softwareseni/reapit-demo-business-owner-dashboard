import React, { FC } from 'react'
import Router from './router'
import ErrorBoundary from '../components/hocs/error-boundary'
import { MediaStateProvider, NavStateProvider, SnackProvider } from '@reapit/elements'
import '@reapit/elements/dist/index.css'
import './icon'
import './app.scss'
import './__styles__/app'

const App: FC = () => (
  <ErrorBoundary>
    <NavStateProvider>
      <MediaStateProvider>
        <SnackProvider>
          <Router />
        </SnackProvider>
      </MediaStateProvider>
    </NavStateProvider>
  </ErrorBoundary>
)

export default App
