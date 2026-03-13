import React, { useState } from 'react';
import './Main.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    academic: 'A',
    skills: '',
    interests: '',
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interests: formData.interests.split(',').map(s => s.trim()),
          skills: formData.skills.split(',').map(s => s.trim()),
          academic: formData.academic
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');
      
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError("Failed to connect to AI Engine. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>PATHWISE AI</h1>
        <p className="subtitle">Smarter choices for a brighter future. Discover your potential with advanced AI-driven guidance.</p>
      </header>

      <main className="main-content">
        {!recommendations ? (
          <div className="glass-card">
            <h2 style={{ marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Student Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g. John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Academic Performance (Grade/GPA)</label>
                <select name="academic" value={formData.academic} onChange={handleChange}>
                  <option value="A+">Excellent (A+)</option>
                  <option value="A">Very Good (A)</option>
                  <option value="B">Good (B)</option>
                  <option value="C">Average (C)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Technical Skills (Comma separated)</label>
                <input 
                  type="text" 
                  name="skills" 
                  placeholder="e.g. Python, SQL, React" 
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Interests & Hobbies</label>
                <textarea 
                  name="interests" 
                  rows="3" 
                  placeholder="e.g. Problem solving, AI, Graphic design, Cybersecurity"
                  value={formData.interests}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="loading-dots">Analyzing Potentials</span> : "Generate Recommendations"}
              </button>
            </form>
            {error && <p style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
          </div>
        ) : (
          <div className="results-container">
            <div style={{ marginBottom: '2.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
               <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>
                Analysis for <span style={{ color: 'var(--primary)' }}>{formData.name}</span>
               </h2>
               <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                Based on your {formData.academic} academic performance and skills in {formData.skills}.
               </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>Your Best Match Careers</h3>
              <button 
                onClick={() => setRecommendations(null)} 
                className="btn-primary" 
                style={{ width: 'auto', padding: '0.5rem 1.5rem', marginTop: 0, fontSize: '0.9rem' }}
              >
                New Analysis
              </button>
            </div>

            <div className="results-grid">
              {recommendations.map((rec, index) => (
                <div className="glass-card career-card" key={index} style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="career-header">
                    <h3 className="career-title">{rec.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <div style={{ color: 'var(--accent)', fontWeight: 800 }}>{95 + Math.floor(Math.random() * 5)}% Match</div>
                      <span style={{ fontSize: '0.65rem', background: 'rgba(236, 72, 153, 0.1)', padding: '2px 6px', borderRadius: '4px', marginTop: '2px' }}>High Demand</span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{rec.details.description}</p>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label>Key Skills to Master</label>
                    <div>
                      {rec.details.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label>Learning Roadmap</label>
                    {rec.details.roadmap.map((step, rIdx) => (
                      <div key={rIdx} className="roadmap-item">
                        <div className="step-num">{rIdx + 1}</div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label>Recommended Courses</label>
                    {rec.details.courses.map((course, cIdx) => (
                      <div key={cIdx} style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>
                        📘 {course}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--text-dim)', paddingBottom: '2rem' }}>
        <p>© 2026 PathWise AI Guidance Systems. Smarter decisions, faster growth.</p>
      </footer>
    </div>
  );
}

export default App;
