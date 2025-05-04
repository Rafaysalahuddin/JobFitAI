import { useRef } from "react";
import html2pdf from "html2pdf.js";
import "./OutputDisplay.css";

interface OutputDisplayProps {
  content: string;
}

export default function OutputDisplay({ content }: OutputDisplayProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleExportPDF = () => {
    if (!outputRef.current) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: "tailored-resume.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(outputRef.current)
      .save();
  };

  const matchFit = content.match(/Job Fit Score:\s*(\d(?:\.\d)?)/i);
  const matchSalary = content.match(
    /Salary Satisfaction(?: Rating)?:?\s*(\d(?:\.\d)?)/i
  );

  const fitScore = matchFit ? parseFloat(matchFit[1]) : null;
  const salaryScore = matchSalary ? parseFloat(matchSalary[1]) : null;

  const strippedContent = content
    .replace(/Job Fit Score:.*(\r?\n)?/i, "")
    .replace(/Salary Satisfaction.*(\r?\n)?/i, "");

  const formattedHTML = strippedContent
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[FILL IN:(.*?)\]/g, '<span class="fill-in">[FILL IN:$1]</span>');

  const renderStars = (score: number) => {
    const fullStars = "&#9733;".repeat(Math.round(score)); // ★
    const emptyStars = "&#9734;".repeat(5 - Math.round(score)); // ☆
    return (
      <span
        className="stars"
        dangerouslySetInnerHTML={{ __html: fullStars + emptyStars }}
      />
    );
  };

  return (
    <div className="output-display">
      <div className="toolbar">
        <button onClick={handleCopy}>📋 Copy All</button>
        <button onClick={handleExportPDF}>📄 Export to PDF</button>
      </div>

      <div ref={outputRef}>
        {fitScore !== null && (
          <div className="score-row">
            <strong>Job Fit Score:</strong> {renderStars(fitScore)}
          </div>
        )}

        {salaryScore !== null && (
          <div className="score-row">
            <strong>Salary Satisfaction:</strong> {renderStars(salaryScore)}
          </div>
        )}

        <div
          className="output-content"
          dangerouslySetInnerHTML={{ __html: formattedHTML }}
        />
      </div>
    </div>
  );
}
