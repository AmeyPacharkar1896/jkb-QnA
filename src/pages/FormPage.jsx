import React, { useState } from 'react';
import questions from '../data/questions.json';
import { submitForm } from '../api/form_submit.js';
import toastNotifications from '../toasts/toastNotifications.js';

const FormPage = () => {
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

    if (limit && updated.length > limit) {
      toastNotifications.error("You can select upto 3", "Select only your most favourute areas !")
      return
    };

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
      toastNotifications.success("Submission was succesfull");
    } catch (err) {
      console.error(err);
      setErrors(err);
      toastNotifications.error("Submission Failed !!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl px-6 sm:px-8 py-8 sm:py-10 border border-white/30">
        <h1 className="text-3xl font-extrabold text-center text-pink-600 mb-8 tracking-tight leading-snug drop-shadow-md">
          🎓 Student Discovery Form
          <span className="block text-base font-medium text-pink-500 mt-1">
            Let’s get to know you better!
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((q, idx) => {
            const checkboxLimit = q.question.toLowerCase().includes('pick up to 3') ? 3 : null;

            return (
              <div
                key={idx}
                className="p-4 bg-white/90 border border-gray-200 rounded-xl shadow hover:shadow-md transition duration-200"
              >
                <label className="block text-lg font-semibold text-blue-800 mb-4">
                  {`Q${idx + 1}. ${q.question}`}
                </label>

                {/* Text */}
                {q.answerType === 'text' && (
                  <input
                    type="text"
                    className="w-full bg-white/60 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    required
                  />
                )}

                {/* Email */}
                {q.answerType === 'email' && (
                  <input
                    type="email"
                    className="w-full bg-white/60 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    required
                  />
                )}

                {/* Telephone */}
                {q.answerType === 'tel' && (
                  <input
                    type="tel"
                    className="w-full bg-white/60 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    onInput={e => e.target.value = e.target.value.replace(/\D/g, '')}  // Only digits allowed
                    required
                  />
                )}

                {/* Paragraph */}
                {q.answerType === 'paragraph' && (
                  <textarea
                    rows="3"
                    className="w-full bg-white/60 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    required
                  />
                )}

                {/* Multiple Choice */}
                {q.answerType === 'multiple_choice' && (
                  <div className="space-y-2 mt-3">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-center space-x-2 text-gray-700 text-sm">
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={e => handleChange(idx, e.target.value)}
                          required
                          className="accent-pink-500 w-4 h-4"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Checkbox */}
                {q.answerType === 'checkbox' && (
                  <div className="space-y-2 mt-3">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-center space-x-2 text-gray-700 text-sm">
                        <input
                          type="checkbox"
                          value={opt}
                          checked={(answers[idx] || []).includes(opt)}
                          onChange={e => handleCheckbox(idx, opt, e.target.checked, checkboxLimit)}
                          className="accent-pink-500 w-4 h-4"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                    {checkboxLimit && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        (You can select up to {checkboxLimit})
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              🚀 Submit & Shine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default FormPage;