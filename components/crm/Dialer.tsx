import React, { useState, useMemo, useEffect } from 'react';
import { Phone, PhoneOff, Save, ArrowLeft, ChevronRight, MessageSquare, ClipboardList, CheckCircle2, AlertCircle, FileText, Delete, Mail } from 'lucide-react';
import { Lead, Campaign } from './types';

const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('new')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (s.includes('booked')) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (s.includes('not interested')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (s.includes('follow-up') || s.includes('voicemail') || s.includes('wrong number')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

interface DialerProps {
    campaigns: Campaign[];
    allLeads: Lead[];
    onUpdateLeadStatus: (leadId: string, newStatus: string) => void;
    initialLeadId?: string;
    initialCampaignId?: string;
}

const Dialer: React.FC<DialerProps> = ({ campaigns, allLeads, onUpdateLeadStatus, initialLeadId, initialCampaignId }) => {
    // --- Dialer State ---
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isCallActive, setIsCallActive] = useState(false);
    const [callTime, setCallTime] = useState(0);
    const [script, setScript] = useState(`INTRO / PATTERN INTERRUPT:
"Hey is this [Name]?"
"Hey [Name], this is [Your Name] from Horizon AI, how've you been?"

REASON FOR CALL:
"I'm calling because I saw you were looking into AI automation solutions recently..."`);

    // --- Right Panel State ---
    const [view, setView] = useState<'campaigns' | 'leads' | 'lead-detail'>('campaigns');
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [callNote, setCallNote] = useState('');
    const [selectedOutcome, setSelectedOutcome] = useState('');
    const [showOutcomeError, setShowOutcomeError] = useState(false);

    // Initial navigation handling
    useEffect(() => {
        if (initialCampaignId) {
            const camp = campaigns.find(c => c.id === initialCampaignId);
            if (camp) {
                setSelectedCampaign(camp);
                setView('leads');
                
                if (initialLeadId) {
                    const lead = allLeads.find(l => l.id === initialLeadId);
                    if (lead) {
                        selectLead(lead);
                    }
                }
            }
        }
    }, [initialLeadId, initialCampaignId, campaigns, allLeads]);

    // Helper to get numeric sort order from ID (extracted from last segment)
    const getLeadSortOrder = (id: string) => {
        const parts = id.split('-');
        const suffix = parts[parts.length - 1];
        const match = suffix.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    };

    const filteredLeads = useMemo(() => {
        if (!selectedCampaign) return [];
        let leads = allLeads.filter(l => l.campaignId === selectedCampaign.id);
        // Ensure leads are sorted by their upload order
        leads.sort((a, b) => getLeadSortOrder(a.id) - getLeadSortOrder(b.id));
        return leads;
    }, [selectedCampaign, allLeads]);

    const handleDigitClick = (digit: string) => {
        setPhoneNumber(prev => prev + digit);
    };

    const handleCallToggle = () => {
        if (!phoneNumber) return;
        setIsCallActive(prev => !prev);
        if (!isCallActive) setCallTime(0);
    };

    const selectLead = (lead: Lead) => {
        setSelectedLead(lead);
        setPhoneNumber(lead.phone);
        setView('lead-detail');
        setSelectedOutcome('');
        setCallNote('');
        setShowOutcomeError(false);
    };

    const handleBackspace = () => setPhoneNumber(prev => prev.slice(0, -1));

    const handleNextLead = () => {
        if (!selectedOutcome || selectedOutcome === 'Select Disposition...') {
            setShowOutcomeError(true);
            return;
        }
        setShowOutcomeError(false);
        if (selectedLead) onUpdateLeadStatus(selectedLead.id, selectedOutcome);
        
        const currentIndex = filteredLeads.findIndex(l => l.id === selectedLead?.id);
        if (currentIndex !== -1 && currentIndex < filteredLeads.length - 1) {
            selectLead(filteredLeads[currentIndex + 1]);
        } else {
            alert("End of lead list for this campaign.");
            setView('leads');
            setSelectedLead(null);
        }
    };

    return (
        <div className="h-full min-h-0 max-h-[calc(100vh-110px)] grid grid-cols-12 gap-6 overflow-hidden">
            {/* Left Column: Dialer Controls */}
            <div className="col-span-4 flex flex-col h-full min-h-0">
                <div className="bg-[#18181b] border border-[#262624] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-xl min-h-0">
                    <div className="p-5 border-b border-[#262624] bg-[#262624]/20 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-horizon-accent/20 flex items-center justify-center">
                                <Phone className="text-horizon-accent" size={16} />
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block">Service Provider</span>
                                <span className="text-xs font-bold text-white">Twilio Cloud Dialer</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center p-8 overflow-y-auto no-scrollbar">
                        <div className="relative mb-8">
                            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-transparent text-center text-4xl font-mono text-white focus:outline-none border-b border-transparent focus:border-horizon-accent/30 pb-4" placeholder="Enter Number" />
                            {phoneNumber && <button onClick={handleBackspace} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white transition-colors"><Delete size={20} /></button>}
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-10 max-w-[320px] mx-auto w-full">
                            {['1','2','3','4','5','6','7','8','9','*','0','#'].map((digit) => (
                                <button key={digit} onClick={() => handleDigitClick(digit)} className="aspect-square rounded-full bg-[#262624] hover:bg-[#333] text-white text-3xl font-bold transition-all active:scale-95 flex items-center justify-center border border-[#333] hover:border-horizon-accent/30 shadow-lg">{digit}</button>
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <button onClick={handleCallToggle} disabled={!phoneNumber} className={`w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${isCallActive ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'}`}>{isCallActive ? <PhoneOff size={36} className="text-white" /> : <Phone size={36} className="text-white" />}</button>
                        </div>
                        {isCallActive && <div className="text-center mt-10"><div className="text-horizon-accent font-mono text-3xl font-bold animate-pulse">00:12</div><div className="text-gray-500 text-sm mt-2 uppercase tracking-widest font-bold">Calling {selectedLead?.name || 'External'}...</div></div>}
                    </div>
                </div>
            </div>

            {/* Center Column: Script */}
            <div className="col-span-4 h-full flex flex-col min-h-0">
                <div className="bg-[#18181b] border border-[#262624] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg min-h-0">
                    <div className="p-5 border-b border-[#262624] flex justify-between items-center bg-[#262624]/20 shrink-0">
                        <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-horizon-accent" /> Pitch Blueprint</h3>
                        <button className="text-xs bg-horizon-accent/10 text-horizon-accent px-3 py-1.5 rounded-lg font-bold border border-horizon-accent/20 hover:bg-horizon-accent hover:text-black transition-all flex items-center gap-1.5"><Save size={14} /> Update</button>
                    </div>
                    <textarea value={script} onChange={(e) => setScript(e.target.value)} className="flex-1 w-full bg-transparent p-6 text-gray-300 text-sm leading-relaxed focus:outline-none resize-none no-scrollbar font-mono" />
                </div>
            </div>

            {/* Right Column: Lead Selection */}
            <div className="col-span-4 h-full flex flex-col min-h-0">
                <div className="bg-[#18181b] border border-[#262624] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg min-h-0">
                    <div className="p-5 border-b border-[#262624] flex items-center justify-between bg-[#262624]/20 shrink-0">
                        {view === 'campaigns' ? <h3 className="font-bold text-white flex items-center gap-2"><ClipboardList size={18} className="text-horizon-accent" /> Campaigns</h3> :
                        view === 'leads' ? <div className="flex items-center gap-3"><button onClick={() => setView('campaigns')} className="p-1 hover:bg-[#333] rounded text-gray-400"><ArrowLeft size={18} /></button><h3 className="font-bold text-white truncate">{selectedCampaign?.name}</h3></div> :
                        <div className="flex items-center gap-3"><button onClick={() => setView('leads')} className="p-1 hover:bg-[#333] rounded text-gray-400"><ArrowLeft size={18} /></button><h3 className="font-bold text-white uppercase text-xs tracking-widest">Lead Intelligence</h3></div>}
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar min-h-0">
                        {view === 'campaigns' && <div className="p-4 space-y-3">{campaigns.map(c => <button key={c.id} onClick={() => { setSelectedCampaign(c); setView('leads'); }} className="w-full text-left p-4 bg-[#09090b] border border-[#262624] rounded-xl hover:border-horizon-accent/50 transition-all flex items-center justify-between group"><div><div className="font-bold text-white">{c.name}</div><div className="text-xs text-gray-500">{c.leadCount} Leads</div></div><ChevronRight size={16} /></button>)}</div>}
                        {view === 'leads' && <div className="divide-y divide-[#262624]">{filteredLeads.map(l => <button key={l.id} onClick={() => selectLead(l)} className="w-full text-left p-4 hover:bg-[#262624]/30 transition-colors flex items-center justify-between"><div><div className="font-bold text-white truncate">{l.name}</div><div className="text-xs text-gray-500 truncate">{l.company}</div></div><span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${getStatusStyles(l.status)}`}>{l.status}</span></button>)}</div>}
                        {view === 'lead-detail' && selectedLead && (
                            <div className="p-6">
                                <div className="text-center mb-8"><div className="w-16 h-16 rounded-full bg-gradient-to-tr from-horizon-accent to-emerald-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">{selectedLead.name[0]}</div><h2 className="text-2xl font-bold text-white">{selectedLead.name}</h2><p className="text-horizon-accent text-sm font-bold uppercase tracking-widest">{selectedLead.company}</p></div>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 p-4 bg-[#09090b] rounded-xl border border-[#262624]"><div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Phone size={16} /></div><div><div className="text-[10px] text-gray-500 uppercase font-bold">Direct Line</div><div className="text-sm font-mono text-gray-200">{selectedLead.phone}</div></div></div>
                                    <div className="flex items-center gap-4 p-4 bg-[#09090b] rounded-xl border border-[#262624]"><div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Mail size={16} /></div><div><div className="text-[10px] text-gray-500 uppercase font-bold">Email Address</div><div className="text-sm text-gray-200">{selectedLead.email || 'N/A'}</div></div></div>
                                </div>
                                <div className="space-y-6">
                                    <div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Call Outcome</label><select value={selectedOutcome} onChange={(e) => { setSelectedOutcome(e.target.value); setShowOutcomeError(false); }} className={`w-full bg-[#09090b] border rounded-xl px-4 py-3 text-sm focus:border-horizon-accent ${showOutcomeError ? 'border-red-500/50' : 'border-[#262624]'}`}><option>Select Disposition...</option><option>Demo Booked</option><option>Not Interested</option><option>Wrong Number</option><option>Voicemail</option><option>Follow-up Required</option></select></div>
                                    <button onClick={handleNextLead} className="w-full bg-horizon-accent text-black font-bold py-3.5 rounded-xl shadow-lg">Submit & Next Lead</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dialer;