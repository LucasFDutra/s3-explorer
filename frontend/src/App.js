import Header from './pages/header'
import BucketSelector from './pages/bucket_selector'
import FilesBoard from './pages/files_board'
import './App.css'

function App() {
  return (
    <>
      <Header/>
      <main>
        <BucketSelector/>
        <FilesBoard/>
      </main>
    </>
  );
}


export default App;
