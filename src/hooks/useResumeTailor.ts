import { useState } from "react";
import { FormData } from "../components/InputForm";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export function useResumeTailor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError("");
    setResult("");

    const {
      resume,
      jobDescription,
      salaryExpectation,
      seniority,
      workPreference,
    } = formData;

    const prompt = `
You are an expert resume writer and career advisor.

Given the resume and job description below, perform the following:

1. **Rewrite each resume bullet point individually in a STAR-like sentence style** (incorporating Situation, Task, Action, and Result **within a single line**).  
   - Do **not** break the bullet points into separate STAR components.
   - Maintain the same structure of bullets as the input.   
   - If information is missing (e.g., metrics, outcomes), insert [FILL IN: ...] to indicate where the candidate should customize.
   - If a rewritten bullet is especially aligned to the job description, wrap the entire bullet in **bold**.
   - Always bold at least a few bullets that are most relevant or could be reframed as strong job fits, even if the overall match is limited. This ensures clear visual emphasis in the output.

2. If a **Skills** or **Education** section is present in the resume, bold any skill or education item that is especially relevant to the job description.

3. Provide a **Job Fit Score out of 5 stars**, and explain briefly why the candidate is or is not a strong match.

4. Estimate a **salary range in CAD** based on:
   - The job description
   - The candidate’s stated salary expectations
   - The seniority level
   - The work-from-home preference

5. Based on the candidate's salary expectation and your estimated range, assign a **Salary Satisfaction Rating out of 5 stars** using the following scale:
   - 5 stars: meets or exceeds expectation
   - 4 stars: 90–99% of expectation
   - 3 stars: 80–89% of expectation
   - 2 stars: 70–79%
   - 1 star: below 70%

6. Underneath the job fit score, include a line that evaluates whether the candidate's stated work preference (e.g., Remote, Hybrid, On-site) aligns with what’s mentioned in the job description. 
  - If the job description contains work preference info, say whether there’s a match or not.
  - If the job description does **not** specify a work preference, clearly note that such information is missing.

Resume:
${resume}

Job Description:
${jobDescription}

Candidate Salary Expectation: ${salaryExpectation}
Seniority Level: ${seniority}
Work Preference: ${workPreference}
    `.trim();

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert career advisor and resume writer.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      });

      const data = await res.json();

      if (data.choices?.[0]?.message?.content) {
        setResult(data.choices[0].message.content);
      } else {
        setError("No valid response received from OpenAI.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while contacting OpenAI.");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setResult("");
    setError("");
  };

  return {
    loading,
    result,
    error,
    handleSubmit,
    handleReset,
  };
}
