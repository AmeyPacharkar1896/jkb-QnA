import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../data/questions.json';
import { submitForm } from '../api/form_submit.js';
import toastNotifications from '../toasts/toastNotifications.js';

const FormPage = () => {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleChange = (idx, value) =>
    setAnswers(prev => ({ ...prev, [idx]: value }));

  const handleCheckbox = (idx, option, checked, limit) => {
    const prev = answers[idx] || [];
    let updated = checked ? [...prev, option] : prev.filter(o => o !== option);
    if (limit && updated.length > limit) {
      toastNotifications.error(
        `You can select up to ${limit} options only.`,
        'Pick your top preferences.'
      );
      return;
    }
    setAnswers(prev => ({ ...prev, [idx]: updated }));
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
      const response = await submitForm(payload);
      toastNotifications.success('Submission successful!');
      navigate('/response', { state: { model: response } });
    } catch (err) {
      toastNotifications.error('Submission failed', err.message || '');
    }
  };

  return (
    <div className="min-h-screen bg-dark-background p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-dark-surface rounded-xl border border-dark-border shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-dark-primary mb-6">
          🎓 Student Discovery Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, idx) => {
            const limit = q.question.toLowerCase().includes('up to 3') ? 3 : null;
            return (
              <div
                key={idx}
                className="bg-dark-background rounded-lg border border-dark-border p-4"
              >
                <label className="block text-lg font-semibold text-dark-text mb-2">
                  Q{idx + 1}. {q.question}
                </label>
                {['text','email','tel'].includes(q.answerType) && (
                  <input
                    type={q.answerType}
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    className="w-full bg-dark-surface border border-dark-border rounded-md px-4 py-2 text-dark-text placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-dark-secondary"
                    placeholder="Type your answer..."
                    required
                  />
                )}
                {q.answerType === 'paragraph' && (
                  <textarea
                    rows="3"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    className="w-full bg-dark-surface border border-dark-border rounded-md px-4 py-2 text-dark-text placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-dark-secondary"
                    placeholder="Type your answer..."
                    required
                  />
                )}
                {q.answerType === 'multiple_choice' && (
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-center space-x-2 text-dark-text">
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={e => handleChange(idx, e.target.value)}
                          className="text-dark-secondary focus:ring-dark-secondary"
                          required
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.answerType === 'checkbox' && (
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-center space-x-2 text-dark-text">
                        <input
                          type="checkbox"
                          value={opt}
                          checked={(answers[idx] || []).includes(opt)}
                          onChange={e => handleCheckbox(idx, opt, e.target.checked, limit)}
                          className="text-dark-secondary focus:ring-dark-secondary"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="text-center">
            <button
              type="submit"
              className="bg-dark-secondary text-dark-background px-6 py-3 rounded-full font-semibold hover:bg-dark-primary transition"
            >
              🚀 Submit & Shine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
