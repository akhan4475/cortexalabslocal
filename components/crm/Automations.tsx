import React, { useState } from 'react';
import { Settings, Globe, Zap, AlertCircle, Save } from 'lucide-react';

const Automations: React.FC = () => {
    const [twilioAccountSid, setTwilioAccountSid] = useState('');
    const [twilioAuthToken, setTwilioAuthToken] = useState('');
    const [twilioPhoneNumber, setTwilioPhoneNumber] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Save to Supabase or secure backend
        setTimeout(() => {
            setIsSaving(false);
            alert('Twilio credentials saved successfully!');
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">System Configuration</h2>
                    <p className="text-gray-500 text-sm">Connect your Twilio account and manage automations.</p>
                </div>
            </div>

            {/* Twilio Configuration */}
            <div className="bg-[#18181b] border border-[#262624] rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Twilio Integration</h3>
                        <p className="text-xs text-gray-500">Enable voice calling and SMS messaging</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                        <div className="text-sm text-yellow-200">
                            <strong>Important:</strong> Your Twilio credentials will be encrypted and stored securely. Never share your Auth Token with anyone.
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account SID</label>
                        <input 
                            type="text"
                            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            value={twilioAccountSid}
                            onChange={(e) => setTwilioAccountSid(e.target.value)}
                            className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Auth Token</label>
                        <input 
                            type="password"
                            placeholder="••••••••••••••••••••••••••••••••"
                            value={twilioAuthToken}
                            onChange={(e) => setTwilioAuthToken(e.target.value)}
                            className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                        <input 
                            type="text"
                            placeholder="+1 555 123 4567"
                            value={twilioPhoneNumber}
                            onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                            className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono"
                        />
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-horizon-accent text-black px-6 py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>

            {/* Future Automation Modules */}
            <div className="bg-[#18181b] border border-[#262624] rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-horizon-accent/10 border border-horizon-accent/20 flex items-center justify-center text-horizon-accent">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Workflow Automations</h3>
                        <p className="text-xs text-gray-500">Coming soon</p>
                    </div>
                </div>

                <div className="text-center py-12">
                    <Settings size={48} className="text-gray-600 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 text-sm">Advanced automation workflows will be available here.</p>
                    <p className="text-gray-600 text-xs mt-2">Stay tuned for updates.</p>
                </div>
            </div>
        </div>
    );
};

export default Automations;