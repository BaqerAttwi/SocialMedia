import FormSignup from "./Component/Register/SignUP";
import {BrowserRouter,Routes,Route,} from "react-router-dom";
import LoginForm from "./Component/Register/Login";
import UpdateForm from "./Component/Register/EditProfile";
import ContentModeration from "./Component/PostFolder/PostConfig";
import PostList from "./Component/PostFolder/PostService";
import GlobalPage from "./Component/PostFolder/GlobalPage";
import PostDetail from "./Component/PostFolder/PostDetail";
import UserProfile from "./Component/PostFolder/UserProfile";
import HomePage from "./Component/PostFolder/FreindsPage";
function App() {
  return (
    <div className="App">
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<FormSignup/>} /> 
  <Route path="/Login" element={<LoginForm/>} /> 
  <Route path="/EditP" element={<UpdateForm/>} />
  <Route path="/POst" element={<ContentModeration/>} />
  <Route path="/viewUserPRofile" element={<PostList/>} />
  <Route path="/GlobalPage" element={<GlobalPage/>} />
  <Route path="/PostDetail/:id" element={<PostDetail />} />
  <Route path="/UserProfile/:userId" element={<UserProfile />} />
  <Route path="/Home" element={<HomePage />} />
  </Routes>
  </BrowserRouter>
    </div>
  );
}
export default App;
