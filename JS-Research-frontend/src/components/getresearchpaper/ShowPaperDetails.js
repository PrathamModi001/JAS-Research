// src/components/GetResearchPaper.js
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Tooltip,
  Modal,
  Box,
  IconButton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { LoadingButton } from '@mui/lab'
import CloseIcon from '@mui/icons-material/Close'

import { userRole, languages } from 'src/shared/utility/helpers'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Link from 'next/link'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import {
  setSearchQuery,
  setSelectedYear,
  setSelectedAuthor,
  setSelectedMainCategory,
  setSelectedSubCategory,
  setSelectedLanguages,
  setIsApprove
} from 'src/redux/reducers/searchSlice'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from 'src/redux/reducers/authSlice'
import { useTheme } from '@emotion/react'
import { useState } from 'react'
import { useRouter } from 'next/router'

function ShowPaperDetails({
  authorData,
  mainCategories,
  subCategories,
  yearData,
  clearSearch,
  set_IsApproved,
  updateResearchPaperMutate,
  getResearchPaperLoading,
  researchPaperData,
  loadingPaperId,
  setLoadingPaperId,
  handleEditOnClick,
  updateResearchPaperLoading
}) {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const theme = useTheme()
  const searchState = useSelector(state => state.search)
  const [reason, setReason] = useState('')
  const router = useRouter()
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [open, setOpen] = useState(false)

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  }

  const handleModalOpen = id => {
    handleOpen()
    setLoadingPaperId(id)
  }

  const handleApprovedDisapproved = (id, value, reason = '') => {
    value === 'disapproved'
    set_IsApproved(value)
    setLoadingPaperId(id)

    handleClose()

    const payload = {
      isApproved: value,
      id: id,
      reasonOfRejection: reason
    }
    updateResearchPaperMutate({ id: payload.id, data: payload })
  }

  const handleClick = paper => {
    router.push(`/research-paper/${paper._id}`)
  }

  const handleApproveDisapprove = value => {
    dispatch(setIsApprove(value === 'Approved' ? 'approved' : 'disapproved'))

    clearSearch()
  }

  return (
    <>
      <Card sx={{ marginBottom: '30px' }}>
        <CardContent sx={{ padding: '16px 35px 35px 35px !important' }}>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
            flexWrap={'wrap'}
            spacing={2}
          >
            <Typography
              sx={{ fontSize: '24px', fontWeight: '600' }}
              color={theme.palette.mode === 'dark' ? `rgba(231, 227, 252, 0.87)` : theme.palette.primary.main}
            >
              Research Papers/Thesis/Books Search
            </Typography>
            <Link href='/create-paper'>
              <Button color='primary' variant='contained'>
                Add
              </Button>
            </Link>
          </Stack>

          <Stack sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', rowGap: '20px' }}>
            <TextField
              sx={{ width: '100%', marginRight: '10px' }}
              size='small'
              type='text'
              label='Search'
              placeholder='Search Research Papers/Thesis/Books'
              fullWidth
              value={searchState.searchQuery}
              onChange={e => dispatch(setSearchQuery(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            <Autocomplete
              multiple
              options={authorData ?? []}
              getOptionLabel={option => option.toString() || ''}
              value={searchState.selectedAuthor}
              onChange={(event, newValue) => dispatch(setSelectedAuthor(newValue))}
              size='small'
              id='year-autocomplete'
              sx={{
                minWidth: '160px',
                width: 'auto',
                marginRight: '10px',
                display: 'inline-flex',
                flexDirection: 'row'
              }}
              renderInput={params => <TextField {...params} label='Select Authors' />}
            />
            <Autocomplete
              multiple
              options={yearData ?? []}
              getOptionLabel={option => option.toString() || ''}
              value={searchState.selectedYear}
              onChange={(event, newValue) => dispatch(setSelectedYear(newValue))}
              sx={{
                minWidth: '140px',
                width: 'auto',
                display: 'inline-flex',
                flexDirection: 'row',
                marginRight: '10px'
              }}
              size='small'
              id='author-autocomplete'
              renderInput={params => <TextField {...params} label='Select Years' />}
            />
            <Autocomplete
              sx={{ width: 200, marginRight: '10px' }}
              disablePortal
              size='small'
              id='main-category-autocomplete'
              options={mainCategories ?? []}
              getOptionLabel={option => option.toString() || ''}
              value={searchState.selectedMainCategory}
              onChange={(event, newValue) => dispatch(setSelectedMainCategory(newValue))}
              renderInput={params => <TextField {...params} label='Select Main Category' />}
            />
            <Autocomplete
              sx={{ width: 200, marginRight: '10px' }}
              disablePortal
              size='small'
              id='sub-category-autocomplete'
              options={subCategories ?? []}
              getOptionLabel={option => option.toString() || ''}
              value={searchState.selectedSubCategory}
              onChange={(event, newValue) => dispatch(setSelectedSubCategory(newValue))}
              renderInput={params => <TextField {...params} label='Select Sub Category' />}
            />
            <Autocomplete
              sx={{ width: 170, marginRight: '10px' }}
              disablePortal
              size='small'
              options={languages ?? []}
              getOptionLabel={option => option.toString() || ''}
              value={searchState.selectedLanguages}
              onChange={(event, newValue) => dispatch(setSelectedLanguages(newValue))}
              renderInput={params => <TextField {...params} label='Select Language' />}
            />
            {user?.role === userRole.Admin && (
              <Autocomplete
                sx={{ width: 170, marginRight: '10px' }}
                disablePortal
                size='small'
                id='approve-autocomplete'
                options={['Approved', 'Disapproved']}
                value={searchState.isApprove === 'approved' ? 'Approved' : 'Disapproved'}
                onChange={(e, value) => handleApproveDisapprove(value)}
                renderInput={params => (
                  <TextField {...params} label='Approval Status' InputLabelProps={{ shrink: true }} />
                )}
              />
            )}
            <Button color='error' variant='outlined' onClick={clearSearch} size='small' sx={{ fontSize: '12px' }}>
              Clear Search
            </Button>
          </Stack>
        </CardContent>
      </Card>
      {!getResearchPaperLoading && researchPaperData?.length === 0 && (
        <Typography variant='body1' align='center' sx={{ marginTop: 2 }}>
          Data not found!
        </Typography>
      )}
      {researchPaperData?.length > 0 &&
        researchPaperData?.map(paper => (
          <Card
            key={paper._id}
            sx={{
              margin: '10px 0px 10px 0px',
              position: 'relative',
              paddingBottom: '10px'
            }}
          >
            <CardContent sx={{ padding: '16px 10px 10px 35px !important' }}>
              <Stack
                zIndex={1}
                sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography sx={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', flexBasis: '60%' }}>
                  Title : {paper.title}
                </Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: '400', margin: '10px' }}>
                  <b>Published Year:</b>
                  <br />
                  {paper.yearOfPublication}
                  <br />
                </Typography>
              </Stack>
              <Stack sx={{ rowGap: '20px', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '16px', fontWeight: '400', maxWidth: '90%' }}>
                  <b>Authors:</b> {paper.authors.join(', ')}
                  <br />
                  <b>Keywords:</b> {paper.keywords.join(', ')}
                  <br />
                  <b>Language:</b> {paper.language}
                  <br />
                  <b>Categories:</b> {paper.mainCategories.join(',')}
                  <br />
                  <b>Sub Categories:</b> {paper.subCategories[0] ? paper.subCategories.join(',') : 'N.A'}
                </Typography>
              </Stack>
            </CardContent>
            <Stack
              sx={{ flexBasis: '15%', rowGap: '10px', marginRight: '8px' }}
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent='flex-end'
              margin={2}
              gap={2}
              alignContent={'center'}
              marginRight={user.role !== userRole.Admin ? '10px' : 0}
            >
              <Tooltip title='Show details' placement='top'>
                <LoadingButton
                  sx={{ float: 'right', height: '40px' }}
                  width={{ xs: '100%', sm: '100%' }}
                  variant='contained'
                  size='small'
                  onClick={() => handleClick(paper)}
                >
                  <VisibilityIcon />
                </LoadingButton>
              </Tooltip>
              {user.role === userRole.Admin && (
                <Tooltip title='Update Research Paper' placement='top'>
                  <LoadingButton
                    sx={{ float: 'right', height: '40px' }}
                    width={{ xs: '100%', sm: '100%' }}
                    variant='contained'
                    size='small'
                    onClick={() => handleEditOnClick(paper._id)}
                  >
                    <ModeEditIcon />
                  </LoadingButton>
                </Tooltip>
              )}
              {user.role === userRole.Admin && searchState.isApprove === 'approved' && (
                <LoadingButton
                  sx={{ float: 'right', height: '40px' }}
                  width={{ xs: '100%', sm: '110px' }}
                  size='small'
                  variant='contained'
                  color='error'
                  onClick={() => handleModalOpen(paper._id)}
                  loading={loadingPaperId === paper._id && updateResearchPaperLoading}
                >
                  Reject
                </LoadingButton>
              )}
              {user.role === userRole.Admin && searchState.isApprove === 'disapproved' && (
                <LoadingButton
                  sx={{ float: 'right', height: '40px' }}
                  width={{ xs: '100%', sm: '110px' }}
                  size='small'
                  variant='contained'
                  color='success'
                  onClick={() => handleApprovedDisapproved(paper._id, 'approved')}
                  loading={loadingPaperId === paper._id && updateResearchPaperLoading}
                >
                  Approve
                </LoadingButton>
              )}
            </Stack>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='parent-modal-title'
              aria-describedby='parent-modal-description'
            >
              <form>
                <Box sx={{ ...style, width: '500px', display: 'flex', padding: '20px', flexDirection: 'column' }}>
                  <IconButton
                    aria-label='close'
                    onClick={handleClose}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: theme => theme.palette.grey[500]
                    }}
                  >
                    <CloseIcon />
                  </IconButton>

                  <h2 id='parent-modal-title'>Reason To Reject</h2>
                  <TextField
                    id='outlined-multiline-flexible'
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    label='Reason'
                    multiline
                    minRows={4}
                  />
                  <Box sx={{ display: 'flex', margin: '10px', gap: '10px' }}>
                    <Button
                      onClick={() => handleApprovedDisapproved(loadingPaperId, 'disapproved', reason)}
                      type='submit'
                      variant='contained'
                    >
                      Submit
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                  </Box>
                </Box>
              </form>
            </Modal>
          </Card>
        ))}
    </>
  )
}

export default ShowPaperDetails
