
import './App.css';
import UsersList from './components/UsersList';

function App() {
  return (
    <div className="App">
        <div  style={{display:'flex', justifyContent:'space-around', gap:'20px', padding:'10px'}}> 
        <UsersList/>
      </div>
    </div>
  );
}

export default App;
