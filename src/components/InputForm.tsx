import React, { useState } from "react";
import "./InputForm.css";

export interface FormData {
  resume: string;
  jobDescription: string;
  salaryExpectation: number;
  seniority: string;
  workPreference: string;
}

export default function InputForm({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    resume: "",
    jobDescription: "",
    salaryExpectation: 70000,
    seniority: "Mid",
    workPreference: "Hybrid",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salaryExpectation" ? +value : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid =
    formData.resume.trim() !== "" &&
    formData.jobDescription.trim() !== "" &&
    formData.salaryExpectation > 0 &&
    formData.seniority.trim() !== "" &&
    formData.workPreference.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <label>
        Resume:
        <textarea
          name="resume"
          rows={6}
          placeholder="Paste your resume here"
          value={formData.resume}
          onChange={handleChange}
        />
      </label>

      <label>
        Job Description:
        <textarea
          name="jobDescription"
          rows={6}
          value={formData.jobDescription}
          placeholder="Paste the job description here"
          onChange={handleChange}
        />
      </label>

      <label>
        Salary Expectation (CAD):
        <input
          type="number"
          name="salaryExpectation"
          value={formData.salaryExpectation}
          onChange={handleChange}
        />
      </label>

      <div className="form-row">
        <fieldset>
          <legend>Seniority Level:</legend>
          {["Entry", "Mid", "Senior", "Lead"].map((level) => (
            <label key={level}>
              <input
                type="radio"
                name="seniority"
                value={level}
                checked={formData.seniority === level}
                onChange={handleChange}
              />
              {level}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Work Preference:</legend>
          {["Remote", "Hybrid", "On-site"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="workPreference"
                value={option}
                checked={formData.workPreference === option}
                onChange={handleChange}
              />
              {option}
            </label>
          ))}
        </fieldset>
      </div>

      <button type="submit" disabled={!isFormValid}>
        Tailor My Resume
      </button>
    </form>
  );
}
