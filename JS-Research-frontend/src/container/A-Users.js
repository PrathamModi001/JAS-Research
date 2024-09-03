// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import UserTable from 'src/views/tables/UserTable'

const Users = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UserTable />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Users
