import { css } from '@linaria/core'
import { mainHeaderHeight } from 'components/ui/nav/__styles__/main-header'

export const globals = css`
  :global() {
    .el-page-container {
      height: calc(100vh - (${mainHeaderHeight} + 1px));
    }
  }
`