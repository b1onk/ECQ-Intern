// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '/src/pages/Home.jsx';
import Search from '/src/pages/Search.jsx';
import Login from '/src/pages/Login.jsx';
import PrivateRoute from '/src/components/PrivateRoutes.jsx';
import Layout from '/src/components/Layout.jsx';
import PopularMovies from "./pages/PopularMovies";
import PopularTV from "./pages/PopularTV"
import PopularPeople from "./pages/PopularPeople";
import PersonDetail from "./pages/PersonDetail";
import UpcomingMovies from './pages/UpcomingMovies';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/search/:query"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />

          <Route
            path="/movies/popular"
            element={
              <PrivateRoute>
                <PopularMovies />
              </PrivateRoute>
            }
          />

          <Route
            path="/tv-shows"
            element={
              <PrivateRoute>
              <PopularTV />
              </PrivateRoute>
            }
          />

          <Route
            path="/people/popular"
            element={
              <PrivateRoute>
              <PopularPeople />
              </PrivateRoute>
            }
          />

          <Route
            path="/person/:id"
            element={
             <PrivateRoute>
             <PersonDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/movies/upcoming"
            element={
              <PrivateRoute>
              <UpcomingMovies />
              </PrivateRoute>
            }
          />



        </Route>
      </Routes>
    </Router>
  );
}

export default App;
