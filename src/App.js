import React, { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import './App.css';

// EditableText component - defined outside to prevent recreation on every render
const EditableText = ({ value, onChange, multiline = false, placeholder = "", isEditing }) => {
  if (!isEditing) return <span>{value}</span>;
  
  return multiline ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="editable-textarea"
      placeholder={placeholder}
    />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="editable-input"
      placeholder={placeholder}
    />
  );
};

export default function CVBuilder() {
  const [data, setData] = useState({
    name: "Sarah Martinez",
    bio: "Product Manager specializing in B2B SaaS platforms, driving user-centric solutions from discovery to launch.",
    email: "sarah.martinez@email.com",
    twitter: "@sarahmartinez",
    linkedin: "linkedin.com/in/sarahmartinez",
    experience: [
      {
        id: 1,
        company: "CloudSync Technologies",
        role: "Senior Product Manager",
        year: "2022 - PRESENT",
        points: [
          "Launched real-time document collaboration feature adopted by 200K+ users within first quarter",
          "Increased user retention by 35% through data-driven feature prioritization and UX improvements",
          "Managed cross-functional team of 12 including engineers, designers, and data analysts"
        ]
      },
      {
        id: 2,
        company: "PaymentHub Inc",
        role: "Product Manager",
        year: "2019 - 2022",
        points: [
          "Reduced customer support tickets by 45% through improved onboarding flow and in-app guidance",
          "Delivered API integration toolkit that enabled 80+ third-party integrations",
          "Conducted 150+ user interviews to validate product roadmap and feature hypotheses"
        ]
      },
      {
        id: 3,
        company: "FitMetrics",
        role: "Associate Product Manager",
        year: "2017 - 2019",
        points: [
          "Coordinated launch of premium subscription tier generating $2M in first year revenue",
          "Implemented A/B testing framework that improved conversion rates by 28%",
          "Built product analytics dashboard tracking 50+ KPIs across user journey"
        ]
      }
    ],
    products: [
      {
        id: 1,
        title: "InsightBoard",
        role: "Product Lead",
        points: [
          "Built customer feedback aggregation tool that centralizes reviews, surveys, and support tickets",
          "Used by 30+ product teams to prioritize features based on user sentiment analysis"
        ]
      },
      {
        id: 2,
        title: "LaunchKit",
        role: "Founder",
        points: [
          "Created product launch checklist and template library for PM teams",
          "Distributed to 5,000+ product managers through ProductHunt and community forums"
        ]
      },
      {
        id: 3,
        title: "MetricsFlow",
        role: "Co-creator",
        points: [
          "Developed lightweight product analytics tool for early-stage startups",
          "Helped 50+ teams track north star metrics and run growth experiments"
        ]
      }
    ],
    skills: [
      "Product Strategy",
      "User Research", 
      "Data Analysis",
      "Roadmap Planning",
      "Stakeholder Management",
      "A/B Testing",
      "SQL & Analytics",
      "Agile/Scrum"
    ],
    certifications: [
      "Certified Scrum Product Owner (CSPO)",
      "Google Analytics Certification",
      "Product Management Certificate - General Assembly"
    ],
    recognition: [
      "Product Leader of the Year - TechCon 2023",
      "Featured in 'Top 50 PMs to Follow' by Product School",
      "Speaker at ProductCon and Mind the Product conferences"
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => {
    // Check localStorage on initial render
    const tutorialSeen = localStorage.getItem('cvBuilderTutorialSeen');
    return !tutorialSeen; // Show if NOT seen
  });
  const [tutorialStep, setTutorialStep] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Check if URL has shared CV data on mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('cv');
    
    if (sharedData) {
      try {
        const decodedData = JSON.parse(atob(sharedData));
        setData(decodedData);
        setIsEditing(false); // Shared CVs open in preview mode
      } catch (e) {
        console.error('Invalid shared CV data');
      }
    }
  }, []);

  const tutorialSteps = [
    {
      title: "Welcome to CV Builder",
      message: "Click 'Start Editing' to customize your CV",
      position: "button", // near the edit button
      target: "edit-button"
    },
    {
      title: "Edit Anywhere",
      message: "Click any text to edit it directly - your name, experience, skills, everything!",
      position: "content", // near the content area
      target: "content"
    },
    {
      title: "Save Your Changes",
      message: "Click 'Save Changes' when you're done editing",
      position: "button", // near the save button
      target: "edit-button"
    },
    {
      title: "Download PDF",
      message: "Click 'Download PDF' to save your CV as a printable file",
      position: "download", // near download button
      target: "download-button"
    }
  ];

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      localStorage.setItem('cvBuilderTutorialSeen', 'true');
    }
  };

  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const skipTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('cvBuilderTutorialSeen', 'true');
  };

  const generateShareLink = () => {
    const encodedData = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}?cv=${encodedData}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  // Helper functions
  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        company: "Company Name",
        role: "Your Role",
        year: "2024",
        points: ["Key achievement"]
      }]
    }));
  };

  const removeExperience = (id) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addProduct = () => {
    setData(prev => ({
      ...prev,
      products: [...prev.products, {
        id: Date.now(),
        title: "Product Name",
        role: "Role",
        points: ["Description"]
      }]
    }));
  };

  const removeProduct = (id) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(prod => prod.id !== id)
    }));
  };

  const addPoint = (expId) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === expId 
          ? { ...exp, points: [...exp.points, "New point"] }
          : exp
      )
    }));
  };

  const removePoint = (expId, pointIndex) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === expId 
          ? { ...exp, points: exp.points.filter((_, i) => i !== pointIndex) }
          : exp
      )
    }));
  };

  const addProductPoint = (prodId) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(prod => 
        prod.id === prodId 
          ? { ...prod, points: [...prod.points, "New point"] }
          : prod
      )
    }));
  };

  const removeProductPoint = (prodId, pointIndex) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(prod => 
        prod.id === prodId 
          ? { ...prod, points: prod.points.filter((_, i) => i !== pointIndex) }
          : prod
      )
    }));
  };

  const addSkill = () => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, "New Skill"]
    }));
  };

  const removeSkill = (index) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    setData(prev => ({
      ...prev,
      certifications: [...prev.certifications, "Certification Name"]
    }));
  };

  const removeCertification = (index) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addRecognition = () => {
    setData(prev => ({
      ...prev,
      recognition: [...prev.recognition, "Award or Recognition"]
    }));
  };

  const removeRecognition = (index) => {
    setData(prev => ({
      ...prev,
      recognition: prev.recognition.filter((_, i) => i !== index)
    }));
  };

  const exportPDF = () => {
    const htmlContent = generateHTMLContent(data);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.toLowerCase().replace(/\s+/g, '-')}-cv.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('HTML downloaded! Open it, then use Cmd+P (Mac) or Ctrl+P (Windows) to save as PDF.');
  };

  const generateHTMLContent = (data) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${data.name} - CV</title>
    <style>
        @page { margin: 5mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px 20px; background: #f5f5f5; }
        .container { background: white; padding: 60px; max-width: 1000px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: 1.4fr 0.6fr; gap: 40px; }
        .label { font-size: 9px; letter-spacing: 0.2em; color: #999; margin-bottom: 15px; font-weight: 500; }
        h1 { font-size: 32px; font-weight: 400; margin-bottom: 20px; color: #000; line-height: 1.1; }
        h2 { font-size: 24px; font-weight: 400; margin-bottom: 20px; color: #000; line-height: 1.2; }
        .bio { font-size: 13px; color: #666; margin-bottom: 25px; line-height: 1.6; }
        .contact-item { font-size: 12px; color: #666; margin-bottom: 6px; line-height: 1.6; }
        .contact-label { font-weight: 500; color: #000; margin-right: 4px; }
        .skill-item { font-size: 12px; color: #666; margin-bottom: 6px; line-height: 1.6; }
        .item { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e5e5; }
        .item:last-child { border-bottom: none; }
        .header { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .company { font-size: 14px; font-weight: 500; color: #000; line-height: 1.3; }
        .year { font-size: 11px; color: #999; }
        .role { font-size: 12px; color: #666; margin-bottom: 8px; line-height: 1.4; }
        .prod-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
        .prod-title { font-size: 14px; font-weight: 500; color: #000; }
        .prod-role { font-size: 12px; color: #666; }
        ul { list-style: none; margin-bottom: 4px; }
        li { font-size: 12px; color: #666; margin-bottom: 5px; padding-left: 15px; position: relative; line-height: 1.6; }
        li:before { content: "•"; position: absolute; left: 0; color: #999; }
        @media print { body { background: white; padding: 0; } .container { box-shadow: none; padding: 8mm 10mm; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="grid">
            <div>
                <div class="label">SELECTED WORK</div>
                <h2>Work</h2>
                ${data.experience.map(exp => `
                    <div class="item">
                        <div class="header"><div class="company">${exp.company}</div><div class="year">${exp.year}</div></div>
                        <div class="role">${exp.role}</div>
                        <ul>${exp.points.map(p => `<li>${p}</li>`).join('')}</ul>
                    </div>
                `).join('')}
                <div style="margin-top: 40px;">
                    <h2>Notable Projects</h2>
                    ${data.products.map(prod => `
                        <div class="item">
                            <div class="prod-header">
                                <span class="prod-title">${prod.title}</span>
                                <span style="color: #999;">-</span>
                                <span class="prod-role">${prod.role}</span>
                            </div>
                            <ul>${prod.points.map(p => `<li>${p}</li>`).join('')}</ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div>
                <div class="label">CURRICULUM VITAE</div>
                <h1>${data.name}</h1>
                <div class="bio">${data.bio}</div>
                <div style="margin-bottom: 25px;">
                    <div class="contact-item"><span class="contact-label">Email:</span>${data.email}</div>
                    <div class="contact-item"><span class="contact-label">Twitter:</span>${data.twitter}</div>
                    <div class="contact-item"><span class="contact-label">LinkedIn:</span>${data.linkedin}</div>
                </div>
                <div class="label" style="margin-top: 30px;">SKILLS</div>
                <div style="margin-bottom: 20px;">${data.skills.map(s => `<div class="skill-item">${s}</div>`).join('')}</div>
                <div class="label" style="margin-top: 30px;">CERTIFICATIONS</div>
                <div style="margin-bottom: 20px;">${data.certifications.map(c => `<div class="skill-item">${c}</div>`).join('')}</div>
                <div class="label" style="margin-top: 30px;">RECOGNITION</div>
                <div>${data.recognition.map(r => `<div class="skill-item">${r}</div>`).join('')}</div>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  return (
    <div className="app">
      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className={`tutorial-modal tutorial-${tutorialSteps[tutorialStep].position}`}>
            <button className="tutorial-skip" onClick={skipTutorial}>Skip</button>
            
            <div className="tutorial-content">
              <h3 className="tutorial-title">{tutorialSteps[tutorialStep].title}</h3>
              <p className="tutorial-message">{tutorialSteps[tutorialStep].message}</p>
            </div>

            <div className="tutorial-footer">
              <div className="tutorial-dots">
                {tutorialSteps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`tutorial-dot ${idx === tutorialStep ? 'active' : ''}`}
                  />
                ))}
              </div>

              <div className="tutorial-buttons">
                {tutorialStep > 0 && (
                  <button className="tutorial-btn tutorial-back" onClick={prevTutorialStep}>
                    Back
                  </button>
                )}
                <button className="tutorial-btn tutorial-next" onClick={nextTutorialStep}>
                  {tutorialStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="tutorial-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="share-title">Share Your CV</h3>
            <p className="share-message">Anyone with this link can view your CV</p>
            
            <div className="share-link-container">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="share-link-input"
                onClick={(e) => e.target.select()}
              />
            </div>

            <div className="share-buttons">
              <button className="tutorial-btn tutorial-back" onClick={() => setShowShareModal(false)}>
                Close
              </button>
              <button className="tutorial-btn tutorial-next" onClick={copyShareLink}>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="control-bar">
        <div className="control-content">
          <h2 className="app-title">CV Builder</h2>
          <button onClick={() => setIsEditing(!isEditing)} className={`mode-btn ${isEditing ? 'active' : ''}`}>
            {isEditing ? 'Save Changes' : 'Start Editing'}
          </button>
        </div>
      </div>

      {/* Floating Action Buttons - Bottom Right */}
      <div className="floating-actions">
        <button onClick={generateShareLink} className="fab fab-share" title="Share">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
        <button onClick={exportPDF} className="fab fab-download" title="Download PDF">
          <Download size={20} />
        </button>
      </div>

      <div className="cv-content">
        <div className="cv-grid">
          {/* Work & Projects Column */}
          <div className="work-col">
            <div className="label">SELECTED WORK</div>
            <h2 className="heading">Work</h2>

            {isEditing && <button onClick={addExperience} className="add-btn">+ Add Experience</button>}

            {data.experience.map((exp, i) => (
              <div key={exp.id} className={`exp-item ${i < data.experience.length - 1 ? 'bordered' : ''}`}>
                {isEditing && <button onClick={() => removeExperience(exp.id)} className="remove-btn"><Trash2 size={16} /></button>}
                
                <div className="exp-header">
                  <div className="company"><EditableText isEditing={isEditing} value={exp.company} onChange={(v) => setData(p => ({...p, experience: p.experience.map(e => e.id === exp.id ? {...e, company: v} : e)}))} placeholder="Company" /></div>
                  <div className="year"><EditableText isEditing={isEditing} value={exp.year} onChange={(v) => setData(p => ({...p, experience: p.experience.map(e => e.id === exp.id ? {...e, year: v} : e)}))} placeholder="2024" /></div>
                </div>

                <div className="role"><EditableText isEditing={isEditing} value={exp.role} onChange={(v) => setData(p => ({...p, experience: p.experience.map(e => e.id === exp.id ? {...e, role: v} : e)}))} placeholder="Role" /></div>

                <ul className="points">
                  {exp.points.map((point, idx) => (
                    <li key={idx}>
                      <span>•</span>
                      <div className="point-wrap">
                        <EditableText isEditing={isEditing} value={point} onChange={(v) => setData(p => ({...p, experience: p.experience.map(e => e.id === exp.id ? {...e, points: e.points.map((pt, i) => i === idx ? v : pt)} : e)}))} multiline placeholder="Point" />
                        {isEditing && <button onClick={() => removePoint(exp.id, idx)} className="del-btn"><Trash2 size={12} /></button>}
                      </div>
                    </li>
                  ))}
                </ul>

                {isEditing && <button onClick={() => addPoint(exp.id)} className="add-point">+ Add point</button>}
              </div>
            ))}

            <div className="projects">
              <h2 className="heading">Notable Projects</h2>
              {isEditing && <button onClick={addProduct} className="add-btn">+ Add Project</button>}

              {data.products.map((prod, i) => (
                <div key={prod.id} className={`exp-item ${i < data.products.length - 1 ? 'bordered' : ''}`}>
                  {isEditing && <button onClick={() => removeProduct(prod.id)} className="remove-btn"><Trash2 size={16} /></button>}
                  
                  <div className="prod-header">
                    <EditableText isEditing={isEditing} value={prod.title} onChange={(v) => setData(p => ({...p, products: p.products.map(pr => pr.id === prod.id ? {...pr, title: v} : pr)}))} placeholder="Project" />
                    <span className="dash">-</span>
                    <EditableText isEditing={isEditing} value={prod.role} onChange={(v) => setData(p => ({...p, products: p.products.map(pr => pr.id === prod.id ? {...pr, role: v} : pr)}))} placeholder="Role" />
                  </div>

                  <ul className="points">
                    {prod.points.map((point, idx) => (
                      <li key={idx}>
                        <span>•</span>
                        <div className="point-wrap">
                          <EditableText isEditing={isEditing} value={point} onChange={(v) => setData(p => ({...p, products: p.products.map(pr => pr.id === prod.id ? {...pr, points: pr.points.map((pt, i) => i === idx ? v : pt)} : pr)}))} multiline placeholder="Point" />
                          {isEditing && <button onClick={() => removeProductPoint(prod.id, idx)} className="del-btn"><Trash2 size={12} /></button>}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {isEditing && <button onClick={() => addProductPoint(prod.id)} className="add-point">+ Add point</button>}
                </div>
              ))}
            </div>
          </div>

          {/* CV Info Sidebar */}
          <div className="cv-sidebar">
            <div className="label">CURRICULUM VITAE</div>
            <div className="name"><EditableText isEditing={isEditing} value={data.name} onChange={(v) => setData(p => ({...p, name: v}))} placeholder="Name" /></div>
            <div className="bio"><EditableText isEditing={isEditing} value={data.bio} onChange={(v) => setData(p => ({...p, bio: v}))} multiline placeholder="Bio" /></div>
            
            <div className="contact">
              <div className="contact-item"><span className="contact-label">Email:</span> <EditableText isEditing={isEditing} value={data.email} onChange={(v) => setData(p => ({...p, email: v}))} placeholder="email" /></div>
              <div className="contact-item"><span className="contact-label">Twitter:</span> <EditableText isEditing={isEditing} value={data.twitter} onChange={(v) => setData(p => ({...p, twitter: v}))} placeholder="@twitter" /></div>
              <div className="contact-item"><span className="contact-label">LinkedIn:</span> <EditableText isEditing={isEditing} value={data.linkedin} onChange={(v) => setData(p => ({...p, linkedin: v}))} placeholder="linkedin" /></div>
            </div>

            <div className="label sidebar-label">SKILLS</div>
            <div className="list">
              {data.skills.map((s, i) => (
                <div key={i} className="list-item">
                  <EditableText isEditing={isEditing} value={s} onChange={(v) => setData(p => ({...p, skills: p.skills.map((sk, idx) => idx === i ? v : sk)}))} placeholder="Skill" />
                  {isEditing && <button onClick={() => removeSkill(i)} className="del-btn"><Trash2 size={12} /></button>}
                </div>
              ))}
              {isEditing && <button onClick={addSkill} className="add-list">+ Add Skill</button>}
            </div>

            <div className="label sidebar-label">CERTIFICATIONS</div>
            <div className="list">
              {data.certifications.map((c, i) => (
                <div key={i} className="list-item">
                  <EditableText isEditing={isEditing} value={c} onChange={(v) => setData(p => ({...p, certifications: p.certifications.map((cert, idx) => idx === i ? v : cert)}))} placeholder="Cert" />
                  {isEditing && <button onClick={() => removeCertification(i)} className="del-btn"><Trash2 size={12} /></button>}
                </div>
              ))}
              {isEditing && <button onClick={addCertification} className="add-list">+ Add Certification</button>}
            </div>

            <div className="label sidebar-label">RECOGNITION</div>
            <div className="list">
              {data.recognition.map((r, i) => (
                <div key={i} className="list-item">
                  <EditableText isEditing={isEditing} value={r} onChange={(v) => setData(p => ({...p, recognition: p.recognition.map((rec, idx) => idx === i ? v : rec)}))} placeholder="Award" />
                  {isEditing && <button onClick={() => removeRecognition(i)} className="del-btn"><Trash2 size={12} /></button>}
                </div>
              ))}
              {isEditing && <button onClick={addRecognition} className="add-list">+ Add Recognition</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
