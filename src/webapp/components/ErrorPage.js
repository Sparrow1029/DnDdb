import Error from 'next/error'
import { useRouter } from 'next/router'

import { Button } from 'semantic-ui-react'

let buttonStyle = {
  position: 'absolute',
  top: '75%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}

export default function ErrorPage({ error, resetErrorBoundary, componentStack }) {
  const router = useRouter()

  const handleReset = () => {
    console.log(componentStack)
    resetErrorBoundary()
    router.back()
  }

  return (
    <div>
    <Error statusCode={error.status || 500} title={error.message || 'THE GODS ARE ANGERED'} />
      <Button primary onClick={handleReset} style={buttonStyle}>Go back</Button>
    </div>
  )
}
