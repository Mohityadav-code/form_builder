import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormBuilder from './FormBuilder';
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<FormBuilder />} />
          <Route path="/add" element={<FormBuilder />} />
          <Route path="/form/:id" element={<FormBuilder />} />
          <Route path="/form/:id/edit" element={<FormBuilder />} />
          <Route path="/form/:id/view" element={<FormBuilder />} />
          <Route path="/form/:id/share" element={<FormBuilder />} />
          <Route path="/form/:id/delete" element={<FormBuilder />} />
          <Route path="/form/:id/public/preview" element={<FormBuilder />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
