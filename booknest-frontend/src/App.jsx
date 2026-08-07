import { Routes, Route } from 'react-router-dom';
import { TopNav } from './components/layout/TopNav.jsx';
import { MobileTopBar } from './components/layout/MobileTopBar.jsx';
import { BottomNav } from './components/layout/BottomNav.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Discover from './pages/Discover.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import CreateListing from './pages/CreateListing.jsx';
import Wishlist from './pages/Wishlist.jsx';
import MyBooks from './pages/MyBooks.jsx';
import Messages from './pages/Messages.jsx';
import Notifications from './pages/Notifications.jsx';
import Requests from './pages/Requests.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';
import { AdminRoute } from './routes/AdminRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

function App() {
  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      <MobileTopBar />
      {/* pb-16 on mobile clears the fixed BottomNav; md:pb-0 removes it on desktop */}
      <div className="pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/requests" element={<Requests />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:id" element={<Profile />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-books"
            element={
              <ProtectedRoute>
                <MyBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:id"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          {/* Remaining routes (requests, profile, notifications, admin)
              are added here as each page is built, following the same
              pattern. */}
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default App;
