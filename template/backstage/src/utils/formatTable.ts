export function tableStyle(props?: any) {
  return {
    main: {
      header: () => {
        return {
          letterSpacing: '.4em',
          backgroundColor: '#ebf0f3',
          fontWeight: 500,
        }
      },
      row: () => {
        return {
          backgroundColor: '#ebf0f3',
          fontSize: '14px',
          height: '60px',
        }
      },
      tableRowClassName: ({ row, rowIndex }: { row: any, rowIndex: number }) => {
        if (row.id == 'total') {
          return 'row-bg--total'
        }
        if (props?.alertRow.includes(rowIndex)) {
          return 'row-bg-alert'
        }
      },
      tableColClassName: ({ row, column }: { row: any, column: any }) => {
        const hightLightText = 'name'
        const cellLinks = props?.cellLinks || []
        const redCols = props?.redCols || []
        if (column.property === hightLightText) {
          if (cellLinks.includes(column.property)) {
            return 'text-hd-primary cursor-pointer'
          } else {
            return 'text-hd-danger'
          }
        }
        if (redCols.includes(column.property)) {
          return 'text-hd-danger'
        }
        if (cellLinks.includes(column.property)) {
          return 'text-hd-primary cursor-pointer'
        }
        if (column.property === 'in_count') {
          return 'text-hd-success'
        }
        if (column.property === 'out_count') {
          return 'text-hd-danger'
        }
      },
    },
    expand: {
      header: () => {
        return {
          letterSpacing: '.4em',
          backgroundColor: '#E9F6FC',
          fontWeight: 500,
        }
      },
      row: () => {
        return {
          fontSize: '12px',
        }
      },
      tableRowClassName: ({ row, rowIndex }: { row: any, rowIndex: number }) => {
        if (props?.alertRow.includes(rowIndex)) {
          return 'row-bg-alert'
        }
        if (rowIndex % 2 !== 0) {
          return 'row-bg'
        }
      },
      tableColClassName: ({ row, column }: { row: any, column: any }) => {
        const hightLightText = 'name'
        const cellLinks = props?.cellLinks || []
        const redCols = props?.redCols || []
        if (column.property === hightLightText) {
          if (cellLinks.includes(column.property)) {
            return 'text-hd-primary cursor-pointer'
          } else {
            return 'text-hd-primary'
          }
        }
        if (redCols.includes(column.property)) {
          return 'text-hd-danger'
        }
        if (cellLinks.includes(column.property)) {
          return 'text-hd-primary cursor-pointer'
        }
        if (column.property === 'in_count') {
          return 'text-hd-success'
        }
        if (column.property === 'out_count') {
          return 'text-hd-danger'
        }
      },
    },
  }
}
