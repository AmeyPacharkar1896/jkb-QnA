import React, { useState } from 'react';
import questions from '../data/questions.json';
import { submitForm } from '../api/form_submit.js';

export default function FormPage() {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (idx, value) => {
    setAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const handleCheckbox = (idx, option, checked, limit) => {
    const prev = answers[idx] || [];
    let updated = checked
      ? [...prev, option]
      : prev.filter(o => o !== option);

    if (limit && updated.length > limit) return;

    setAnswers(prevState => ({
      ...prevState,
      [idx]: updated
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const name = answers[0] || '';
    const email = answers[1] || '';
    const contact = answers[2] || '';
    const address = answers[3] || '';

    const questionsOnly = questions.slice(4).map((q, i) => ({
      question: q.question,
      answer: q.answerType === 'checkbox' ? answers[i + 4] || [] : answers[i + 4] || ''
    }));

    const payload = { name, email, contact, address, questions: questionsOnly };

    try {
      const res = await submitForm(payload);
      const model = FormResponse.fromJson(res);
      navigate('/response', { state: { model } });
    } catch (err) {
      console.error(err);
      alert('Submission failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-sky-100 to-pink-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-xl p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-6 text-center">
          🎓 Student Discovery Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((q, idx) => {
            const checkboxLimit = q.question.toLowerCase().includes('pick up to 3') ? 3 : null;

            return (
              <div
                key={idx}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
              >
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  {`Q${idx + 1}. ${q.question}`}
                </label>

                {q.answerType === 'text' && (
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    required
                  />
                )}

                {q.answerType === 'email' && (
                  <input
                    type="email"
                    className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    required
                  />
                )}

                {q.answerType === 'tel' && (
                  <input
                    type='tel'
                    className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    required
                  />
                )}

                {q.answerType === 'paragraph' && (
                  <textarea
                    className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    rows="4"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    required
                  />
                )}

                {q.answerType === 'multiple_choice' && (
                  <div className="space-y-2 mt-2">
                    {q.options.map(opt => (
                      <label
                        key={opt}
                        className="flex items-center space-x-3 text-gray-700"
                      >
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={e => handleChange(idx, e.target.value)}
                          required
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.answerType === 'checkbox' && (
                  <div className="space-y-2 mt-2">
                    {q.options.map(opt => (
                      <label
                        key={opt}
                        className="flex items-center space-x-3 text-gray-700"
                      >
                        <input
                          type="checkbox"
                          value={opt}
                          checked={(answers[idx] || []).includes(opt)}
                          onChange={e =>
                            handleCheckbox(idx, opt, e.target.checked, checkboxLimit)
                          }
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                    {checkboxLimit && (
                      <p className="text-sm text-gray-500 italic mt-1">
                        (You can select up to {checkboxLimit})
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 text-lg rounded-full hover:bg-indigo-700 shadow-lg transition-all duration-300 cursor-pointer"
            >
              🚀 Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
