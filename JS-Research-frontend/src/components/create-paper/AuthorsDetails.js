import { Autocomplete, Grid, TextField, Typography } from '@mui/material'
import Divider from '@mui/material/Divider'

function AuthorsDetails({
  formik,
  setInputJournalName,
  setInputOfficialUrl,
  inputJournalName,
  inputOfficialUrl,
  inputISSN,
  setInputISSN,
  handleISSN,
  handleOfficialUrl,
  formatISSN,
  handlejournalName
}) {
  return (
    <>
      <Typography sx={{ margin: '25px 0px' }} variant='h6'>
        Is this article listed on any official websites? If yes then please provide Details
      </Typography>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id='journalName'
            name='journalName'
            multiple
            freeSolo
            options={formik.values.journalName || []}
            value={formik.values.journalName || []}
            inputValue={inputJournalName || ''}
            onInputChange={(event, newInputValue) => {
              setInputJournalName(newInputValue.trimStart())
            }}
            onBlur={e => handlejournalName(formik, e.target.value)}
            onChange={(event, newValue) => {
              formik.setFieldValue('journalName', newValue)
            }}
            renderInput={params => (
              <TextField {...params} label='Journal Name(Optional)' placeholder='Enter journalName' />
            )}
          />

          {formik.touched.journalName && formik.errors.journalName && (
            <div style={{ color: 'red' }}>{formik.errors.journalName}</div>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id='officialUrl'
            name='officialUrl'
            multiple
            freeSolo
            options={formik.values.officialUrl || []}
            value={formik.values.officialUrl || []}
            inputValue={inputOfficialUrl || ''}
            onInputChange={(event, newInputValue) => {
              setInputOfficialUrl(newInputValue.trimStart())
            }}
            onBlur={e => handleOfficialUrl(formik, e.target.value)}
            onChange={(event, newValue) => {
              formik.setFieldValue('officialUrl', newValue)
            }}
            renderInput={params => (
              <TextField {...params} label='Official URL(Optional)' placeholder='Enter Official Url' />
            )}
          />

          {formik.touched.officialUrl && formik.errors.officialUrl && (
            <div style={{ color: 'red' }}>{formik.errors.officialUrl}</div>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id='issn'
            name='issn'
            multiple
            freeSolo
            options={formik.values.issn || []}
            value={formik.values.issn || []}
            inputValue={inputISSN || ''}
            onInputChange={(event, newInputValue) => {
              const issn = formatISSN(newInputValue)
              setInputISSN(issn)
            }}
            onBlur={e => handleISSN(formik, e.target.value)}
            onChange={(event, newValue) => {
              formik.setFieldValue('issn', newValue)
            }}
            renderInput={params => <TextField {...params} label='ISSN Number (Optional)' placeholder='Enter ISSN' />}
          />

          {formik.touched.issn && formik.errors.issn && <div style={{ color: 'red' }}>{formik.errors.issn}</div>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            minRows={1}
            type='text'
            label='ISBN (Optional)'
            name='isbn'
            value={formik.values.isbn}
            onChange={event => {
              const trimmedValue = event.target.value.replace(/^\s+/g, '')
              formik.setFieldValue('isbn', trimmedValue)
            }}
          />

          {formik.touched.isbn && formik.errors.isbn && <div style={{ color: 'red' }}>{formik.errors.isbn}</div>}
        </Grid>
      </Grid>

      <Divider sx={{ marginTop: '25px' }} />
      <Typography sx={{ margin: '25px 0px' }} variant='h5'>
        Main Author's Details
      </Typography>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type='text'
            label="Main Author's Contact Number *"
            name='contactNumber'
            value={formik.values.contactNumber}
            onChange={formik.handleChange}
          />

          {formik.touched.contactNumber && formik.errors.contactNumber && (
            <div style={{ color: 'red' }}>{formik.errors.contactNumber}</div>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            sx={{}}
            type='text'
            label="Main Author's Email *"
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
          />

          {formik.touched.email && formik.errors.email && <div style={{ color: 'red' }}>{formik.errors.email}</div>}
        </Grid>
      </Grid>
    </>
  )
}

export default AuthorsDetails
