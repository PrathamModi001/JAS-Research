// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Box, DialogActions, DialogContentText, InputAdornment, Stack, Tooltip, Typography } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useDeleteUser, useUpdateUserData, useUserData } from 'src/shared/utility/services/hooks/register'
import { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import { Button, Dialog, DialogContent, DialogTitle, FormControl, TextField, TablePagination } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'

import { useDebouncedCallback } from 'use-debounce'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { useTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import SwitchComponent from './SwitchComponent'

const statusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  current: { color: 'primary' },
  resigned: { color: 'warning' },
  professional: { color: 'success' }
}

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'collapse',
    border: `2px solid ${theme.palette.divider}`
  }
}))

const UsersTable = () => {
  const theme = useTheme()
  const classes = useStyles()

  const [userData, setUserData] = useState(null)
  const [editTypeModalOpen, setEditTypeModalOpen] = useState(false)

  const [searchUsers, setSearchUsers] = useState('')
  const [filteredUserData, setFilteredUserData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userDeleId, setUserDeleId] = useState('')
  const user_data = useSelector(state => state.user)
  const [activeToogleIndex, setActiveToogleIndex] = useState(1)

  const debouncedFetchData = useDebouncedCallback(value => {
    getUserMutate(value)
  }, 1000)

  const customStyles = {
    toggleBtn: {
      fontSize: 12,
      fontWeight: 500,
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      textTransform: 'uppercase',
      position: 'relative',
      zIndex: 2,
      gap: '8px'
    },
    mainDiv: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    },
    BTN_AD: {
      fontSize: 12,
      fontWeight: 500,
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      textTransform: 'uppercase',
      position: 'relative',
      zIndex: 2
    },
    toggleIn: {
      borderRadius: 50,
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      justifyContent: 'center',
      position: 'relative',
      width: '200px',
      padding: '0px 10px 0px 10px',
      color: theme.palette.common.black
    },
    bg: {
      position: 'absolute',
      height: '100%',
      borderRadius: 20,
      zIndex: 1,
      transition: 'all 0.3s ease',
      width: 0
    },
    pointer: {
      cursor: 'pointer'
    },
    active: {
      background: theme.palette.primary.main,
      borderRadius: 20,
      margin: '0px 0px',
      padding: '7px 10px',
      color: theme.palette.common.white
    },

    inactive: {
      background: theme.palette.error.main,
      borderRadius: 20,
      padding: '7px 10px',
      color: theme.palette.common.white
    },
    yse: {
      color: 'black'
    }
  }

  const {
    data: getUserData,
    isLoading: getUserLoading,
    isError: getUserIsError,
    error: getUserError,
    mutate: getUserMutate
  } = useUserData()

  useEffect(() => {
    try {
      if (getUserData && !getUserLoading) {
        setUserData(getUserData?.data.list)
        setFilteredUserData(
          getUserData?.data.list !== null
            ? getUserData?.data.list.filter(
                user =>
                  user.firstName.toLowerCase().includes(searchUsers.toLowerCase()) ||
                  user.lastName.toLowerCase().includes(searchUsers.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchUsers.toLowerCase())
              )
            : []
        )
        setTotalUsers(getUserData.data.total)
      }
      if (getUserIsError) {
        enqueueSnackbar(getUserError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }, [getUserData, getUserLoading, getUserIsError, rowsPerPage])

  const handleSearchUsers = e => {
    setSearchUsers(e.target.value.trim())

    debouncedFetchData({
      isApproved: activeToogleIndex === 1 ? true : false,
      pageNo: 1,
      limit: rowsPerPage,
      query: searchUsers
    })
  }

  const {
    data: getUpdateUserData,
    isLoading: getUpdateUserLoading,
    isError: getUpdateUserIsError,
    error: getUpdateUserError,
    mutate: getUpdateUserMutate
  } = useUpdateUserData()

  useEffect(() => {
    try {
      if (getUpdateUserData && !getUpdateUserLoading) {
        enqueueSnackbar(getUpdateUserData?.message, { variant: 'success' })
        console.log(getUpdateUserData)
        getUserMutate({
          isApproved: activeToogleIndex === 1 ? true : false,
          pageNo: page + 1,
          limit: rowsPerPage,
          query: searchUsers
        })
      }
      if (getUpdateUserIsError) {
        enqueueSnackbar(getUpdateUserError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }, [getUpdateUserData, getUpdateUserLoading, getUpdateUserIsError])

  const {
    data: approveUserData,
    isLoading: approveUserLoading,
    isError: approveUserIsError,
    error: approveUserError,
    mutate: approveUserMutate
  } = useUpdateUserData()

  useEffect(() => {
    try {
      if (approveUserData && !approveUserLoading) {
        console.log(getUpdateUserData)

        enqueueSnackbar(
          approveUserData?.user?.isApproved ? 'User approved successfully' : 'User disapproved successfully',
          { variant: 'success' }
        )
        getUserMutate({
          isApproved: activeToogleIndex === 1 ? true : false,
          pageNo: page + 1,
          limit: rowsPerPage,
          query: searchUsers
        })
      }
      if (approveUserIsError) {
        enqueueSnackbar(approveUserError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }, [approveUserData, approveUserLoading, approveUserIsError])

  const {
    data: deleteUserData,
    isLoading: deleteUserLoading,
    isError: deleteUserIsError,
    error: deleteUserError,
    mutate: deleteUserMutate
  } = useDeleteUser()

  console.log(activeToogleIndex)

  useEffect(() => {
    try {
      if (deleteUserData && !deleteUserLoading) {
        enqueueSnackbar(deleteUserData?.message, { variant: 'success' })
        getUserMutate({
          isApproved: activeToogleIndex === 1 ? true : false,
          pageNo: page + 1,
          limit: rowsPerPage,
          query: searchUsers
        })
      }
      if (deleteUserIsError) {
        enqueueSnackbar(deleteUserError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }, [deleteUserData, deleteUserLoading, deleteUserIsError, deleteUserError])

  const validationSchema = yup.object({
    email: yup
      .string()
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Invalid email'
      )
      .required('Required'),
    firstName: yup
      .string()
      .trim() // Removes leading/trailing whitespace
      .matches(/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/, 'First name must contain only alphabetic characters')
      .min(2, 'First name must be at least two characters long')
      .max(50, 'First name must be at most 50 characters long')
      .required('First Name Required'),
    lastName: yup
      .string()
      .trim() // Removes leading/trailing whitespace
      .matches(/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/, 'Last Name must contain only alphabetic characters')
      .min(2, 'Last Name must be at least two characters long')
      .max(50, 'Last Name must be at most 50 characters long')
      .required('Last Name Required')
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      id: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      values.firstName = values.firstName.replace(/\s+/g, ' ').trim()
      values.lastName = values.lastName.replace(/\s+/g, ' ').trim()

      getUpdateUserMutate({ id: values.id, ...values })
      handleModalClose()
    }
  })

  const handleModalClose = () => {
    setEditTypeModalOpen(false)
  }

  const handleEditTypeModalOpen = userData => {
    setEditTypeModalOpen(true)
    formik.setValues({
      email: userData?.email || '',
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      id: userData?._id || ''
    })
  }

  const handleDeleteUser = userData => {
    setUserDeleId(userData?._id)
    setDeleteModalOpen(true)
  }

  const handleDeleteUserConfirm = () => {
    deleteUserMutate(userDeleId)
    setDeleteModalOpen(false)
  }

  const handleDeleteUserCancel = () => {
    setDeleteModalOpen(false)
  }

  const handleApproveUser = userData => {
    const payload = {
      isApproved: true,
      id: userData._id
    }
    approveUserMutate({ id: payload.id, ...payload })
  }

  const handleDisapproveUser = userData => {
    const payload = {
      isApproved: false,
      id: userData._id
    }
    approveUserMutate({ id: payload.id, ...payload })
  }

  useEffect(() => {
    const queryParams = {
      isApproved: activeToogleIndex === 1 ? true : false,
      limit: rowsPerPage,
      pageNo: 1,
      query: searchUsers
    }
    getUserMutate(queryParams)
  }, [activeToogleIndex])

  useEffect(() => {
    const totalPagesCount = Math.ceil(totalUsers / rowsPerPage)
    setTotalPages(totalPagesCount)
  }, [filteredUserData, rowsPerPage])

  useEffect(() => {
    if (getUserData) {
      setTotalUsers(getUserData.data.total)
    }
  }, [getUserData])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)

    const startIndex = newPage * rowsPerPage
    const endIndex = Math.min(startIndex + rowsPerPage, filteredUserData.length)
    const newPageData = filteredUserData.slice(startIndex, endIndex)

    const queryParams = {
      isApproved: activeToogleIndex === 1 ? true : false,
      limit: rowsPerPage,
      pageNo: newPage + 1
    }

    getUserMutate(queryParams)
  }

  const handleChangeRowsPerPage = event => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(0)

    const queryParams = {
      isApproved: activeToogleIndex === 1 ? true : false,
      limit: newRowsPerPage,
      pageNo: 1
    }
    getUserMutate(queryParams)
  }

  return (
    <>
      <Card>
        <Typography
          sx={{ fontSize: '24px', fontWeight: '600', padding: '15px 25px' }}
          color={theme.palette.mode === 'dark' ? `rgba(231, 227, 252, 0.87)` : theme.palette.primary.main}
        >
          Admin Dashboard
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
            label='Search Users'
            variant='outlined'
            value={searchUsers}
            onChange={e => handleSearchUsers(e)}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{
              width: { sm: '262px', xs: '100%' },
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
          >
            {/* <InputLabel id='user-approval-select-label'>Select user status</InputLabel> */}
            <SwitchComponent
              options={['Approved User', 'Disapproved User']}
              setState={setActiveToogleIndex}
              value={activeToogleIndex}
            />
          </FormControl>
        </Stack>

        <TableContainer>
          <Table className={classes.table} sx={{ minWidth: 800 }} aria-label='spanning table'>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>Sr No.</TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>First Name</TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>Last Name</TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>Email</TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>Approve User</TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'white' }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUserData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center' fontSize='1rem'>
                    Data not found!
                  </TableCell>
                </TableRow>
              ) : (
                filteredUserData.map((user, index) =>
                  user._id !== user_data?.userData?._id ? (
                    <TableRow key={user._id} hover sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                      <TableCell sx={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{user.firstName}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{user.lastName}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{user.email}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={customStyles.mainDiv}>
                          <Box sx={customStyles.toggleBtn}>
                            <Box
                              onClick={() => handleApproveUser(user)}
                              sx={(user.isApproved && customStyles.active) || customStyles.pointer}
                            >
                              <Typography
                                variant='body2'
                                color={user.isApproved ? 'common.white' : 'inherit'}
                                fontSize={'12px'}
                                fontWeight={'600'}
                              >
                                Approve
                              </Typography>
                            </Box>
                            <Box
                              onClick={() => handleDisapproveUser(user)}
                              sx={(!user.isApproved && customStyles.inactive) || customStyles.pointer}
                            >
                              <Typography
                                variant='body2'
                                color={!user.isApproved ? 'common.white' : 'inherit'}
                                fontSize={'12px'}
                                fontWeight={'600'}
                              >
                                Disapprove
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button onClick={() => handleEditTypeModalOpen(user)} sx={{ display: 'none' }}>
                          <EditIcon />
                        </Button>
                        <Tooltip title='Delete' placement='top'>
                          <Button color='error' onClick={() => handleDeleteUser(user)}>
                            <DeleteIcon />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ) : null
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component='div'
          count={totalUsers}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </Card>
      <Dialog open={editTypeModalOpen} onClose={handleModalClose}>
        {editTypeModalOpen === true && (
          <>
            <DialogTitle>
              <span>Edit User</span>
            </DialogTitle>
            <DialogContent>
              <form onSubmit={formik.handleSubmit}>
                <div style={{ marginTop: '10px' }}>
                  <TextField
                    fullWidth
                    id='firstName'
                    name='firstName'
                    label='First Name'
                    type='text'
                    size='small'
                    style={{ marginBottom: '15px' }}
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                  />
                  <TextField
                    fullWidth
                    id='lastName'
                    name='lastName'
                    label='Last Name'
                    type='text'
                    size='small'
                    style={{ marginBottom: '15px' }}
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                  <TextField
                    fullWidth
                    id='email'
                    name='email'
                    label='Email'
                    type='email'
                    size='small'
                    style={{ marginBottom: '15px' }}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    className='mb-3'
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button type='submit' variant='contained' color='primary'>
                    Submit
                  </Button>
                </div>
              </form>
            </DialogContent>
          </>
        )}
      </Dialog>
      <Dialog open={deleteModalOpen} onClose={handleDeleteUserCancel}>
        {deleteModalOpen === true && (
          <>
            <DialogTitle>
              <span>Are you sure you want to delete this user?</span>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <span>This action cannot be undone.</span>
              </DialogContentText>
              <DialogActions>
                <Button onClick={handleDeleteUserCancel}>Cancel</Button>
                <Button onClick={() => handleDeleteUserConfirm()} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  )
}

export default UsersTable
