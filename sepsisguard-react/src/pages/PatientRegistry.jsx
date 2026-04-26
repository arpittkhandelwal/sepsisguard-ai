import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const PatientRegistry = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'M',
    department: 'Emergency Ward',
    bmi: ''
  });

  const fetchPatients = async () => {
    const data = await api.getPatients();
    setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Critical': return 'bg-error/10 text-error border-error/20';
      case 'High Risk': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Watch': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Stable': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <span className="material-symbols-outlined text-error">trending_up</span>;
      case 'flat': return <span className="material-symbols-outlined text-amber-500">trending_flat</span>;
      case 'down': return <span className="material-symbols-outlined text-green-500">trending_down</span>;
      default: return null;
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const result = await api.createPatient({
        ...newPatient,
        age: Number(newPatient.age) || 45,
        bmi: Number(newPatient.bmi) || 24.5
      });
      
      if (result) {
        setIsModalOpen(false);
        setNewPatient({ name: '', age: '', gender: 'M', department: 'Emergency Ward', bmi: '' });
        await fetchPatients(); // Wait for fresh data
      }
    } catch (err) {
      console.error("Failed to add patient:", err);
      alert("Error adding patient. Please check your connection.");
    }
  };

  const filteredPatients = patients.filter(p => 
    p.status !== 'Discharged' && 
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
  );
  
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Layout>
      <section className="mb-xl">
        <div className="flex justify-between items-end mb-md">
          <div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Mission Critical</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">Priority Queue</h1>
          </div>
          <div className="flex gap-2">
            <span className="bg-error/10 text-error px-3 py-1 rounded text-[11px] font-bold border border-error/20 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error"></span> {patients.filter(p => p.status === 'Critical').length} CRITICAL ACTIONS REQUIRED
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-xs">
          {patients.slice().sort((a,b) => b.riskScore - a.riskScore).slice(0, 5).map((p) => (
            <div key={p.id} className={`bg-white border ${p.status === 'Critical' ? 'border-error/30 hover:border-error' : 'border-outline-variant hover:border-on-surface'} p-lg relative overflow-hidden group transition-colors`}>
              {p.status === 'Critical' && (
                <div className="absolute top-0 right-0 p-1 bg-error text-white font-bold text-[9px] uppercase tracking-tighter">Immediate</div>
              )}
              <p className="font-label-caps text-label-caps text-on-surface-variant">{p.id} ({p.bed})</p>
              <h3 className="font-headline-md text-headline-md mt-1 mb-base">{p.name}</h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className={`font-vital-sign text-vital-sign ${p.status === 'Critical' ? 'text-error' : 'text-on-surface'}`}>{p.riskScore}%</span>
                {getTrendIcon(p.riskTrend)}
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase mt-1">Risk Probability</p>
              <Link to={`/patient/${p.id}`} className={`mt-lg w-full ${p.status === 'Critical' ? 'bg-primary text-white' : 'bg-primary-container text-white'} py-2 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity block text-center rounded`}>Review Case</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-outline-variant">
        <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center flex-wrap gap-md">
          <h2 className="font-headline-md text-headline-md">Patient Registry</h2>
          <div className="flex gap-xs">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                className="pl-10 pr-4 py-2 border border-outline-variant text-xs font-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none min-w-[280px]" 
                placeholder="Search by Name or ID" 
                type="text"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}
              />
            </div>
            <button className="px-4 py-2 border border-outline-variant text-[11px] font-bold uppercase tracking-wider hover:bg-surface transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filter
            </button>
            <button className="px-4 py-2 border border-outline-variant text-[11px] font-bold uppercase tracking-wider hover:bg-surface transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span> Export
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm rounded ml-2">
              <span className="material-symbols-outlined text-sm">person_add</span> New Admission
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-caps text-label-caps uppercase">
                <th className="py-3 px-lg font-bold">Patient ID</th>
                <th className="py-3 px-lg font-bold">Patient Name</th>
                <th className="py-3 px-lg font-bold">Demographics</th>
                <th className="py-3 px-lg font-bold">Risk Score</th>
                <th className="py-3 px-lg font-bold">Trend</th>
                <th className="py-3 px-lg font-bold">Status</th>
                <th className="py-3 px-lg font-bold">Department</th>
                <th className="py-3 px-lg font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-body-md font-body-md divide-y divide-outline-variant/30">
              {paginatedPatients.map(p => (
                <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="py-4 px-lg font-data-mono text-data-mono">{p.id}</td>
                  <td className="py-4 px-lg font-semibold">{p.name}</td>
                  <td className="py-4 px-lg text-on-surface-variant">{p.age} {p.gender} | BMI {p.bmi}</td>
                  <td className="py-4 px-lg"><span className={`${p.riskScore > 75 ? 'text-error' : 'text-on-surface'} font-bold`}>{p.riskScore}%</span></td>
                  <td className="py-4 px-lg">{getTrendIcon(p.riskTrend)}</td>
                  <td className="py-4 px-lg">
                    <span className={`${getStatusStyle(p.status)} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border`}>{p.status}</span>
                  </td>
                  <td className="py-4 px-lg text-on-surface-variant">{p.department}</td>
                  <td className="py-4 px-lg text-right">
                    <Link to={`/patient/${p.id}`} className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">View Details</Link>
                  </td>
                </tr>
              ))}
              {paginatedPatients.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-on-surface-variant">No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-lg py-md border-t border-outline-variant flex justify-between items-center bg-surface-container-low">
          <span className="text-[11px] font-bold uppercase text-on-surface-variant">Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients</span>
          <div className="flex gap-base">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 border border-outline-variant hover:bg-surface transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="px-3 py-1 border border-primary bg-primary text-white text-[11px] font-bold">{currentPage}</button>
            <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 border border-outline-variant hover:bg-surface transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Removed local FAB to prevent overlap with global AI Assistant */}

      {/* New Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-outline-variant transform animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-8 py-6 bg-slate-50 border-b border-outline-variant flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">New Admission Profile</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Sepsis Surveillance Enrollment</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">Patient Full Name</label>
                  <input 
                    required 
                    value={newPatient.name} 
                    onChange={e => setNewPatient({...newPatient, name: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-outline-variant rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" 
                    placeholder="Enter full name" 
                    type="text" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">Age (Years)</label>
                  <input 
                    required 
                    value={newPatient.age} 
                    onChange={e => setNewPatient({...newPatient, age: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-outline-variant rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" 
                    placeholder="Age" 
                    type="number" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">Gender</label>
                  <select 
                    value={newPatient.gender} 
                    onChange={e => setNewPatient({...newPatient, gender: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-outline-variant rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none bg-white transition-all cursor-pointer"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">BMI Value</label>
                  <input 
                    required 
                    value={newPatient.bmi} 
                    onChange={e => setNewPatient({...newPatient, bmi: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-outline-variant rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" 
                    placeholder="e.g. 24.5" 
                    type="number" 
                    step="0.1" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">Admitting Unit</label>
                  <select 
                    value={newPatient.department} 
                    onChange={e => setNewPatient({...newPatient, department: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-outline-variant rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none bg-white transition-all cursor-pointer"
                  >
                    <option value="Emergency Ward">Emergency Ward</option>
                    <option value="ICU Unit Alpha">ICU Unit Alpha</option>
                    <option value="Medical Ward">Medical Ward</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 text-[11px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors uppercase tracking-widest"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-lg hover:bg-slate-800 transition-all uppercase tracking-widest hover:translate-y-[-1px] active:translate-y-0"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PatientRegistry;
