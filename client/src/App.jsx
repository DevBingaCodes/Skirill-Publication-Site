import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Articles from "./pages/Articles"
import Article from "./pages/Article"
import About from "./pages/About"
import Home from "./pages/Home"
import SubscribeNewsletter from "./pages/SubscribeNewsletter"
import VerifyEmail from "./pages/VerifyEmail"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/article/:id" element={<Article/>}/>
        <Route path="/newsletter/subscribe" element={<SubscribeNewsletter/>}/>
        <Route path="/newsletter/verify-email" element={<VerifyEmail/>}/>
        <Route path="/verify-email" element={<VerifyEmail/>}/>
      </Routes>
    </Router>
  )
}

export default App
