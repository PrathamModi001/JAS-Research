import { Autocomplete, Grid, TextField, Typography } from '@mui/material'
import { categories, itemType, languages } from 'src/shared/utility/helpers'

function BasicDetails({
  formik,
  inputKeyword,
  setInputAuthors,
  inputAuthors,
  allValues,
  handleAuthors,
  handleKeywords,
  setInputKeyword,
  handleOnChangeMainCategory
}) {
  return (
    <>
      <Typography sx={{ paddingBottom: '30px' }} variant='h5'>
        Basic Details
      </Typography>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            minRows={1}
            type='text'
            label='Title of the Research Paper/Thesis/Book *'
            {...formik.getFieldProps('title')}
          />
          {formik.touched.title && formik.errors.title && <div style={{ color: 'red' }}>{formik.errors.title}</div>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            minRows={1}
            type='text'
            label='Abstract/Synopsis of the Research Paper/Thesis/Book *'
            {...formik.getFieldProps('synopsis')}
          />
          {formik.touched.synopsis && formik.errors.synopsis && (
            <div style={{ color: 'red' }}>{formik.errors.synopsis}</div>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id='authors'
            name='authors'
            multiple
            freeSolo
            options={formik.values.authors || []}
            value={formik.values.authors || []}
            inputValue={inputAuthors || ''}
            onInputChange={(event, newInputValue) => {
              setInputAuthors(newInputValue.trimStart())
            }}
            onBlur={e => handleAuthors(formik, e.target.value)}
            onChange={(event, newValue) => {
              formik.setFieldValue('authors', newValue)
            }}
            renderInput={params => (
              <TextField
                {...params}
                label='Authors/Editors of the Research paper/Thesis/Book *'
                placeholder='Enter author names'
              />
            )}
          />

          {formik.touched.authors && formik.errors.authors && (
            <div style={{ color: 'red' }}>{formik.errors.authors}</div>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <div>
            <Autocomplete
              id='keywords'
              name='keywords'
              multiple
              freeSolo
              options={formik.values.keywords || []}
              value={formik.values.keywords || []}
              inputValue={inputKeyword || ''}
              onInputChange={(event, newInputValue) => {
                setInputKeyword(newInputValue.trimStart())
              }}
              onBlur={e => handleKeywords(formik, e.target.value)}
              onChange={(event, newValue) => formik.setFieldValue('keywords', newValue)}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Keywords of the Research paper/Thesis/Book *'
                  placeholder='Enter Keywords'
                />
              )}
            />
            {formik.touched.keywords && formik.errors.keywords && (
              <div style={{ color: 'red' }}>{formik.errors.keywords}</div>
            )}
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id='language'
            options={languages || []}
            {...formik.getFieldProps('language')}
            onChange={(event, value) => formik.setFieldValue('language', value)}
            renderInput={params => <TextField {...params} label='Language of Paper/Thesis/Book *' />}
          />
          {formik.touched.language && formik.errors.language && (
            <div style={{ color: 'red' }}>{formik.errors.language}</div>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type='text'
            label='Year of Publication *'
            {...formik.getFieldProps('yearOfPublication')}
          />
          {formik.touched.yearOfPublication && formik.errors.yearOfPublication && (
            <div style={{ color: 'red' }}>{formik.errors.yearOfPublication}</div>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            id='mainCategories'
            options={Object.keys(categories) || []}
            value={formik.values.mainCategories}
            onChange={(event, value) => {
              formik.setFieldValue('mainCategories', value)
              if (value.length === 0) {
                formik.setFieldValue('subCategories', [])
              }
              handleOnChangeMainCategory(event, value)
            }}
            renderInput={params => <TextField {...params} label='Main Categories *' />}
          />
          {formik.touched.mainCategories && formik.errors.mainCategories && (
            <div style={{ color: 'red' }}>{formik.errors.mainCategories}</div>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            id='subCategories'
            options={allValues || []}
            value={formik.values.subCategories || []}
            onChange={(event, value) => formik.setFieldValue('subCategories', value)}
            renderInput={params => <TextField {...params} label='Sub Categories' />}
          />
          {formik.touched.subCategories && formik.errors.subCategories && (
            <div style={{ color: 'red' }}>{formik.errors.subCategories}</div>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth type='text' label='DOI (Optional)' {...formik.getFieldProps('doi')} />
          {formik.touched.doi && formik.errors.doi && <div style={{ color: 'red' }}>{formik.errors.doi}</div>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id='itemType'
            options={itemType || []}
            {...formik.getFieldProps('itemType')}
            onChange={(event, value) => formik.setFieldValue('itemType', value)}
            renderInput={params => <TextField {...params} label='Item Type *' />}
          />
          {formik.touched.itemType && formik.errors.itemType && (
            <div style={{ color: 'red' }}>{formik.errors.itemType}</div>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default BasicDetails
