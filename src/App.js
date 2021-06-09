import Reservations from './reservations/Reservations'
import './App.css';

function App() {
  const fillTest = async (params) => {
    await fetch('http://localhost:8000/api/test-data/')
      .then(response => {
        window.location.reload();
      })
  }

  return (
    <div>
      <nav className="navbar navbar-light navbar-expand-md navigation-clean-button">
        <div className="container">
          <img alt="HappyDogs Logo" src="./logo_dogs.png" /><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1" >
            <span className="visually-hidden">Toggle navigation</span>
            <span className="navbar-toggler-icon"></span></button>
          <div className="collapse navbar-collapse" id="navcol-1">
            <ul className="navbar-nav me-auto"></ul>
            <span className="navbar-text actions">
              <a className="btn btn-light action-button" style={{ background: "var(--bs-red)" }} role="button" onClick={fillTest}>Fill With Test Data</a>
              <a className="btn btn-light action-button" role="button" href="http://localhost:8000/admin" >Admin</a></span>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          <div className="col">
            <Reservations />
          </div>
        </div>
      </div>
      <br />
      <div className="container">
        <p className="text-center"><a href="https://github.com/MAkcanca/happydogs-interview" >Backend Source</a><br /></p>
        <p className="text-center" ><a href="https://github.com/MAkcanca/happydogs-interview-frontend" >Frontend Source</a></p>
      </div>
    </div>
  );
}

export default App;
