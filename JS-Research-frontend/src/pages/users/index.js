import A_Users from 'src/container/A-Users'
import AuthLayout from 'src/layouts/AuthLayout'

const Output = () => {
  return (
    <AuthLayout pageName='users'>
      <A_Users />
    </AuthLayout>
  )
}

export default Output
