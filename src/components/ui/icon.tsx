import React, { FC, CSSProperties } from 'react'
import { Icon as RPIcon } from '@reapit/elements'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './icon.module.scss'

import { IconNames as ReapitIconNames } from '@reapit/elements'
import { IconName as FontAwesomeIconNames} from '@fortawesome/fontawesome-common-types'

type Props = {
  asset?: 'reapit' | 'fontawesome'
  icon: ReapitIconNames | FontAwesomeIconNames
  className?: string
  style?: CSSProperties
}

export const Icon : FC<Props> = ({ asset = 'reapit', icon, className, style }) => {
  if (asset === 'reapit') {
    return ( <RPIcon icon={icon as ReapitIconNames} style={style} /> )
  }

  if (asset === 'fontawesome') {
    return <FontAwesomeIcon icon={icon as FontAwesomeIconNames} style={style} 
      className={`${styles.primaryColor} ${className || ''}`} />
  }

  return ( <RPIcon icon={icon as ReapitIconNames} /> )
}

export default Icon
