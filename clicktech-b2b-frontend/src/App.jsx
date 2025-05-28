
import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import Footer from './components/Footer'

function App() {
  

  return (
  <>
  <Header />
  <main className='min-h-[100vh]'>
    <Outlet />
  </main>
  
  <Footer />
  </>
  
  )
}

export default App
