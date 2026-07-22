import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import Papa from 'papaparse';
import { supabase } from '../../lib/supabase';
import { LEAD_COLUMNS, US_STATES, type Lead, type LeadType } from '../../lib/types';
import { ColumnMapper, type ColumnMapping } from './ColumnMapper';
import { Button } from '../ui/Button';

const BATCH_SIZE = 500;

interface ParseResult {
  headers: string[];
  rows: Record<string, string>[];
}

interface UploadError {
  row: number;
  reason: string;
}

interface SuccessSummary {
  count: number;
  state: string;
  county: string;
  listType: LeadType;
  datePulled: string;
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function columnsFor(listType: LeadType) {
  return LEAD_COLUMNS.filter((c) => !c.appliesTo || c.appliesTo.includes(listType));
}

function autoMap(headers: string[], listType: LeadType): ColumnMapping {
  const mapping: ColumnMapping = {};
  for (const col of columnsFor(listType)) {
    const target = normalize(col.label);
    const match = headers.find((h) => normalize(h) === target || normalize(h) === normalize(col.key));
    if (match) mapping[col.key] = match;
  }
  return mapping;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function CSVUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [step, setStep] = useState<'tag' | 'map'>('tag');
  const [mapping, setMapping] = useState<ColumnMapping>({});

  // Batch-level tags: one state, one county, one list type, one date pulled
  // applied to every row in this upload — set once instead of mapped per row.
  const [listType, setListType] = useState<LeadType>('pre_foreclosure');
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [datePulled, setDatePulled] = useState(todayISO());

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<UploadError[]>([]);
  const [summary, setSummary] = useState<SuccessSummary | null>(null);

  function handleFile(file: File) {
    setSummary(null);
    setErrors([]);
    setStep('tag');
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        setParsed({ headers, rows: results.data });
        setMapping(autoMap(headers, listType));
      },
    });
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function reset() {
    setParsed(null);
    setStep('tag');
    setMapping({});
    setErrors([]);
    setSummary(null);
    setProgress(0);
    setState('');
    setCounty('');
    setDatePulled(todayISO());
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const visibleColumns = columnsFor(listType);
  const requiredMissing = visibleColumns.filter((c) => c.required && !mapping[c.key]);
  const batchTagsMissing = !state || !county.trim() || !datePulled;

  async function handleUpload() {
    if (!parsed || batchTagsMissing) return;
    setUploading(true);
    setErrors([]);
    setSummary(null);
    setProgress(0);

    const validRows: Partial<Lead>[] = [];
    const rowErrors: UploadError[] = [];

    parsed.rows.forEach((raw, index) => {
      const lead: Record<string, string | null> = {};
      for (const col of visibleColumns) {
        const header = mapping[col.key];
        lead[col.key] = header ? (raw[header]?.trim() || null) : null;
      }

      const missing = visibleColumns.filter((c) => c.required && !lead[c.key]);
      if (missing.length > 0) {
        rowErrors.push({ row: index + 2, reason: `Missing ${missing.map((m) => m.label).join(', ')}` });
        return;
      }

      validRows.push({
        ...lead,
        state,
        county: county.trim(),
        list_type: listType,
        date_pulled: datePulled,
      } as Partial<Lead>);
    });

    setErrors(rowErrors);

    const chunks: Partial<Lead>[][] = [];
    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      chunks.push(validRows.slice(i, i + BATCH_SIZE));
    }

    let inserted = 0;
    for (const chunk of chunks) {
      const { error } = await supabase.from('leads').insert(chunk);
      if (error) {
        rowErrors.push({ row: -1, reason: `Batch insert failed: ${error.message}` });
        setErrors([...rowErrors]);
        break;
      }
      inserted += chunk.length;
      setProgress(Math.round((inserted / Math.max(1, validRows.length)) * 100));
    }

    setSummary({
      count: inserted,
      state,
      county: county.trim(),
      listType,
      datePulled: new Date(datePulled + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    });
    setUploading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {!parsed && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? 'var(--color-amber)' : 'var(--color-border)'}`,
            borderRadius: 12,
            padding: 48,
            textAlign: 'center',
            cursor: 'pointer',
            background: dragActive ? 'rgba(245,166,35,0.06)' : '#fff',
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Drag & drop a CSV file here</p>
          <p style={{ fontSize: 13, color: 'var(--color-slate)' }}>or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {parsed && !summary && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--color-slate)' }}>
              {parsed.rows.length} rows detected · {parsed.headers.length} columns
            </p>
            <Button variant="ghost" onClick={reset}>
              Choose a different file
            </Button>
          </div>

          <Stepper current={step} />

          {step === 'tag' && (
            <>
              <div
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  padding: 16,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 14,
                  background: '#fff',
                }}
              >
                <BatchField label="List Type">
                  <select
                    value={listType}
                    onChange={(e) => {
                      const next = e.target.value as LeadType;
                      setListType(next);
                      if (parsed) setMapping(autoMap(parsed.headers, next));
                    }}
                    style={fieldStyle}
                  >
                    <option value="pre_foreclosure">Pre-Foreclosure</option>
                    <option value="code_violations">Code Violations</option>
                  </select>
                </BatchField>

                <BatchField label="State" required>
                  <select value={state} onChange={(e) => setState(e.target.value)} style={fieldStyle}>
                    <option value="">Select…</option>
                    {US_STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </BatchField>

                <BatchField label="County" required>
                  <input
                    type="text"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    placeholder="e.g. Maricopa"
                    style={fieldStyle}
                  />
                </BatchField>

                <BatchField label="Date Pulled" required>
                  <input
                    type="date"
                    value={datePulled}
                    onChange={(e) => setDatePulled(e.target.value)}
                    style={fieldStyle}
                  />
                </BatchField>
              </div>

              {batchTagsMissing && (
                <p style={{ fontSize: 13, color: 'var(--color-danger)' }}>
                  Fill in State, County, and Date Pulled to continue.
                </p>
              )}

              <Button onClick={() => setStep('map')} disabled={batchTagsMissing}>
                Continue to field mapping
              </Button>
            </>
          )}

          {step === 'map' && (
            <>
              <ColumnMapper csvHeaders={parsed.headers} mapping={mapping} onChange={setMapping} columns={visibleColumns} />

              {requiredMissing.length > 0 && (
                <p style={{ fontSize: 13, color: 'var(--color-danger)' }}>
                  Map required fields before uploading: {requiredMissing.map((m) => m.label).join(', ')}
                </p>
              )}

              {uploading && (
                <div>
                  <div style={{ background: 'var(--color-border)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${progress}%`,
                        background: 'var(--color-amber)',
                        height: '100%',
                        transition: 'width 150ms ease',
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-slate)', marginTop: 4 }}>{progress}% uploaded</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="ghost" onClick={() => setStep('tag')} disabled={uploading}>
                  Back
                </Button>
                <Button onClick={handleUpload} loading={uploading} disabled={requiredMissing.length > 0}>
                  Upload {parsed.rows.length} rows
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {summary && (
        <div
          style={{
            background: 'rgba(47,133,90,0.08)',
            border: '1px solid var(--color-success)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <p style={{ fontWeight: 700, color: 'var(--color-success)', marginBottom: 4 }}>
            {summary.count.toLocaleString()} leads uploaded for {summary.county}, {summary.state} —{' '}
            {summary.listType === 'pre_foreclosure' ? 'Pre-Foreclosure' : 'Code Violations'} — {summary.datePulled}
          </p>
          <Button variant="ghost" onClick={reset} style={{ marginTop: 12 }}>
            Upload another file
          </Button>
        </div>
      )}

      {errors.length > 0 && (
        <div>
          <h4 style={{ fontSize: 14, color: 'var(--color-danger)', marginBottom: 8 }}>
            {errors.length} rows failed validation
          </h4>
          <div
            style={{
              maxHeight: 200,
              overflowY: 'auto',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          >
            {errors.map((e, i) => (
              <div
                key={i}
                style={{
                  padding: '6px 12px',
                  borderBottom: '1px solid var(--color-border)',
                  color: 'var(--color-slate)',
                }}
              >
                {e.row > 0 ? `Row ${e.row}` : 'Batch'}: {e.reason}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const fieldStyle = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid var(--color-border)',
  fontSize: 13,
  width: '100%',
};

function BatchField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-slate)', display: 'block', marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Stepper({ current }: { current: 'tag' | 'map' }) {
  const steps: { key: 'tag' | 'map'; label: string }[] = [
    { key: 'tag', label: '1. Tag this batch' },
    { key: 'map', label: '2. Map fields' },
  ];
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {steps.map((s, i) => (
        <div key={s.key} style={{ flex: 1 }}>
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: i <= currentIndex ? 'var(--color-amber)' : 'var(--color-border)',
              marginBottom: 6,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: i <= currentIndex ? 'var(--color-navy)' : 'var(--color-slate-light)',
            }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
