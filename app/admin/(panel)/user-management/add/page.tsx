import EditUserForm from '@/adminpanel/EditUserForm'
import React, { Suspense } from 'react'

function page() {
  return (
    <Suspense fallback={null}>
      <EditUserForm/>
    </Suspense>
  )
}

export default page
