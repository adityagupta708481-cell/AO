import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, BrainCircuit, CheckCircle, AlertOctagon, TrendingUp, BookOpen } from 'lucide-react';
import { api } from '../api/client';
import AIReadinessGauge from '../components/AIReadinessGauge';
import PlatformCards from '../components/PlatformCards';
import RevisionCalendar from '../components/RevisionCalendar';
import SyncModal from '../components/SyncModal';
import Skeleton, { StatCardSkeleton, PlatformCardSkeleton } from '../components/ui/Skeleton';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [hackerrankData, setHackerrankData] = useState(null);
  const [codechefData, setCodechefData] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [csTopics, setCsTopics] = useState([]);
  const [aptitudeStats, setAptitudeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [u, p, rep, rev, cs, apt] = await Promise.allSettled([
        api.cachedGet('/auth/me', 120000),
        api.cachedGet('/platforms/status', 60000),
        api.cachedGet('/ai/latest-report', 120000),
        api.cachedGet('/revisions/due', 60000),
        api.cachedGet('/cs/topics', 60000),
        api.cachedGet('/aptitude/stats', 60000)
      ]);

      if (u.status === 'fulfilled') setUser(u.value);
      if (p.status === 'fulfilled') setPlatforms(p.value.platforms || []);
      if (rep.status === 'fulfilled') setAiReport(rep.value);
      if (rev.status === 'fulfilled') setRevisions(rev.value || []);
      if (cs.status === 'fulfilled') setCsTopics(cs.value || []);
      if (apt.status === 'fulfilled') setAptitudeStats(apt.value);

      // Fetch platform specific metrics if connected
      const connList = p.status === 'fulfilled' ? p.value.platforms || [] : [];
      if (connList.some(c => c.platform === 'leetcode')) {
        api.cachedGet('/platforms/leetcode', 60000).then(setLeetcodeData).catch(() => {});
      }
      if (connList.some(c => c.platform === 'codeforces')) {
        api.cachedGet('/platforms/codeforces', 60000).then(setCodeforcesData).catch(() => {});
      }
      if (connList.some(c => c.platform === 'github')) {
        api.cachedGet('/platforms/github', 60000).then(setGithubData).catch(() => {});
      }
      if (connList.some(c => c.platform === 'hackerrank')) {
        api.cachedGet('/platforms/hackerrank', 60000).then(setHackerrankData).catch(() => {});
      }
      if (connList.some(c => c.platform === 'codechef')) {
        api.cachedGet('/platforms/codechef', 60000).then(setCodechefData).catch(() => {});
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunEvaluation = async () => {
    try {
      setEvaluating(true);
      const res = await api.post('/ai/evaluate');
      setAiReport(res);
      // Refresh revisions as new weak areas might have been flagged
      const revRes = await api.get('/revisions/due');
      setRevisions(revRes);
    } catch (err) {
      alert(`AI Evaluation Failed: ${err.message}`);
    } finally {
      setEvaluating(false);
    }
  };

  const handleRevisionLogged = (id) => {
    setRevisions(prev => prev.filter(r => r.id !== id));
  };

  // Compute CS mastery %
  const masteredCount = csTopics.filter(t => t.status === 'mastered').length;
  const csPercent = csTopics.length > 0 ? Math.round((masteredCount / csTopics.length) * 100) : 0;

  return (
    <div>
      {/* Top Header */}
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">
            Placement Dashboard
          </h1>
          <p className="page-subtitle">
            Welcome, <strong style={{ color: 'var(--text-main)' }}>{user?.full_name || 'Student'}</strong> &bull; {user?.college || 'B.Tech CSE'}
          </p>
        </div>

        <div className="page-actions">
          <button className="btn-secondary" onClick={() => setSyncModalOpen(true)}>
            <RefreshCw size={16} />
            Sync Profiles
          </button>
          <button className="btn-primary" onClick={handleRunEvaluation} disabled={evaluating}>
            <BrainCircuit size={16} />
            {evaluating ? 'Analyzing readiness...' : 'Check My Readiness'}
          </button>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '16px', marginBottom: '24px' }}>
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                <span>Coding Problems Solved</span>
                <TrendingUp size={18} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px', color: 'var(--primary)' }}>
                {leetcodeData?.total_solved || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                {leetcodeData?.hard_solved || 0} Hard &bull; {leetcodeData?.medium_solved || 0} Med
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                <span>Core CS Topics</span>
                <BookOpen size={18} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px', color: 'var(--primary)' }}>
                {csPercent}%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                {masteredCount} of {csTopics.length} topics mastered
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                <span>Aptitude Accuracy</span>
                <CheckCircle size={18} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px', color: 'var(--primary)' }}>
                {aptitudeStats?.overall_accuracy || 0}%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                {aptitudeStats?.total_attempted || 0} Questions Attempted
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                <span>Connected Profiles</span>
                <Sparkles size={18} color="var(--chart-2)" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px', color: 'var(--chart-2)' }}>
                {platforms.filter(p => p.sync_status === 'success').length} / {Math.max(3, platforms.length)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                Platforms Connected
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Grid: Readiness Gauge + Spaced Repetition */}
      <div className="split-grid" style={{ '--split-cols': 'minmax(300px, 1fr) 2fr', marginBottom: '28px' }}>
        {loading ? (
          <>
            <div className="glass-panel" style={{ padding: '28px', height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Skeleton style={{ width: '140px', height: '18px', marginBottom: '24px' }} />
              <Skeleton style={{ width: '130px', height: '130px', borderRadius: '50%', marginBottom: '16px' }} />
              <Skeleton style={{ width: '100px', height: '16px' }} />
            </div>
            <div className="glass-panel" style={{ padding: '24px', height: '280px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Skeleton style={{ width: '180px', height: '18px' }} />
                <Skeleton style={{ width: '80px', height: '18px' }} />
              </div>
              <Skeleton style={{ width: '100%', height: '50px', marginBottom: '12px' }} />
              <Skeleton style={{ width: '100%', height: '50px', marginBottom: '12px' }} />
              <Skeleton style={{ width: '100%', height: '50px' }} />
            </div>
          </>
        ) : (
          <>
            <AIReadinessGauge
              score={aiReport?.overall_score || 0}
              tier={aiReport?.tier_classification || 'Not Evaluated Yet'}
            />
            <RevisionCalendar
              revisions={revisions}
              onRevisionLogged={handleRevisionLogged}
            />
          </>
        )}
      </div>

      {/* Connected Profiles */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Connected Coding Profiles</h2>
          <button className="btn-secondary btn-sm" onClick={() => setSyncModalOpen(true)}>
            Connect Profiles
          </button>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '20px' }}>
            <PlatformCardSkeleton />
            <PlatformCardSkeleton />
            <PlatformCardSkeleton />
          </div>
        ) : (
          <PlatformCards
            platforms={platforms}
            leetcodeData={leetcodeData}
            codeforcesData={codeforcesData}
            githubData={githubData}
            hackerrankData={hackerrankData}
            codechefData={codechefData}
            onOpenSyncModal={() => setSyncModalOpen(true)}
          />
        )}
      </div>

      {/* Top Urgent Weak Areas */}
      {aiReport?.weak_areas && aiReport.weak_areas.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <AlertOctagon size={20} color="var(--destructive)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recommended Topics to Practice</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '14px' }}>
            {aiReport.weak_areas.slice(0, 4).map((area, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--card-subtle-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{area.topic}</span>
                  <span className={`badge ${area.urgency === 'Urgent' ? 'badge-urgent' : 'badge-mid'}`}>
                    {area.urgency}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {area.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sync Modal */}
      <SyncModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        platforms={platforms}
        onSyncComplete={fetchData}
      />
    </div>
  );
}
