import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import ScrollToHash from './components/ScrollToHash.jsx'
import Home from './pages/Home.jsx'
import MemberProfile from './pages/MemberProfile.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <>
      <ScrollToHash />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/member/:slug" element={<MemberProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App