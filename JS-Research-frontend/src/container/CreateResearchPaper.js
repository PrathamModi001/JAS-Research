// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import CreateResearchPaper from 'src/views/ResearchPaperComponents/createResearchPaper'

const ResearchPaper = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CreateResearchPaper />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default ResearchPaper
