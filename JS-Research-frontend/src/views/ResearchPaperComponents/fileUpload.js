import { makeStyles } from '@material-ui/core/styles'
import { Divider, Grid, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { enqueueSnackbar } from 'notistack'

const FileUpload = ({ files, setFiles, setDeleteFile, title, edit = false }) => {
  const [multipleFiles, setMultipleFiles] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef(null) // Add a ref for the file input

  const useStyles = makeStyles(theme => ({
    dropZone: {
      marginTop: '30px',
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

    editDrop: {
      maxWidth: '100%',
      border: '2px dashed #aaaaaa',
      padding: '20px'
    },

    fileList: {
      marginTop: '10px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap'
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
      marginTop: '5px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: theme.palette.primary.main,
      textTransform: 'uppercase'
    },
    uploadBtn: {
      padding: '8px 16px',
      marginTop: '10px',
      [theme.breakpoints.down('sm')]: {
        marginTop: '0px',
        width: '100%'
      }
    },
    dropedfiles: {
      width: 'auto',
      display: 'flex',
      padding: '20px 10px 10px 20px',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
      height: 'auto',
      borderRadius: '10px',
      marginBottom: '10px',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0'
    }
  }))

  const classes = useStyles()

  const handleDrop = event => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer.files
    validateAndSetFiles(droppedFiles)
  }

  const handleFiles = newFiles => {
    const existingFiles = files?.filter(file => file?.name === newFiles[0].name)
    if (existingFiles.length > 0) {
      setErrorMessage('File already exists')

      return
    }

    setMultipleFiles(newFiles)
  }

  const handleFileInputChange = event => {
    const newFiles = event.target.files
    validateAndSetFiles(newFiles)
  }

  const validateAndSetFiles = newFiles => {
    const validFiles = Array.from(newFiles).filter(
      file => file.type === 'application/pdf' && file.size <= 25 * 1024 * 1024
    )
    if (validFiles.length !== newFiles.length) {
      setErrorMessage('Only .pdf files with a maximum size of 25 MB are allowed')
    } else {
      handleFiles(newFiles)
      setErrorMessage('')
    }
  }

  useEffect(() => {
    setFiles(multipleFiles)
    enqueueSnackbar('File uploaded successfully', { variant: 'success' })
  }, [multipleFiles])

  const handleDeleteFile = index => {
    setDeleteFile(index)
    if (inputRef.current) {
      inputRef.current.value = null
    }
  }

  return (
    <div>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        className={edit ? classes.editDrop : classes.dropZone}
        sm={12}
        smooth
        md={6}
        onDrop={handleDrop}
        onDragOver={event => event.preventDefault()}
      >
        <Grid item xs={12} sm={6}>
          <Typography variant='h5' color='inherit' gutterBottom>
            Drag & Drop files here
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <input
            accept='.pdf'
            type='file'
            id='fileInput'
            style={{ display: 'none' }}
            name='file'
            multiple
            ref={inputRef} // Add ref to the file input
            onChange={handleFileInputChange}
          />
          <h3>OR</h3>
          <label htmlFor='fileInput'>
            <Button variant='contained' color='primary' component='span' className={classes.uploadBtn}>
              Submit File
            </Button>
            <p style={{ color: 'red' }}>Maximum file size 25mb</p>
            <p style={{ color: 'red' }}>File must be .pdf type</p>
          </label>
        </Grid>
      </Grid>
      <Typography variant='h6' sx={{ marginTop: '20px', textAlign: 'center' }}>
        Added files:
      </Typography>
      <Divider />
      <div className={classes.fileList}>
        {errorMessage && (
          <Typography variant='h6' color='error' gutterBottom sx={{ textAlign: 'center', marginTop: '20px' }}>
            {errorMessage}
          </Typography>
        )}

        {files && files.length > 0 && files[0]?.name
          ? files.map((file, index) => (
              <div key={index} className={classes.fileItem}>
                <Box className={classes.dropedfiles} position={'relative'}>
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/400px-PDF_file_icon.svg.png?20220802235851'
                        alt='pdf'
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                      />
                      <Typography className={classes.fileType}>PDF {index + 1}</Typography>
                    </Box>
                    <Typography className={classes.fileName}>
                      {file?.name === undefined
                        ? title?.length > 20
                          ? title.slice(0, 20) + '...' + ' ' + index
                          : title + ' ' + index
                        : file?.name}
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => handleDeleteFile(index)}
                    sx={{
                      position: 'absolute',
                      left: '-3%',
                      top: '0%'
                    }}
                  >
                    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <g clipPath='url(#clip0_51_1940)'>
                        <path
                          d='M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z'
                          stroke='#ADB2B7'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M12.5 7.5L7.5 12.5'
                          stroke='#ADB2B7'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M7.5 7.5L12.5 12.5'
                          stroke='#ADB2B7'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </g>
                      <defs>
                        <clipPath id='clip0_51_1940'>
                          <rect width='20' height='20' fill='white' />
                        </clipPath>
                      </defs>
                    </svg>
                  </Button>
                </Box>
              </div>
            ))
          : !errorMessage && (
              <Typography
                variant='h6'
                color='inherit'
                gutterBottom
                sx={{ textAlign: 'center', marginTop: '20px', color: 'red' }}
              >
                No files selected
              </Typography>
            )}
      </div>
    </div>
  )
}

export default FileUpload
