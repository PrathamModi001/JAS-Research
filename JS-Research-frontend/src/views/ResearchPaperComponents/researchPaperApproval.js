import { DialogActions, DialogContentText } from '@mui/material'
import { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'

import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'

import { useDebouncedCallback } from 'use-debounce'

import { useTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'

import {
  useDeleteResearchPaperByID,
  useGetResearchPaperData,
  useUpdateResearchPaper
} from 'src/shared/utility/services/hooks/researchPaper'
import { useRouter } from 'next/router'
import { CircularProgress } from '@material-ui/core'
import PaperApprovalPage from 'src/components/papee-approval/PaperApprovalPage'

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'collapse', // Ensure borders collapse properly
    border: `2px solid ${theme.palette.divider}` // Add border
  }
}))

const ResearchPaperApproval = () => {
  const router = useRouter()
  const theme = useTheme()
  const classes = useStyles() // Utilize makeStyles hook
  const [editTypeModalOpen, setEditTypeModalOpen] = useState(false)
  const [searchUsers, setSearchUsers] = useState('')
  const [reason, setReason] = useState('')
  const [researchPaperData, setResearchPaperData] = useState([])
  const [isApprove, setIsApprove] = useState('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState([])
  const [selectedMainCategory, setSelectedMainCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState('')
  const [totalPapers, setTotalPapers] = useState(0)
  const [page, setPage] = useState(0)
  const [selectedYear, setSelectedYear] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState('10')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userDeleId, setUserDeleId] = useState('')

  const debouncedFetchData = useDebouncedCallback(value => {
    getResearchPaperMutate(value)
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
    data: getResearchPaperData,
    isLoading: getResearchPaperLoading,
    isError: getResearchPaperIsError,
    error: getResearchPaperError,
    mutate: getResearchPaperMutate
  } = useGetResearchPaperData()

  const {
    data: deleteResearchPaperData,
    isLoading: deleteResearchPaperDataLoading,
    isError: deleteResearchPaperIsError,
    error: deleteResearchPaperError,
    mutate: deleteResearchPaperMutate
  } = useDeleteResearchPaperByID()

  useEffect(() => {
    try {
      if (deleteResearchPaperData && !deleteResearchPaperDataLoading) {
        enqueueSnackbar(deleteResearchPaperData?.message, { variant: 'success' })

        const queryParamsAuthor =
          selectedAuthor?.length > 0 ? selectedAuthor.map(author => `authors=${author}`).join('&') : ''

        const dataObject = {
          authors: queryParamsAuthor,
          limit: rowsPerPage,
          pageNo: page + 1,
          otherQueryParams: {
            isApproved: isApprove,
            query: searchQuery,
            language: selectedLanguages,
            mainCategories: selectedMainCategory,
            subCategories: selectedSubCategory
          }
        }
        getResearchPaperMutate(dataObject)
      }
      if (deleteResearchPaperIsError) {
        enqueueSnackbar(deleteResearchPaperError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error('err', err)
    }
  }, [deleteResearchPaperData, deleteResearchPaperDataLoading, deleteResearchPaperError])

  useEffect(() => {
    try {
      if (getResearchPaperData && !getResearchPaperLoading) {
        setResearchPaperData(getResearchPaperData?.data?.list)
      }
      if (getResearchPaperIsError) {
        enqueueSnackbar(getResearchPaperError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }, [getResearchPaperData, getResearchPaperLoading, getResearchPaperIsError])

  useEffect(() => {
    const queryParamsAuthor =
      selectedAuthor?.length > 0 ? selectedAuthor.map(author => `authors=${author}`).join('&') : ''

    const dataObject = {
      authors: queryParamsAuthor,
      limit: rowsPerPage,
      pageNo: page + 1,
      otherQueryParams: {
        isApproved: isApprove,
        query: searchQuery,
        language: selectedLanguages,
        mainCategories: selectedMainCategory,
        subCategories: selectedSubCategory
      }
    }

    getResearchPaperMutate(dataObject)
  }, [selectedAuthor, selectedLanguages, selectedMainCategory, selectedSubCategory, rowsPerPage, isApprove])

  useEffect(() => {
    if (getResearchPaperData) {
      setTotalPapers(getResearchPaperData.data.total)
    }
  }, [getResearchPaperData])

  const {
    data: updateResearchPaperData,
    isLoading: updateResearchPaperLoading,
    isError: updateResearchPaperIsError,
    error: updateResearchPaperError,
    mutate: updateResearchPaperMutate
  } = useUpdateResearchPaper()

  useEffect(() => {
    try {
      if (updateResearchPaperData && !updateResearchPaperLoading) {
        enqueueSnackbar(updateResearchPaperData?.message, { variant: 'success' })

        const queryParamsAuthor =
          selectedAuthor?.length > 0 ? selectedAuthor.map(author => `authors=${author}`).join('&') : ''

        const queryParamsYear =
          selectedYear?.length > 0 ? selectedYear.map(year => `yearOfPublication=${year}`).join('&') : ''

        const paramsQuery = {
          authors: queryParamsAuthor,
          yearOfPublication: queryParamsYear,
          limit: rowsPerPage,
          pageNo: page + 1,
          otherQueryParams: {
            isApproved: isApprove,
            query: searchQuery,
            language: selectedLanguages,
            mainCategories: selectedMainCategory,
            subCategories: selectedSubCategory
          }
        }

        getResearchPaperMutate(paramsQuery)
      } else if (updateResearchPaperLoading && !updateResearchPaperData) {
        enqueueSnackbar(<CircularProgress size={20} />, {
          variant: 'success'
        })
      }
    } catch (err) {
      enqueueSnackbar(err, { variant: 'error' })
    }
  }, [updateResearchPaperData, updateResearchPaperLoading, updateResearchPaperIsError])

  useEffect(() => {
    debouncedFetchData({
      pageNo: page + 1,
      limit: rowsPerPage,
      otherQueryParams: {
        isApproved: isApprove || 'pending',
        query: searchQuery.trim()
      }
    })
  }, [searchQuery])

  const handleModalClose = () => {
    setEditTypeModalOpen(false)
  }

  const handleEditTypeModalOpen = userData => {
    router.push(`research-paper/editResearchPaper/${userData?._id}`)
  }

  const handleDeleteUser = userData => {
    setUserDeleId(userData?._id)
    setDeleteModalOpen(true)
  }

  const handleDeleteUserConfirm = () => {
    deleteResearchPaperMutate({ id: userDeleId, reasonOfRejection: reason })
    setDeleteModalOpen(false)
  }

  const handleDeleteUserCancel = () => {
    setDeleteModalOpen(false)
  }

  const handleApproveUser = userData => {
    const payload = {
      isApproved: 'approved',
      id: userData._id
    }
    updateResearchPaperMutate({ id: payload.id, data: payload })
  }

  const handleDisapproveUser = userData => {
    const payload = {
      isApproved: 'disapproved',
      id: userData._id
    }
    updateResearchPaperMutate({ id: payload.id, data: payload })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)

    const dataObject = {
      authors: selectedAuthor,
      yearOfPublication: selectedYear,
      limit: rowsPerPage,
      pageNo: newPage + 1,
      otherQueryParams: {
        query: searchQuery,
        isApproved: isApprove,
        language: selectedLanguages,
        mainCategories: selectedMainCategory,
        subCategories: selectedSubCategory
      }
    }

    getResearchPaperMutate(dataObject)
  }

  const handleChangeRowsPerPage = event => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)

    const newPageNumber = Math.floor((page * rowsPerPage) / newRowsPerPage)
    setPage(newPageNumber)
  }

  const handleShowDetails = userData => {
    router.push(`/research-paper/${userData?._id}`)
  }

  return (
    <>
      <PaperApprovalPage
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        classes={classes}
        customStyles={customStyles}
        researchPaperData={researchPaperData}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        totalPapers={totalPapers}
        page={page}
        handleChangePage={handleChangePage}
        handleDisapproveUser={handleDisapproveUser}
        handleApproveUser={handleApproveUser}
        handleShowDetails={handleShowDetails}
        handleDeleteUser={handleDeleteUser}
        handleEditTypeModalOpen={handleEditTypeModalOpen}
      />
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
              <span>Are you sure you want to delete this Article?</span>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <span>This action cannot be undone.</span>
                <br />
                <br />
                <TextField
                  id='outlined-multiline-flexible'
                  value={reason}
                  sx={{ width: '100%' }}
                  onChange={e => setReason(e.target.value)}
                  label='Reason for deletion'
                  multiline
                  minRows={4}
                />
              </DialogContentText>
              <DialogActions>
                <Button onClick={handleDeleteUserCancel}>Cancel</Button>
                <Button onClick={() => handleDeleteUserConfirm()} variant='contained' autoFocus>
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

export default ResearchPaperApproval
