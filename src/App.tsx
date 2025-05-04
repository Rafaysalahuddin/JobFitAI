import "./App.css";
import InputForm from "./components/InputForm.tsx";
import OutputDisplay from "./components/OutputDisplay.tsx";
import { useResumeTailor } from "./hooks/useResumeTailor.ts";

function App() {
  const { loading, result, error, handleSubmit, handleReset } =
    useResumeTailor();

  return (
    <div className="app-container">
      {!loading && (
        <div className="logo-container">
          <img src="/JobFitLogo.png" className="logo" alt="JobFit AI Logo" />
        </div>
      )}

      {loading ? (
        <div className="loading-skeleton">Generating tailored resume...</div>
      ) : result ? (
        <>
          <button onClick={handleReset} className="back-button">
            🔙 Back to Form
          </button>
          <OutputDisplay content={result} />
        </>
      ) : (
        <>
          <InputForm onSubmit={handleSubmit} />
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
}

export default App;
