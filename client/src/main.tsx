import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import Store from './store/Store.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import SignInForm from './pages/SigninForm.tsx'
import SignUpForm from './pages/SignUpForm.tsx'
import AuthLayout from './components/Authlayout/AuthLayout.tsx'
import Profile from './pages/Profile.tsx'
import YouTubeWatchPage from './pages/YoutubeWatchPage.tsx'
import UploadVideo from './pages/UploadVideo.tsx'
import Settings from './pages/Settings.tsx'




const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/Home",
        element: <Home />
      },
      {
        path: '/sign-in',
        element: (
          <AuthLayout authentication={false}>
            <SignInForm />
          </AuthLayout>
        )
      },
      {
        path: '/sign-up',
        element: (
          <AuthLayout authentication={false}>
            <SignUpForm />
          </AuthLayout>
        )
      },
      {
        path: '/upload-video',
        element: (
          <AuthLayout authentication>
            <UploadVideo />
          </AuthLayout>
        )
      },
      {
        path: 'my-profile/:username',
        element: <Profile />
      },
      {
        path: 'setting-page',
        element: (
          <AuthLayout authentication>
            <Settings />
          </AuthLayout>
        )
      },
      {
        path: 'watch/:id',
        element: (
          <AuthLayout authentication>
            <YouTubeWatchPage />
          </AuthLayout>
        )
      }
    ]
  }
])





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={Store}>
      <RouterProvider router={route} />
    </Provider>
  </StrictMode>,
)
