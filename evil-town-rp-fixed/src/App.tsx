import { FormEvent, useMemo, useState } from 'react';

type Department = 'police' | 'ems' | 'gang' | 'justice';

type ApplyForm = {
  department: Department;
  name: string;
  age: string;
  discordId: string;
  experience: string;
  reason: string;
  scenario: string;
  backstory: string;
  notes: string;
};

type CharacterForm = {
  name: string;
  age: string;
  nationality: string;
  job: string;
  backstory: string;
};

const departmentLabels: Record<Department, string> = {
  police: 'Police Department',
  ems: 'EMS Department',
  gang: 'Gang Application',
  justice: 'Justice Department',
};

const initialApply: ApplyForm = {
  department: 'police',
  name: '',
  age: '',
  discordId: '',
  experience: '',
  reason: '',
  scenario: '',
  backstory: '',
  notes: '',
};

const initialCharacter: CharacterForm = {
  name: '',
  age: '',
  nationality: '',
  job: '',
  backstory: '',
};

function App() {
  const [activeTab, setActiveTab] = useState<'apply' | 'character'>('apply');
  const [applyForm, setApplyForm] = useState<ApplyForm>(initialApply);
  const [characterForm, setCharacterForm] = useState<CharacterForm>(initialCharacter);
  const [applyState, setApplyState] = useState({ loading: false, message: '' });
  const [characterState, setCharacterState] = useState({ loading: false, message: '' });

  const selectedDepartmentLabel = useMemo(
    () => departmentLabels[applyForm.department],
    [applyForm.department]
  );

  async function submitApply(e: FormEvent) {
    e.preventDefault();
    setApplyState({ loading: true, message: '' });

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applyForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || result?.error || 'Failed to submit application.');
      }

      setApplyForm(initialApply);
      setApplyState({ loading: false, message: 'Application sent successfully to Discord.' });
    } catch (error) {
      setApplyState({
        loading: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      });
    }
  }

  async function submitCharacter(e: FormEvent) {
    e.preventDefault();
    setCharacterState({ loading: true, message: '' });

    try {
      const response = await fetch('/api/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || result?.error || 'Failed to submit character form.');
      }

      setCharacterForm(initialCharacter);
      setCharacterState({ loading: false, message: 'Character application sent successfully.' });
    } catch (error) {
      setCharacterState({
        loading: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      });
    }
  }

  return (
    <div className="page-shell">
      <section className="hero-card">
        <span className="eyebrow">Evil Town RP</span>
        <h1>Applications Portal</h1>
        <p>
          Submit department applications and character creation forms directly to your Discord server.
        </p>
      </section>

      <section className="panel-switcher">
        <button
          className={activeTab === 'apply' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('apply')}
          type="button"
        >
          Department Application
        </button>
        <button
          className={activeTab === 'character' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('character')}
          type="button"
        >
          Character Application
        </button>
      </section>

      {activeTab === 'apply' ? (
        <form className="form-card" onSubmit={submitApply}>
          <div className="card-heading">
            <h2>{selectedDepartmentLabel}</h2>
            <p>Fill in the application and it will be posted in the selected Discord channel.</p>
          </div>

          <div className="grid two-columns">
            <label>
              Department
              <select
                value={applyForm.department}
                onChange={(e) => setApplyForm({ ...applyForm, department: e.target.value as Department })}
              >
                {Object.entries(departmentLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Age
              <input
                value={applyForm.age}
                onChange={(e) => setApplyForm({ ...applyForm, age: e.target.value })}
                placeholder="18"
                required
              />
            </label>
          </div>

          <div className="grid two-columns">
            <label>
              Player Name
              <input
                value={applyForm.name}
                onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                placeholder="Your in game name"
                required
              />
            </label>

            <label>
              Discord Username / ID
              <input
                value={applyForm.discordId}
                onChange={(e) => setApplyForm({ ...applyForm, discordId: e.target.value })}
                placeholder="user#0001 or 123456789"
                required
              />
            </label>
          </div>

          <label>
            RP Experience
            <textarea
              value={applyForm.experience}
              onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
              rows={4}
              placeholder="Tell us about your RP experience"
              required
            />
          </label>

          <label>
            Why do you want to join
            <textarea
              value={applyForm.reason}
              onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
              rows={4}
              placeholder="Why should we accept you"
              required
            />
          </label>

          <label>
            Scenario Answer
            <textarea
              value={applyForm.scenario}
              onChange={(e) => setApplyForm({ ...applyForm, scenario: e.target.value })}
              rows={4}
              placeholder="How would you handle a roleplay scenario"
              required
            />
          </label>

          <label>
            Backstory
            <textarea
              value={applyForm.backstory}
              onChange={(e) => setApplyForm({ ...applyForm, backstory: e.target.value })}
              rows={4}
              placeholder="Optional character backstory"
            />
          </label>

          <label>
            Additional Notes
            <textarea
              value={applyForm.notes}
              onChange={(e) => setApplyForm({ ...applyForm, notes: e.target.value })}
              rows={3}
              placeholder="Anything else you want staff to know"
            />
          </label>

          <button className="submit-button" disabled={applyState.loading} type="submit">
            {applyState.loading ? 'Sending...' : 'Send Application'}
          </button>

          {applyState.message ? <p className="status-text">{applyState.message}</p> : null}
        </form>
      ) : (
        <form className="form-card" onSubmit={submitCharacter}>
          <div className="card-heading">
            <h2>Character Application</h2>
            <p>Create a new character and send it straight to Discord.</p>
          </div>

          <div className="grid two-columns">
            <label>
              Character Name
              <input
                value={characterForm.name}
                onChange={(e) => setCharacterForm({ ...characterForm, name: e.target.value })}
                placeholder="John Carter"
                required
              />
            </label>
            <label>
              Character Age
              <input
                value={characterForm.age}
                onChange={(e) => setCharacterForm({ ...characterForm, age: e.target.value })}
                placeholder="27"
                required
              />
            </label>
          </div>

          <div className="grid two-columns">
            <label>
              Nationality
              <input
                value={characterForm.nationality}
                onChange={(e) => setCharacterForm({ ...characterForm, nationality: e.target.value })}
                placeholder="American"
                required
              />
            </label>
            <label>
              Occupation
              <input
                value={characterForm.job}
                onChange={(e) => setCharacterForm({ ...characterForm, job: e.target.value })}
                placeholder="Mechanic"
                required
              />
            </label>
          </div>

          <label>
            Backstory
            <textarea
              value={characterForm.backstory}
              onChange={(e) => setCharacterForm({ ...characterForm, backstory: e.target.value })}
              rows={6}
              placeholder="Write a detailed backstory"
              required
            />
          </label>

          <button className="submit-button" disabled={characterState.loading} type="submit">
            {characterState.loading ? 'Sending...' : 'Send Character'}
          </button>

          {characterState.message ? <p className="status-text">{characterState.message}</p> : null}
        </form>
      )}
    </div>
  );
}

export default App;
