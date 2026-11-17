import { Navigate,Route,Routes } from 'react-router-dom';
import { AuthProvider,useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
import AllEntries from './pages/AllEntries';
import EntryDetails from './pages/EntryDetails';
import EditEntry from './pages/EditEntry';
import CalendarPage from './pages/CalendarPage';
import Memories from './pages/Memories';
import WeeklyReflection from './pages/WeeklyReflection';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
function AppRoutes(){const{user}=useAuth();return <div className="app"><span className="float a">✦</span><span className="float b">♡</span><span className="float c">✿</span><span className="float d">☁</span><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={user?<Navigate to="/dashboard" replace/>:<Login/>}/><Route path="/signup" element={user?<Navigate to="/dashboard" replace/>:<Signup/>}/><Route element={<ProtectedRoute/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/entries" element={<AllEntries/>}/><Route path="/entries/new" element={<NewEntry/>}/><Route path="/entries/:id" element={<EntryDetails/>}/><Route path="/entries/:id/edit" element={<EditEntry/>}/><Route path="/calendar" element={<CalendarPage/>}/><Route path="/memories" element={<Memories/>}/><Route path="/weekly-reflection" element={<WeeklyReflection/>}/><Route path="/profile" element={<Profile/>}/></Route><Route path="*" element={<NotFound/>}/></Routes></div>}
export default function App(){return <AuthProvider><AppRoutes/></AuthProvider>}
