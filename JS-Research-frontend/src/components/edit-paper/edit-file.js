import { Box, Button, Grid, Modal, Tooltip, Typography } from '@mui/material'
import Divider from '@mui/material/Divider'
import { LoadingButton } from '@mui/lab'

// icon import
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

import DeleteIcon from '@mui/icons-material/Delete'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import FileUpload from '../../views/ResearchPaperComponents/fileUpload'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'

function Editfile({
  activeIndex,
  files,
  formik,
  updateResearchPaperDataLoading,
  handleAddNewFile,
  Filelength,
  handleReplaceFile,
  handleDeleteFile,
  handleClose,
  open,
  setOpen,
  handleOnClick
}) {
  const [newFile, setNewFile] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleOpen = () => setOpen(true)

  const useStyles = makeStyles(theme =>
    createStyles({
      previewChip: {
        minWidth: 200,
        maxWidth: 200,
        margin: 'auto',
        marginTop: '20px',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: theme.palette.background.paper,
        transition: 'padding-left .25s ease-in-out',
        textAlign: 'center'
      },
      dropzoneClass: {
        backgroundColor: theme.palette.background.paper,
        width: '80%'
      },

      formControl: {
        width: '100%'
      },
      yes: {
        width: '100%'
      },
      no: {
        width: '100%'
      },
      bgColorToggle: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        '& a': {
          fontSize: 14,
          fontWeight: 500,
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 2
        },
        '& .toggleIn': {
          borderRadius: 60,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          justifyContent: 'center',
          padding: '2px',
          position: 'relative',
          width: 300,

          cursor: 'pointer'
        },
        '& .bg': {
          position: 'absolute',
          height: '100%',
          borderRadius: 20,
          backgroundColor: '#036A85',
          zIndex: 1,
          transition: 'all 0.3s ease',
          width: 0
        },
        '& .active': {
          color: theme.palette.common.white
        },

        '& .activeIndex1': {
          left: 0,
          width: '50%'
        },
        '& .activeIndex2': {
          right: 0,
          width: '50%'
        }
      },
      dropZone: {
        marginTop: '50px',
        border: '2px dashed #aaaaaa',
        borderRadius: '5px',
        width: '100%',
        margin: 'auto',
        padding: '20px',
        display: 'flex',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease',
        '&:hover': {
          borderColor: theme.palette.primary.main
        }
      },

      fileList: {
        marginTop: '10px'
      },
      fileItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        width: 'auto',
        padding: '10px',
        justifyContent: 'center'
      },
      fileName: {
        marginRight: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        textTransform: 'uppercase'
      },
      uploadBtn: {
        padding: '8px 16px',
        marginTop: '10px',
        [theme.breakpoints.down(`sm`)]: {
          marginTop: '0px',
          width: '100%'
        }
      },

      dropedfiles: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        marginBottom: '10px',
        width: 'auto',
        height: 'auto',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px'
      }
    })
  )
  const classes = useStyles()

  return (
    <>
      <p style={{ color: 'red', marginBottom: '25px', textAlign: 'center', fontSize: '20px' }}>
        Does this file have copyright permission to upload the Paper/Thesis/Book?
      </p>
      <div className={classes.bgColorToggle}>
        <div className='toggleIn'>
          <a onClick={() => handleOnClick(1)} className={activeIndex === 1 ? 'active' : ''}>
            <p className='yes'>Yes</p>
          </a>
          <a onClick={() => handleOnClick(2)} className={activeIndex === 2 ? 'active' : ''}>
            <p className='no'>No</p>
          </a>
          <span className={`bg activeIndex${activeIndex}`} />
        </div>
      </div>
      {activeIndex === 1 ? (
        <>
          {formik.values.itemType === 'Book' && (
            <Typography sx={{ color: 'red', textAlign: 'center', paddingTop: '30px' }}>
              Synopsis or the preface of the book is only accepted
            </Typography>
          )}
          <Typography sx={{ padding: '30px 30px 0px 30px', textAlign: 'center' }} variant='h5'>
            Submitted Files
          </Typography>
          <Divider />
          <div className={classes.fileList}>
            {errorMessage && (
              <Typography variant='h6' color='error' gutterBottom sx={{ textAlign: 'center', marginTop: '20px' }}>
                {errorMessage}
              </Typography>
            )}
            {files &&
              files[0] !== undefined &&
              files?.length > 0 &&
              files?.map((file, index) => (
                <div key={index} className={classes.fileItem}>
                  <Box className={classes.dropedfiles}>
                    <Typography className={classes.fileName}>
                      {file?.name === undefined
                        ? formik.values.title?.length > 20
                          ? formik.values.title.slice(0, 20) + '...' + '_' + (index + 1)
                          : formik.values.title + '_' + (index + 1)
                        : file?.name}
                    </Typography>
                    <Tooltip title='Delete File' placement='top'>
                      <Button onClick={() => handleDeleteFile(index)}>
                        <DeleteIcon color='error' />
                      </Button>
                    </Tooltip>

                    {index < Filelength && (
                      <Tooltip title='Replace File' placement='top'>
                        <Button onClick={handleOpen}>
                          <BorderColorIcon />
                        </Button>
                      </Tooltip>
                    )}

                    <Modal open={open} onClose={handleClose} sx={{}}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: { xs: '90%', md: 'fit-content' },
                          bgcolor: 'background.paper',
                          border: '2px solid #000',
                          boxShadow: 24,
                          p: 4,
                          position: 'relative'
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '10px'
                          }}
                        >
                          <Typography variant='h5' sx={{ textAlign: 'center' }} p={2}>
                            Replace File
                          </Typography>
                          <IconButton
                            aria-label='close'
                            onClick={handleClose}
                            sx={{
                              color: theme => theme.palette.grey[700]
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                        <FileUpload
                          name='files'
                          files={newFile}
                          setFiles={Ffiles => {
                            if (Ffiles) {
                              const updatedFiles = [Ffiles[0]]
                              setNewFile(updatedFiles)
                            }
                          }}
                          setDeleteFile={delIndex => {
                            setNewFile('')
                          }}
                          edit={true}
                        />
                        <Button
                          sx={{ display: 'block', margin: '2% auto' }}
                          variant='contained'
                          onClick={() => handleReplaceFile(files, newFile)}
                        >
                          Replace
                        </Button>
                      </Box>
                    </Modal>
                  </Box>
                </div>
              ))}
          </div>
        </>
      ) : (
        <Typography sx={{ padding: '30px', textAlign: 'center' }} variant='h5'>
          All the files will be deleted if files have been added
        </Typography>
      )}

      {activeIndex === 1 && (
        <Grid item xs={12} sm={6} justifyContent={'center'} display={'flex'} textAlign={'center'}>
          <input
            accept='.pdf'
            type='file'
            id='fileInputs'
            style={{ display: 'none' }}
            name='file'
            multiple
            onChange={e => {
              handleAddNewFile(e)
            }}
          />
          <label htmlFor='fileInputs'>
            <Button variant='contained' color='primary' component='span' className={classes.uploadBtn}>
              Add File
            </Button>
            <p style={{ color: 'red' }}>{errorMessage}</p>
          </label>
        </Grid>
      )}

      <Divider />
      <LoadingButton
        size='large'
        type='submit'
        variant='contained'
        sx={{ marginBottom: 7, display: 'block', margin: '2% auto' }}
        loading={updateResearchPaperDataLoading}
        onClick={() => formik.handleSubmit()}
      >
        Update
      </LoadingButton>
    </>
  )
}

export default Editfile
