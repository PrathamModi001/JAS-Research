import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Box, Button, InputAdornment, Stack, Tooltip, Typography } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { FormControl, TextField, TablePagination } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import { useTheme } from '@emotion/react'

function PaperApprovalPage({
  searchQuery,
  setSearchQuery,
  classes,
  researchPaperData,
  totalPapers,
  page,
  handleChangePage,
  rowsPerPage,
  handleChangeRowsPerPage,
  customStyles,
  handleDisapproveUser,
  handleApproveUser,
  handleShowDetails,
  handleDeleteUser,
  handleEditTypeModalOpen
}) {
  const theme = useTheme()

  return (
    <>
      <Card>
        <Typography
          sx={{ fontSize: '24px', fontWeight: '600', padding: '15px 25px' }}
          color={theme.palette.mode === 'dark' ? `rgba(231, 227, 252, 0.87)` : theme.palette.primary.main}
        >
          Approve Research-Paper/Thesis/Books
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-end', sm: 'flex-end' }}
          justifyContent='space-between'
          spacing={2}
          sx={{
            p: 2,
            padding: '20px',
            [theme.breakpoints.down('sm')]: {
              flexWrap: 'wrap'
            }
          }}
        >
          <TextField
            label='Search Research-Papers/Thesis/Book'
            variant='outlined'
            value={searchQuery}
            onChange={e => {
              const querySearch = e.target.value
              setSearchQuery(querySearch)
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{
              width: { sm: '350px', xs: '100%' },
              [theme.breakpoints.down('sm')]: {
                marginBottom: '15px !important'
              }
            }}
          />
          <FormControl
            variant='outlined'
            sx={{
              marginTop: { xs: '16px' },
              [theme.breakpoints.down('sm')]: {
                width: '100%'
              }
            }}
          ></FormControl>
        </Stack>

        <TableContainer>
          {/* Apply custom class */}
          <Table className={classes.table} sx={{ minWidth: 800 }} aria-label='spanning table'>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>Sr. No</TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>Title</TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>Author</TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>Approve Paper/Thesis/Book</TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>Edit/Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {researchPaperData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align='center' fontSize='1rem'>
                    Data not found!
                  </TableCell>
                </TableRow>
              ) : (
                researchPaperData.map(
                  (data, index) =>
                    data?.isApproved === 'pending' && (
                      <TableRow
                        key={data.firstName}
                        hover
                        sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      >
                        <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>{data.title}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>{data.authors.map(author => author + ',')}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Box sx={customStyles.mainDiv}>
                            <Box sx={customStyles.toggleBtn}>
                              <Box onClick={() => handleApproveUser(data)}>
                                <Typography
                                  variant='body2'
                                  fontSize={'12px'}
                                  fontWeight={'600'}
                                  sx={{
                                    border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'white' : 'black'}`,
                                    borderRadius: '5px',
                                    padding: '5px 10px',
                                    '&:hover': {
                                      cursor: 'pointer',
                                      backgroundColor: theme.palette.primary.main,
                                      color: 'white',
                                      borderRadius: '5px'
                                    }
                                  }}
                                >
                                  Approve
                                </Typography>
                              </Box>
                              <Box onClick={() => handleDisapproveUser(data)}>
                                <Typography
                                  variant='body2'
                                  fontSize={'12px'}
                                  fontWeight={'600'}
                                  sx={{
                                    border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'white' : 'black'}`,
                                    borderRadius: '5px',
                                    padding: '5px 10px',
                                    '&:hover': {
                                      cursor: 'pointer',
                                      backgroundColor: theme.palette.error.main,
                                      color: 'white',
                                      padding: '5px 10px',
                                      borderRadius: '5px'
                                    }
                                  }}
                                >
                                  Disapprove
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' justifyContent='center'>
                            <Tooltip title='Show details' placement='top'>
                              <Button size='small' onClick={() => handleShowDetails(data)}>
                                <VisibilityIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title='Edit Paper' placement='top'>
                              <Button size='small' onClick={() => handleEditTypeModalOpen(data)}>
                                <EditIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title='Delete' placement='top' color='error'>
                              <Button size='small' onClick={() => handleDeleteUser(data)}>
                                <DeleteIcon />
                              </Button>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component='div'
          count={totalPapers}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  )
}

export default PaperApprovalPage
