import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'

export default function BasicTable(props) {
  const date = new Date(props.data.updatedAt)
  const theme = useTheme()
  const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }
  const formattedDate = date.toLocaleString('en-US', options)
  const date1 = new Date(props.data.createdAt)

  const options1 = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }
  const formattedDate1 = date1.toLocaleString('en-US', options1)
  function createData(name, data) {
    return { name, data }
  }

  const rows = [
    createData('Item Type:', props.data.itemType),
    createData('Source:', props.data?.journalName?.length !== 0 ? props.data?.journalName : 'N/A'),
    createData('Keywords:', props.data.keywords),
    createData('DOI:', props.data.doi ? props.data.doi : 'N/A'),
    createData('Language:', props.data.language),
    createData('Created At:', formattedDate1),
    createData('Last Modified:', formattedDate)
  ]

  return (
    <TableContainer component={Paper} sx={{ width: { xs: '100%', md: '70%' } }} variant='outlined'>
      <Table aria-label='simple table'>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell
                component='th'
                scope='row'
                sx={{
                  fontWeight: 'bold',
                  fontSize: '16px',

                  marginBottom: '10px',
                  backgroundColor: `${theme.palette.customColors.tableHeaderBg}`,
                  height: 'auto', // Adjust cell height to fit content
                  wordWrap: 'break-word', // Allow wrapping of long words
                  whiteSpace: 'pre-wrap' // Allow wrapping of long lines
                }}
                width='20%'
                variant='head'
              >
                {row.name}
              </TableCell>
              <TableCell
                align='left'
                sx={{
                  color: 'black',
                  fontWeight: 'bold',
                  width: '80%',
                  height: 'auto', // Adjust cell height to fit content
                  wordWrap: 'break-word', // Allow wrapping of long words
                  whiteSpace: 'pre-wrap' // Allow wrapping of long lines
                }}
              >
                {Array.isArray(row.data) ? row.data.map((item, index) => <span key={index}>{item},</span>) : row.data}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
