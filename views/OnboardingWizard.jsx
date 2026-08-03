'use client';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, getMatchProfile, saveMatchProfile } from '@/lib/api';

const STEPS = [
  { id: 'personal', title: 'Personal details' },
  { id: 'education', title: 'Education' },
  { id: 'tests', title: 'Tests & scores' },
  { id: 'preferences', title: 'Preferences' },
  { id: 'documents', title: 'Documents' },
];

const EMPTY = {
  name: '',
  phone: '',
  nationality: '',
  date_of_birth: '',
  gender: '',
  current_city: '',
  education_level: 'PhD / Doctoral',
  field_of_study: '',
  university_name: '',
  graduation_year: '',
  gpa: '',
  gpa_scale: '4',
  english_test_status: 'ielts',
  ielts_score: '',
  toefl_score: '',
  duolingo_score: '',
  gre_score: '',
  research_experience: '',
  work_experience: '',
  has_research_proposal: false,
  preferred_countries: [],
  preferred_fields: [],
  preferred_degree_levels: ['PhD'],
  lor_ready: false,
};

export default function OnboardingWizard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [countries, setCountries] = useState([]);
  const [fields, setFields] = useState([]);
  const [files, setFiles] = useState({});
  const [existingDocs, setExistingDocs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.onboarding_completed) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.profile.me().catch(() => null),
      api.scholarships.countries().catch(() => []),
      api.scholarships.fields().catch(() => []),
    ])
      .then(([me, c, f]) => {
        if (cancelled) return;
        const local = getMatchProfile();
        const p = me?.profile || {};
        const u = me?.user || user || {};
        setForm((prev) => ({
          ...prev,
          name: u.name || prev.name,
          phone: u.phone || '',
          nationality: u.nationality || '',
          date_of_birth: p.date_of_birth || '',
          gender: p.gender || '',
          current_city: p.current_city || '',
          education_level: p.education_level || local.education_level || prev.education_level,
          field_of_study: p.field_of_study || local.field_of_study || '',
          university_name: p.university_name || '',
          graduation_year: p.graduation_year || '',
          gpa: p.gpa ?? local.gpa ?? '',
          gpa_scale: p.gpa_scale || '4',
          english_test_status: p.english_test_status || (local.ielts_score ? 'ielts' : 'ielts'),
          ielts_score: p.ielts_score ?? local.ielts_score ?? '',
          toefl_score: p.toefl_score ?? '',
          duolingo_score: p.duolingo_score ?? '',
          gre_score: p.gre_score ?? local.gre_score ?? '',
          research_experience: p.research_experience || local.research_experience || '',
          work_experience: p.work_experience || '',
          has_research_proposal: !!(p.has_research_proposal ?? local.has_research_proposal),
          preferred_countries: p.preferred_countries || [],
          preferred_fields: p.preferred_fields || [],
          preferred_degree_levels: p.preferred_degree_levels?.length ? p.preferred_degree_levels : ['PhD'],
          lor_ready: !!p.lor_ready,
        }));
        setExistingDocs({
          cv_path: p.cv_path,
          transcript_path: p.transcript_path,
          passport_path: p.passport_path,
          english_cert_path: p.english_cert_path,
          sop_path: p.sop_path,
        });
        setCountries(Array.isArray(c) ? c : []);
        setFields(Array.isArray(f) ? f : []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  const progress = useMemo(() => Math.round(((step + 1) / STEPS.length) * 100), [step]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleList = (key, value) => {
    setForm((f) => {
      const list = f[key] || [];
      return {
        ...f,
        [key]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value],
      };
    });
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.name?.trim() || !form.phone?.trim() || !form.nationality?.trim()) {
        return 'Please fill name, phone, and nationality.';
      }
    }
    if (step === 1) {
      if (!form.education_level || !form.field_of_study?.trim() || form.gpa === '' || form.gpa == null) {
        return 'Education level, field of study, and GPA are required.';
      }
    }
    if (step === 2) {
      if (!form.english_test_status) return 'Select your English test status.';
      if (form.english_test_status === 'ielts' && !form.ielts_score) return 'Enter your IELTS score.';
      if (form.english_test_status === 'toefl' && !form.toefl_score) return 'Enter your TOEFL score.';
      if (form.english_test_status === 'duolingo' && !form.duolingo_score) return 'Enter your Duolingo score.';
    }
    if (step === 3) {
      if (!form.preferred_countries.length) return 'Select at least one preferred country.';
    }
    if (step === 4) {
      if (!files.cv && !existingDocs.cv_path) return 'Please upload your CV / resume (required).';
    }
    return '';
  };

  const saveCurrent = async ({ finalize = false } = {}) => {
    const payload = {
      name: form.name,
      phone: form.phone,
      nationality: form.nationality,
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      current_city: form.current_city,
      education_level: form.education_level,
      field_of_study: form.field_of_study,
      university_name: form.university_name,
      graduation_year: form.graduation_year,
      gpa: form.gpa,
      gpa_scale: form.gpa_scale,
      english_test_status: form.english_test_status,
      ielts_score: form.ielts_score,
      toefl_score: form.toefl_score,
      duolingo_score: form.duolingo_score,
      gre_score: form.gre_score,
      research_experience: form.research_experience,
      work_experience: form.work_experience,
      has_research_proposal: form.has_research_proposal,
      preferred_countries: form.preferred_countries,
      preferred_fields: form.preferred_fields,
      preferred_degree_levels: form.preferred_degree_levels,
      lor_ready: form.lor_ready,
    };

    // Save profile fields first (without completing yet)
    await api.profile.update(payload);
    saveMatchProfile({
      gpa: form.gpa,
      ielts_score: form.ielts_score,
      gre_score: form.gre_score,
      field_of_study: form.field_of_study,
      education_level: form.education_level,
      research_experience: form.research_experience,
      has_research_proposal: form.has_research_proposal,
    });

    const hasFiles = Object.values(files).some(Boolean);
    if (hasFiles || form.lor_ready) {
      const fd = new FormData();
      if (files.cv) fd.append('cv', files.cv);
      if (files.transcript) fd.append('transcript', files.transcript);
      if (files.passport) fd.append('passport', files.passport);
      if (files.english_cert) fd.append('english_cert', files.english_cert);
      if (files.sop) fd.append('sop', files.sop);
      fd.append('lor_ready', form.lor_ready ? 'true' : 'false');
      await api.profile.uploadDocuments(fd);
    }

    // Finalize after documents so CV gate can pass
    const result = finalize
      ? await api.profile.update({ ...payload, complete_onboarding: true })
      : await api.profile.me();

    if (refreshUser) await refreshUser();
    return result;
  };

  const handleNext = async () => {
    const v = validateStep();
    if (v) {
      setError(v);
      return;
    }
    setError('');
    setSaving(true);
    try {
      const finalize = step === STEPS.length - 1;
      const result = await saveCurrent({ finalize });
      if (finalize || result.onboarding_completed) {
        if (refreshUser) await refreshUser();
        navigate('/dashboard', { replace: true });
        return;
      }
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    } catch (err) {
      setError(err.message || 'Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist">
      <div className="border-b border-ink/10 bg-ink text-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-300">Scholaris onboarding</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Complete your student profile</h1>
          <p className="mt-2 text-sm text-white/75">
            We use your academics, English scores, documents, and preferences to recommend the best-fit scholarships.
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-white/60">Step {step + 1} of {STEPS.length}: {STEPS[step].title}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                i === step ? 'bg-ink text-white' : i < step ? 'bg-brand-100 text-brand-700' : 'bg-white text-ink-muted'
              }`}
            >
              {i + 1}. {s.title}
            </span>
          ))}
        </div>

        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={form.name} onChange={(v) => setField('name', v)} required />
              <Field label="Phone" value={form.phone} onChange={(v) => setField('phone', v)} required />
              <Field label="Nationality" value={form.nationality} onChange={(v) => setField('nationality', v)} required />
              <Field label="Current city" value={form.current_city} onChange={(v) => setField('current_city', v)} />
              <Field label="Date of birth" type="date" value={form.date_of_birth} onChange={(v) => setField('date_of_birth', v)} />
              <div>
                <label className="label-field">Gender</label>
                <select className="input-field" value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
                  <option value="">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field">Education level *</label>
                <select className="input-field" value={form.education_level} onChange={(e) => setField('education_level', e.target.value)}>
                  <option>Bachelor&apos;s</option>
                  <option>Master&apos;s</option>
                  <option>PhD / Doctoral</option>
                  <option>Postdoctoral</option>
                </select>
              </div>
              <Field label="Field of study *" value={form.field_of_study} onChange={(v) => setField('field_of_study', v)} />
              <Field label="Current / last university" value={form.university_name} onChange={(v) => setField('university_name', v)} />
              <Field label="Graduation year" value={form.graduation_year} onChange={(v) => setField('graduation_year', v)} />
              <Field label="GPA *" type="number" value={form.gpa} onChange={(v) => setField('gpa', v)} />
              <div>
                <label className="label-field">GPA scale</label>
                <select className="input-field" value={form.gpa_scale} onChange={(e) => setField('gpa_scale', e.target.value)}>
                  <option value="4">4.0</option>
                  <option value="5">5.0</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Research experience</label>
                <textarea className="input-field" rows={3} value={form.research_experience} onChange={(e) => setField('research_experience', e.target.value)} placeholder="Labs, publications, thesis topics..." />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Work experience</label>
                <textarea className="input-field" rows={2} value={form.work_experience} onChange={(e) => setField('work_experience', e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2">
                <input type="checkbox" checked={form.has_research_proposal} onChange={(e) => setField('has_research_proposal', e.target.checked)} />
                I already have a research proposal / SOP draft
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="label-field">English proficiency *</label>
                <select className="input-field" value={form.english_test_status} onChange={(e) => setField('english_test_status', e.target.value)}>
                  <option value="ielts">IELTS (taken)</option>
                  <option value="toefl">TOEFL (taken)</option>
                  <option value="duolingo">Duolingo (taken)</option>
                  <option value="planned">Planning to take a test</option>
                  <option value="waiver">English-medium waiver expected</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(form.english_test_status === 'ielts' || form.english_test_status === 'other') && (
                  <Field label="IELTS overall band" type="number" value={form.ielts_score} onChange={(v) => setField('ielts_score', v)} />
                )}
                {form.english_test_status === 'toefl' && (
                  <Field label="TOEFL iBT score" type="number" value={form.toefl_score} onChange={(v) => setField('toefl_score', v)} />
                )}
                {form.english_test_status === 'duolingo' && (
                  <Field label="Duolingo score" type="number" value={form.duolingo_score} onChange={(v) => setField('duolingo_score', v)} />
                )}
                <Field label="GRE (optional)" type="number" value={form.gre_score} onChange={(v) => setField('gre_score', v)} />
              </div>
              <p className="text-xs text-ink-muted">
                Scores improve recommendation accuracy. If you selected “planned”, you can update scores later from your dashboard.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="label-field">Preferred countries *</p>
                <div className="mt-2 flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-xl border border-ink/10 p-3">
                  {(countries.length ? countries : ['United Kingdom', 'Germany', 'USA', 'Canada', 'Australia', 'China', 'Italy', 'Hungary']).map((c) => (
                    <Chip key={c} active={form.preferred_countries.includes(c)} onClick={() => toggleList('preferred_countries', c)}>{c}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <p className="label-field">Preferred fields (optional)</p>
                <div className="mt-2 flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-xl border border-ink/10 p-3">
                  {(fields.length ? fields.slice(0, 40) : ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law']).map((f) => (
                    <Chip key={f} active={form.preferred_fields.includes(f)} onClick={() => toggleList('preferred_fields', f)}>{f}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <p className="label-field">Target degree levels</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Bachelor\'s', 'Master\'s', 'PhD', 'Postdoc'].map((d) => (
                    <Chip key={d} active={form.preferred_degree_levels.includes(d)} onClick={() => toggleList('preferred_degree_levels', d)}>{d}</Chip>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-ink-muted">
                Upload the documents scholarship committees usually require. CV is mandatory to finish onboarding.
              </p>
              <FileField label="CV / Resume *" name="cv" file={files.cv} existing={existingDocs.cv_path} onChange={(f) => setFiles((x) => ({ ...x, cv: f }))} />
              <FileField label="Academic transcript" name="transcript" file={files.transcript} existing={existingDocs.transcript_path} onChange={(f) => setFiles((x) => ({ ...x, transcript: f }))} />
              <FileField label="Passport bio page" name="passport" file={files.passport} existing={existingDocs.passport_path} onChange={(f) => setFiles((x) => ({ ...x, passport: f }))} />
              <FileField label="English test certificate" name="english_cert" file={files.english_cert} existing={existingDocs.english_cert_path} onChange={(f) => setFiles((x) => ({ ...x, english_cert: f }))} />
              <FileField label="SOP / Motivation letter" name="sop" file={files.sop} existing={existingDocs.sop_path} onChange={(f) => setFiles((x) => ({ ...x, sop: f }))} />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={form.lor_ready} onChange={(e) => setField('lor_ready', e.target.checked)} />
                I can provide Letters of Recommendation when needed
              </label>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              disabled={step === 0 || saving}
              onClick={() => { setError(''); setStep((s) => Math.max(0, s - 1)); }}
              className="btn-secondary disabled:opacity-40"
            >
              Back
            </button>
            <button type="button" disabled={saving} onClick={handleNext} className="btn-primary disabled:opacity-50">
              {saving ? 'Saving...' : step === STEPS.length - 1 ? 'Finish & see recommendations' : 'Save & continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="label-field">{label}{required ? '' : ''}</label>
      <input type={type} className="input-field" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Chip({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active ? 'bg-ink text-white' : 'bg-mist text-ink hover:bg-brand-100'
      }`}
    >
      {children}
    </button>
  );
}

function FileField({ label, file, existing, onChange }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-mist/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="text-xs text-ink-muted">
            {file ? file.name : existing ? 'Already uploaded — choose a file to replace' : 'PDF, DOC, DOCX, JPG, or PNG (max 8MB)'}
          </p>
        </div>
        <label className="btn-secondary !cursor-pointer !py-2 !text-xs">
          Choose file
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
          />
        </label>
      </div>
    </div>
  );
}
