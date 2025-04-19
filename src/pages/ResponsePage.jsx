import { useLocation, useNavigate } from 'react-router-dom';

// Optional: if you're converting plain links to markdown links
const convertPlainLinks = (text) => {
  return text.replace(/\[([^\]]+)\]\((.*?)\)/g, (_, label, url) => {
    // If the label looks like a URL, just return that
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
      <div className="min-h-screen bg-dark-background flex items-center justify-center p-6">
        <div className="bg-dark-surface rounded-xl border border-dark-border shadow-lg p-8 text-center max-w-lg">
          <h2 className="text-2xl font-bold text-red-400">No Response Found</h2>
          <p className="text-dark-text mt-4">Oops! Looks like something went wrong.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-dark-secondary text-dark-background rounded-full hover:bg-dark-primary transition"
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

  const renderList = (lines) => {
    const isOrdered = /^\d+\.\s+/.test(lines[0]);
    const Tag = isOrdered ? 'ol' : 'ul';
    const className = isOrdered
      ? 'list-decimal list-inside text-dark-text space-y-1'
      : 'list-disc list-inside text-dark-text space-y-1';

    return (
      <Tag className={className}>
        {lines.map((raw, i) => {
          const text = raw.replace(/^\*\s?/, '').replace(/^\d+\.\s+/, '');

          // Markdown link: [label](url)
          const mdMatch = text.match(/\[(.*?)\]\((.*?)\)/);
          if (mdMatch) {
            const [, label, rawUrl] = mdMatch;
            const href = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
            return (
              <li key={i}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-secondary underline"
                >
                  {label}
                </a>
              </li>
            );
          }

          return <li key={i}>{text}</li>;
        })}
      </Tag>
    );
  };

  const renderParagraph = (title, body, color) => (
    <div key={title}>
      <h2 className={`text-2xl font-bold ${color} mb-2`}>{title}</h2>
      <p className="text-dark-text whitespace-pre-wrap">{body}</p>
    </div>
  );

  const renderSection = (section, idx) => {
    if (section.startsWith('Best Career Option:')) {
      return renderParagraph(
        '🎯 Best Career Option',
        section.replace('Best Career Option:', '').trim(),
        'text-dark-primary'
      );
    }

    if (section.startsWith('Alternate Career Option:')) {
      return renderParagraph(
        '🔄 Alternate Career Option',
        section.replace('Alternate Career Option:', '').trim(),
        'text-dark-secondary'
      );
    }

    if (section.startsWith('Industry Overview')) {
      const lines = section.split('\n').slice(1).filter(l => l.startsWith('* '));
      if (lines.length) {
        return (
          <div key={idx}>
            <h2 className="text-2xl font-bold text-indigo-400 mb-2">📊 Industry Overview</h2>
            {renderList(lines)}
          </div>
        );
      }
      return renderParagraph(
        '📊 Industry Overview',
        section.replace(/^Industry Overview.*?:/, '').trim(),
        'text-indigo-400'
      );
    }

    if (section.startsWith('Top Institutes')) {
      const match = section.match(/Top Institutes\s*(?:\((.*?)\))?:/);
      const label = match && match[1] ? ` (${match[1]})` : '';
      const lines = section.split('\n').slice(1).filter(Boolean);
      return (
        <div key={idx}>
          <h2 className="text-2xl font-bold text-rose-400 mb-2">
            🏛️ Top Institutes{label}
          </h2>
          {renderList(lines)}
        </div>
      );
    }

    if (section.startsWith('Preparation Plan')) {
      const match = section.match(/Preparation Plan\s*(?:\((.*?)\))?:/);
      const label = match && match[1] ? ` (${match[1]})` : '';
      const lines = section.split('\n').slice(1).filter(Boolean);
      return (
        <div key={idx}>
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            🧭 Preparation Plan{label}
          </h2>
          {renderList(lines)}
        </div>
      );
    }

    if (section.startsWith('Entrance Tests')) {
      const lines = section.split('\n').slice(1).filter(Boolean);
      return (
        <div key={idx}>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">📝 Entrance Tests</h2>
          {renderList(lines)}
        </div>
      );
    }

    if (section.startsWith('Eligibility and Admission Criteria:')) {
      return renderParagraph(
        '🎓 Eligibility Criteria',
        section.replace('Eligibility and Admission Criteria:', '').trim(),
        'text-blue-400'
      );
    }

    if (/^User-Centric/i.test(section)) {
      return renderParagraph(
        '🙋 User‑Centric Advice',
        section.replace(/^User-Centric.*?:/, '').trim(),
        'text-emerald-400'
      );
    }

    if (section.startsWith('DISCLAIMER:')) {
      return (
        <div key={idx}>
          <h2 className="text-sm font-semibold text-gray-500 mt-4">⚠️ Disclaimer</h2>
          <p className="text-dark-text text-sm">
            {section.replace('DISCLAIMER:', '').trim()}
          </p>
        </div>
      );
    }

    return (
      <p key={idx} className="text-dark-text whitespace-pre-wrap">
        {section}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-dark-background p-6 flex items-center justify-center">
      <div className="bg-dark-surface rounded-3xl border border-dark-border shadow-lg p-8 w-full max-w-4xl space-y-8 overflow-y-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-dark-primary drop-shadow-md">
            🎉 Your Personalized Career Report
          </h1>
          <p className="text-dark-text mt-2">
            Based on your responses, here’s our recommendation for your future career journey:
          </p>
        </div>

        <div className="space-y-6">{sections.map(renderSection)}</div>

        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-8 py-3 bg-dark-secondary text-dark-background rounded-full hover:bg-dark-primary transition"
          >
            🔁 Fill Another Form
          </button>
        </div>
      </div>
    </div>
  );
}
