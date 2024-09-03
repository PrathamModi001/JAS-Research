import AuthLayout from 'src/layouts/AuthLayout'

import { useSelector } from 'react-redux'
import { selectUser } from 'src/redux/reducers/authSlice'
import GetResearchPaper from 'src/views/ResearchPaperComponents/getResearchPaper'

const Output = () => {
  const user = useSelector(selectUser)

  return (
    <AuthLayout pageName='dashboard'>
      <GetResearchPaper />
    </AuthLayout>
  )
}

export default Output
