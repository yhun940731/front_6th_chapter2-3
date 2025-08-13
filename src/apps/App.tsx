import { BrowserRouter as Router } from 'react-router-dom';

import PostsManagerPage from '../pages/PostsManagerPage.tsx';
import Footer from '../widgets/Footer/index.tsx';
import Header from '../widgets/Header/index.tsx';

const App = () => {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <PostsManagerPage />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
