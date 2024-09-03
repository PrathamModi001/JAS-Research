import { LoadingButton } from '@mui/lab'
import Typeography from '@mui/material/Typography'
import FileUpload from '../../views/ResearchPaperComponents/fileUpload'
import { createStyles, makeStyles } from '@material-ui/core/styles'

function FileComponent({ formik, activeIndex, handleOnClick, createResearchPaperLoading1 }) {
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

          position: 'relative',
          width: 200,

          cursor: 'pointer'
        },
        '& .bg': {
          position: 'absolute',
          height: '100%',
          borderRadius: 10,
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
      }
    })
  )

  const classes = useStyles()

  return (
    <>
      <p style={{ color: 'red', marginBottom: '25px', textAlign: 'center', fontSize: '20px' }}>
        Do you have copyright permission to upload the Paper/Thesis/Book?
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
            <Typeography sx={{ color: 'red', textAlign: 'center', paddingTop: '30px' }}>
              Synopsis or the preface of the book is only accepted
            </Typeography>
          )}
          <FileUpload
            name='files'
            files={formik.values.files}
            setFiles={files => {
              if (files?.length === 0) {
                return
              }
              const updatedFiles = [...formik.values.files, ...files]
              formik.setFieldValue('files', updatedFiles)
            }}
            setDeleteFile={delIndex => {
              const AllFiles = formik.values.files
              const delfiles = AllFiles.filter((item, i) => i !== delIndex)
              formik.setFieldValue('files', delfiles)
            }}
          />
        </>
      ) : (
        <p>
          <span style={{ color: 'red' }}>Note:</span> if no (we will upload synopsis now, however Please get back to us
          by email <a href='mailto:U9QpA@example.com'>research.jas20@gmail.com</a> , when you have copyright permission
          to upload?)
        </p>
      )}
      <div>
        <LoadingButton
          size='large'
          type='submit'
          variant='contained'
          sx={{ marginBottom: 7, display: 'block', margin: '2% auto', width: '200px', backgroundColor: '#036A85' }}
          loading={createResearchPaperLoading1}
          disabled={formik.isSubmitting}
        >
          Submit
        </LoadingButton>
      </div>
    </>
  )
}

export default FileComponent
