import { useState } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../data/questions.json";
import { submitForm } from "../api/form_submit.js";
import toastNotifications from "../toasts/toastNotifications.js";

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
    <div className="min-h-screen p-6 flex items-center justify-center bg-[#040c11]">
      <div className="w-full max-w-lg sm:max-w-2xl rounded-xl border border-gray-700 shadow-lg p-8 bg-[#0c171d]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 text-[#f98b24]">
          🎓 Career Discovery Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 text-white">
          {questions.map((q, idx) => {
            const limit = q.question.toLowerCase().includes('up to 3') ? 3 : null;
            return (
              <div key={idx} className="rounded-lg border border-gray-700 p-4 bg-[#0c171d]">
                <label className="block text-lg sm:text-xl font-semibold mb-2">
                  Q{idx + 1}. {q.question}
                </label>
                {['text', 'email'].includes(q.answerType) && (
                  <input
                    type={q.answerType}
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    className="w-full border border-gray-600 bg-transparent rounded-md px-4 py-2 focus:outline-none focus:ring-2 text-white"
                    placeholder="Type your answer..."
                    required
                  />
                )}
                {q.answerType  === 'tel' && (
                  <input
                  type={q.answerType}
                  value={answers[idx] || ''}
                  onChange={e => handleChange(idx, e.target.value)}
                  onInput={e => e.target.value = e.target.value.replace(/\D/g, '')}
                  className="w-full border border-gray-600 bg-transparent rounded-md px-4 py-2 focus:outline-none focus:ring-2 text-white"
                  placeholder="Type your answer..."
                  required
                />
                )}
                {q.answerType === 'paragraph' && (
                  <textarea
                    rows="3"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                    className="w-full border border-gray-600 bg-transparent rounded-md px-4 py-2 focus:outline-none focus:ring-2 text-white"
                    placeholder="Type your answer..."
                    required
                  />
                )}
                {q.answerType === 'multiple_choice' && (
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={e => handleChange(idx, e.target.value)}
                          className="focus:ring-2"
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
                      <label key={opt} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={opt}
                          checked={(answers[idx] || []).includes(opt)}
                          onChange={e => handleCheckbox(idx, opt, e.target.checked, limit)}
                          className="focus:ring-2"
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
              className="px-6 py-3 rounded-full font-semibold text-white hover:brightness-110 transition bg-[#f98b24]"
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
