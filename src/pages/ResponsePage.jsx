import { useLocation, useNavigate } from 'react-router-dom';

const convertPlainLinks = (text) => {
  return text.replace(/\[([^\]]+)\]\((.*?)\)/g, (_, label, url) => {
    if (label.match(/^(www\.|https?:\/\/)/)) {
      return label.replace(/^https?:\/\//, '');
    }
    return label;
  });
};

export default function ResponsePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const model = state?.model;

  if (!model || !model.success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#040c11]">
        <div className="rounded-xl border border-gray-700 shadow-lg p-8 text-center max-w-lg bg-[#0c171d]">
          <h2 className="text-2xl font-bold text-red-500">No Response Found</h2>
          <p className="mt-4 text-white">Oops! Looks like something went wrong.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 text-white rounded-full bg-[#f98b24] hover:brightness-110 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const rawText = model.result || '';
  const cleaned = convertPlainLinks(rawText.replace(/\*\*/g, ''));
  const sections = cleaned
    .split('\n\n')
    .map(s => s.trim())
    .filter(Boolean);

  const renderParagraph = (title, body, color) => (
    <div key={title}>
      <h2 className={`text-2xl font-bold ${color} mb-2`}>{title}</h2>
      <p className="text-white whitespace-pre-wrap">{body}</p>
    </div>
  );

  const renderList = (lines, color, isOrdered) => {
    const Tag = isOrdered ? 'ol' : 'ul';
    const className = isOrdered
      ? 'list-decimal list-inside text-white space-y-1'
      : 'list-disc list-inside text-white space-y-1';

    return (
      <Tag className={className}>
        {lines.map((raw, i) => {
          const text = raw.replace(/^\*\s?/, '').replace(/^\d+\.\s+/, '');
          return <li key={i}>{text}</li>;
        })}
      </Tag>
    );
  };

  const renderSection = (section, idx) => {
    if (section.startsWith('Best Career Option:')) {
      return renderParagraph(
        '🎯 Best Career Option',
        section.replace('Best Career Option:', '').trim(),
        'text-[#f98b24]'
      );
    }

    if (section.startsWith('Alternate Career Option:')) {
      return renderParagraph(
        '🔄 Alternate Career Option',
        section.replace('Alternate Career Option:', '').trim(),
        'text-[#f98b24]'
      );
    }

    if (section.startsWith('Industry Overview')) {
      const lines = section.split('\n').slice(1).filter(l => l.startsWith('* '));
      if (lines.length) {
        return (
          <div key={idx}>
            <h2 className="text-2xl font-bold text-[#f98b24] mb-2">📊 Industry Overview</h2>
            {renderList(lines, 'text-[#f98b24]', true)} {/* Ordered list */}
          </div>
        );
      }
      return renderParagraph(
        '📊 Industry Overview',
        section.replace(/^Industry Overview.*?:/, '').trim(),
        'text-[#f98b24]'
      );
    }

    if (section.startsWith('Top Institutes')) {
      const match = section.match(/Top Institutes\s*(?:\((.*?)\))?:/);
      const label = match && match[1] ? ` (${match[1]})` : '';
      const lines = section.split('\n').slice(1).filter(Boolean);
      return (
        <div key={idx}>
          <h2 className="text-2xl font-bold text-[#f98b24] mb-2">
            🏛️ Top Institutes{label}
          </h2>
          {renderList(lines, 'text-[#f98b24]', true)} {/* Ordered list */}
        </div>
      );
    }

    if (section.startsWith('Preparation Plan')) {
      const match = section.match(/Preparation Plan\s*(?:\((.*?)\))?:/);
      const label = match && match[1] ? ` (${match[1]})` : '';
      const lines = section.split('\n').slice(1).filter(Boolean);
      return (
        <div key={idx}>
          <h2 className="text-2xl font-bold text-[#f98b24] mb-2">
            🧭 Preparation Plan{label}
          </h2>
          {renderList(lines, 'text-[#f98b24]', true)} {/* Ordered list */}
        </div>
      );
    }

    if (section.startsWith('Entrance Tests')) {
      const lines = section.split('\n').slice(1).filter(Boolean);
      return (
        <div key={idx}>
          <h2 className="text-2xl font-bold text-[#f98b24] mb-2">📝 Entrance Tests</h2>
          {renderList(lines, 'text-[#f98b24]', true)} {/* Ordered list */}
        </div>
      );
    }

    if (section.startsWith('Eligibility and Admission Criteria:')) {
      return renderParagraph(
        '🎓 Eligibility Criteria',
        section.replace('Eligibility and Admission Criteria:', '').trim(),
        'text-[#f98b24]'
      );
    }

    if (/^User-Centric/i.test(section)) {
      return renderParagraph(
        '🙋 User‑Centric Advice',
        section.replace(/^User-Centric.*?:/, '').trim(),
        'text-[#f98b24]'
      );
    }

    if (section.startsWith('DISCLAIMER:')) {
      return (
        <div key={idx}>
          <h2 className="text-sm font-semibold text-gray-500 mt-4">⚠️ Disclaimer</h2>
          <p className="text-white text-sm">
            {section.replace('DISCLAIMER:', '').trim()}
          </p>
        </div>
      );
    }

    return (
      <p key={idx} className="whitespace-pre-wrap text-white">
        {section}
      </p>
    );
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-[#040c11]">
      <div className="rounded-3xl border border-gray-700 shadow-lg p-8 w-full max-w-4xl space-y-8 bg-[#0c171d]">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-2 text-[#f98b24]">
            🎉 Your Personalized Career Report
          </h1>
          <p className="text-white">
            Based on your responses, here’s our recommendation for your future career journey:
          </p>
        </div>

        <div className="space-y-6">{sections.map(renderSection)}</div>

        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-8 py-3 text-white rounded-full bg-[#f98b24] hover:brightness-110 transition"
          >
            🔁 Fill Another Form
          </button>
        </div>
      </div>
    </div>
  );
}
