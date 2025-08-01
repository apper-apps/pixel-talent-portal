import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import JobPostings from "@/components/pages/JobPostings";
import Applications from "@/components/pages/Applications";
import Candidates from "@/components/pages/Candidates";
import Clients from "@/components/pages/Clients";
import ClientDetail from "@/components/pages/ClientDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
<Route path="/" element={<Layout />}>
            <Route index element={<JobPostings />} />
            <Route path="applications/*" element={<Applications />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<ClientDetail />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;