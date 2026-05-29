import { RouterProvider } from 'react-router-dom'
import { ServiceProvider } from '@/providers/service-context'
import { router } from '@/routing/router'

export function App() {
  return (
    <div className='w-screen h-screen overflow-y-aut text-app-text bg-app-background font-body'>
      <ServiceProvider>
        <RouterProvider router={router} />
      </ServiceProvider>
    </div>
  )
}
