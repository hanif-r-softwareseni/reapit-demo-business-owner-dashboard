import React, { FC } from 'react'
import { useReapitConnect } from '@reapit/connect-session'
import { reapitConnectBrowserSession } from '../../../core/connect-session'
import { NavResponsive, NavResponsiveOption } from '@reapit/elements'
import { Routes } from '../../../constants/routes'
import { history } from '../../../core/router'
import { navigate } from '../../../utils/navigation'

export const getDefaultNavIndex = (pathname: string) => {
  switch (pathname) {
    case Routes.HOME:
      return 1
    case Routes.PROPERTIES:
      return 2
    case Routes.TABLE:
    case Routes.LIST:
    case Routes.FORM:
      return 3
    default:
      return 0
  }
}

export const Nav: FC = () => {
  const { connectLogoutRedirect, connectIsDesktop } = useReapitConnect(reapitConnectBrowserSession)
  const navOptions: NavResponsiveOption[] = [
    {
      itemIndex: 0,
    },
    {
      itemIndex: 1,
      text: 'Home',
      iconId: 'defaultMenu',
      callback: navigate(history, Routes.HOME),
    },
    {
      itemIndex: 2,
      text: 'Properties',
      iconId: 'dataMenu',
      callback: navigate(history, Routes.PROPERTIES),
    },
    {
      itemIndex: 4,
      text: 'Messages',
      iconId: 'appsMenu',
      callback: navigate(history, Routes.MESSAGES),
    },
    {
      itemIndex: 5,
      text: 'Files',
      iconId: 'docsMenu',
      callback: navigate(history, Routes.FILES),
    },
  ]

  if (!connectIsDesktop) {
    navOptions.push(
      {
        itemIndex: 5,
        callback: connectLogoutRedirect,
        isSecondary: true,
        iconId: 'logoutMenu',
        text: 'Logout',
      },
    )
  }

  return <NavResponsive options={navOptions} defaultNavIndex={getDefaultNavIndex(window.location.pathname)} />
}

export default Nav
