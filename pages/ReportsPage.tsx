import React, { useState, useMemo } from 'react';
import { Fine, Impression } from '../types';
import { SlidersHorizontal, FileDown, FileText, Loader2, LineChart as LineChartIcon, PieChart as PieChartIcon, ListChecks } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from 'recharts';


// Make jspdf and papaparse available from window
declare global {
  interface Window {
    jspdf: any;
    Papa: any;
  }
}

// MOCK DATA
const mockFines: (Fine & { zone: string })[] = [
    { id: '1', plate: 'GOM45D', reason: 'Feu rouge grillé', driver: 'Marie', location: 'Centre-ville', date: '2025-10-10T10:00:00Z', amount: 80000, currency: 'CDF', status: 'En attente', zone: 'Goma' },
    { id: '2', plate: 'BB123C', reason: 'Assurance expirée', driver: 'Richard', location: 'Keshero', date: '2025-10-07T11:00:00Z', amount: 200000, currency: 'CDF', status: 'Payée', zone: 'Goma' },
    { id: '3', plate: 'KIN89Z', reason: 'Stationnement interdit', driver: 'Jean', location: 'Lycée Wima', date: '2025-09-05T12:00:00Z', amount: 50000, currency: 'CDF', status: 'En retard', zone: 'Kinshasa' },
    { id: '4', plate: '1234AB', reason: 'Excès de vitesse', driver: 'Salomon', location: 'Aéroport', date: '2025-09-02T13:00:00Z', amount: 120000, currency: 'CDF', status: 'Payée', zone: 'Goma' },
    { id: '5', plate: 'GOM 456 CD', reason: 'Défaut de casque', driver: 'Kavira Mukeba', location: 'Rond-point Signers', date: '2025-08-01T14:00:00Z', amount: 25000, currency: 'CDF', status: 'En attente', zone: 'Bukavu' },
    { id: '6', plate: 'KIN11A', reason: 'Excès de vitesse', driver: 'Alice', location: 'Gombe', date: '2025-10-15T10:00:00Z', amount: 120000, currency: 'CDF', status: 'Payée', zone: 'Kinshasa' },
];

const mockImpressions: Impression[] = [
    { id: 'p1', documentType: 'Permis', agentName: 'Agent Tambua', date: '2025-10-22T09:15:00Z', identifier: 'P123456789', zone: 'Goma' },
    { id: 'p2', documentType: 'Carte Rose', agentName: 'John Doe', date: '2025-10-21T10:00:00Z', identifier: 'BB123C', zone: 'Goma' },
    { id: 'p3', documentType: 'Attestation', agentName: 'Agent Tambua', date: '2025-09-15T14:30:00Z', identifier: 'GOM 456 CD', zone: 'Bukavu' },
    { id: 'p4', documentType: 'Permis', agentName: 'John Doe', date: '2025-09-20T11:00:00Z', identifier: 'P987654321', zone: 'Kinshasa' },
    { id: 'p5', documentType: 'Permis', agentName: 'Agent Tambua', date: '2025-09-21T12:00:00Z', identifier: 'P555555555', zone: 'Goma' },
];
// END MOCK DATA

const StatCard: React.FC<{title: string, value: string | number, icon: React.ElementType}> = ({ title, value, icon: Icon }) => (
    <div className="bg-brand-50/60 p-4 rounded-lg">
        <div className="flex items-center">
            <div className="p-2 bg-brand-100 rounded-full mr-4">
                <Icon className="w-6 h-6 text-[--brand-400]" />
            </div>
            <div>
                <p className="text-sm font-medium text-[--text-muted]">{title}</p>
                <p className="text-2xl font-bold text-[--text-main]">{value}</p>
            </div>
        </div>
    </div>
);

const FineStatusBadge: React.FC<{ status: Fine['status'] }> = ({ status }) => {
    const classes = {
        'Payée': 'bg-[#1f8a3a] text-white',
        'En retard': 'bg-[#dc2626] text-white',
        'En attente': 'bg-[#f59e0b] text-white',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes[status]}`}>{status}</span>;
};


const CHART_COLORS = ['var(--brand-400)', 'var(--brand-600)', 'var(--accent-blue)', 'var(--accent-pink)', '#10B981'];

const ReportsPage: React.FC = () => {
    const [reportType, setReportType] = useState<'fines' | 'prints'>('fines');
    const [period, setPeriod] = useState('monthly');
    const [zone, setZone] = useState('all');
    const [generatedData, setGeneratedData] = useState<(Fine & { zone: string })[] | Impression[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateReport = () => {
        setIsLoading(true);
        setGeneratedData(null);
        setTimeout(() => {
            // This is a simplified filter logic. A real app would query the backend.
            const now = new Date();
            let startDate = new Date();
            if (period === 'monthly') startDate.setMonth(now.getMonth() - 1);
            if (period === 'weekly') startDate.setDate(now.getDate() - 7);
            // ... add other period logic

            if (reportType === 'fines') {
                const data = mockFines.filter(item => {
                    const itemDate = new Date(item.date);
                    const isInZone = zone === 'all' || item.zone === zone;
                    // const isInPeriod = itemDate >= startDate; // simplified for demo
                    return isInZone;
                });
                setGeneratedData(data);
            } else {
                const data = mockImpressions.filter(item => {
                    const itemDate = new Date(item.date);
                    const isInZone = zone === 'all' || item.zone === zone;
                     // const isInPeriod = itemDate >= startDate; // simplified for demo
                    return isInZone;
                });
                setGeneratedData(data);
            }
            setIsLoading(false);
        }, 1000);
    };
    
    const { summaryStats, chartData } = useMemo(() => {
        if (!generatedData) return { summaryStats: null, chartData: null };

        // --- Line Chart Data ---
        const getWeekOfMonth = (date: Date) => {
            const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
            const dayOfMonth = date.getDate();
            return Math.ceil((dayOfMonth + (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)) / 7);
        };
        
        let lineChartData: any[] = [];
        if (period === 'monthly' && generatedData.length > 0) {
            const weeklyAgg: { [key: string]: { amount: number, count: number } } = {
                'Sem 1': { amount: 0, count: 0 }, 'Sem 2': { amount: 0, count: 0 },
                'Sem 3': { amount: 0, count: 0 }, 'Sem 4': { amount: 0, count: 0 },
                'Sem 5': { amount: 0, count: 0 },
            };
            generatedData.forEach(item => {
                const date = new Date(item.date);
                const week = getWeekOfMonth(date);
                const weekKey = `Sem ${week}`;
                if (weeklyAgg[weekKey]) {
                    weeklyAgg[weekKey].count += 1;
                    if ('amount' in item) {
                        weeklyAgg[weekKey].amount += (item as Fine).amount;
                    }
                }
            });
             if(reportType === 'fines') {
                lineChartData = Object.entries(weeklyAgg).map(([name, data]) => ({ name, 'Montant (CDF)': data.amount }));
            } else {
                lineChartData = Object.entries(weeklyAgg).map(([name, data]) => ({ name, 'Impressions': data.count }));
            }
        }

        if (reportType === 'fines') {
            const finesData = generatedData as (Fine & { zone: string })[];
            const summary = {
                'Total Amendes': finesData.length,
                'Montant Perçu (CDF)': finesData.filter(f => f.status === 'Payée').reduce((sum, f) => sum + f.amount, 0).toLocaleString(),
                'Montant en Attente (CDF)': finesData.filter(f => f.status !== 'Payée').reduce((sum, f) => sum + f.amount, 0).toLocaleString(),
            };
            const statusCounts = finesData.reduce((acc, fine) => { acc[fine.status] = (acc[fine.status] || 0) + 1; return acc; }, {} as Record<Fine['status'], number>);
            const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
            const zoneCounts = finesData.reduce((acc, fine) => { acc[fine.zone] = (acc[fine.zone] || 0) + 1; return acc; }, {} as Record<string, number>);
            const barData = Object.entries(zoneCounts).map(([name, value]) => ({ name, 'Amendes': value }));
            return { summaryStats: summary, chartData: { pieData, barData, lineChartData } };
        } else {
            const printsData = generatedData as Impression[];
            const summary = {
                'Total Impressions': printsData.length,
                'Permis': printsData.filter(p => p.documentType === 'Permis').length,
                'Cartes Roses': printsData.filter(p => p.documentType === 'Carte Rose').length,
            };
            const typeCounts = printsData.reduce((acc, print) => { acc[print.documentType] = (acc[print.documentType] || 0) + 1; return acc; }, {} as Record<Impression['documentType'], number>);
            const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
            const agentCounts = printsData.reduce((acc, print) => { acc[print.agentName] = (acc[print.agentName] || 0) + 1; return acc; }, {} as Record<string, number>);
            const barData = Object.entries(agentCounts).map(([name, value]) => ({ name, 'Impressions': value }));
            return { summaryStats: summary, chartData: { pieData, barData, lineChartData } };
        }
    }, [generatedData, reportType, period]);
    
    const exportToPdf = () => {
        if (!generatedData || generatedData.length === 0) return;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const title = reportType === 'fines' ? 'Rapport des Amendes' : 'Rapport des Impressions';
        const date = new Date().toISOString().split('T')[0];
        const filename = `rapport_${reportType}_${date}.pdf`;

        doc.text(title, 14, 15);

        let head: string[][] = [];
        let body: (string|number)[][] = [];

        if (reportType === 'fines') {
            head = [['Date', 'Plaque', 'Motif', 'Montant', 'Statut', 'Zone']];
            const finesData = generatedData as (Fine & { zone: string })[];
            body = finesData.map(item => [
                new Date(item.date).toLocaleDateString(),
                item.plate,
                item.reason,
                `${item.amount.toLocaleString()} ${item.currency}`,
                item.status,
                item.zone
            ]);
        } else {
            head = [['Date', 'Type', 'Identifiant', 'Agent', 'Zone']];
            const printsData = generatedData as Impression[];
            body = printsData.map(item => [
                new Date(item.date).toLocaleDateString(),
                item.documentType,
                item.identifier,
                item.agentName,
                item.zone
            ]);
        }

        doc.autoTable({
            head: head,
            body: body,
            startY: 20,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [7, 166, 224] },
        });

        doc.save(filename);
    };

    const exportToCsv = () => {
        if (!generatedData || generatedData.length === 0 || !window.Papa) return;

        const csv = window.Papa.unparse(generatedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `rapport_${reportType}_${date}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[--text-main]">Générateur de Rapports</h1>
                <p className="text-sm text-[--text-muted]">Configurez et exportez des rapports détaillés.</p>
            </div>

            {/* Configuration Section */}
            <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
                <div className="flex items-center mb-4 border-b border-black/5 pb-3">
                    <SlidersHorizontal className="w-5 h-5 text-[--text-muted] mr-3" />
                    <h2 className="text-lg font-semibold text-[--text-main]">Configuration</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="reportType" className="block text-sm font-medium text-[--text-muted] mb-1">Type de rapport</label>
                        <select id="reportType" name="reportType" value={reportType} onChange={(e) => setReportType(e.target.value as any)} className="w-full px-3 py-2 bg-white border border-black/10 rounded-md shadow-sm text-sm text-[--text-main] focus:ring-[--brand-400] focus:border-[--brand-400]">
                            <option value="fines">Amendes</option>
                            <option value="prints">Impressions</option>
                        </select>
                    </div>
                    <div>
                         <label htmlFor="period" className="block text-sm font-medium text-[--text-muted] mb-1">Période</label>
                        <select id="period" name="period" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full px-3 py-2 bg-white border border-black/10 rounded-md shadow-sm text-sm text-[--text-main] focus:ring-[--brand-400] focus:border-[--brand-400]">
                            <option value="daily">Journalier</option>
                            <option value="weekly">Hebdomadaire</option>
                            <option value="monthly">Mensuel</option>
                            <option value="quarterly">Trimestriel</option>
                            <option value="semiannual">Semestriel</option>
                            <option value="annual">Annuel</option>
                        </select>
                    </div>
                    <div>
                         <label htmlFor="zone" className="block text-sm font-medium text-[--text-muted] mb-1">Zone</label>
                        <select id="zone" name="zone" value={zone} onChange={(e) => setZone(e.target.value)} className="w-full px-3 py-2 bg-white border border-black/10 rounded-md shadow-sm text-sm text-[--text-main] focus:ring-[--brand-400] focus:border-[--brand-400]">
                            <option value="all">Toutes les zones</option>
                            <option value="Goma">Goma</option>
                            <option value="Bukavu">Bukavu</option>
                            <option value="Kinshasa">Kinshasa</option>
                        </select>
                    </div>
                    <button onClick={handleGenerateReport} disabled={isLoading} className="w-full md:w-auto flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 rounded-lg transition-shadow disabled:opacity-70">
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <FileText className="w-5 h-5 mr-2" />}
                        {isLoading ? 'Génération...' : 'Générer'}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {generatedData && summaryStats && chartData && (
                <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5 space-y-8">
                    <div className="flex flex-wrap justify-between items-center border-b border-black/5 pb-3">
                         <h2 className="text-lg font-semibold text-[--text-main]">Résultats du Rapport</h2>
                         <div className="flex items-center space-x-2">
                             <button onClick={exportToPdf} className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg rounded-md transition-shadow"><FileDown className="w-4 h-4 mr-2" /> PDF</button>
                             <button onClick={exportToCsv} className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg rounded-md transition-shadow"><FileDown className="w-4 h-4 mr-2" /> CSV</button>
                         </div>
                    </div>
                    
                    <section>
                        <h3 className="text-md font-semibold text-[--text-muted] mb-4">Vue d'ensemble</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(summaryStats).map(([title, value]) => <StatCard key={title} title={title} value={String(value)} icon={ListChecks} />)}
                        </div>
                    </section>

                    {chartData.lineChartData.length > 0 && (
                        <section>
                            <h3 className="text-md font-semibold text-[--text-muted] mb-4">Évolution sur la période ({period === 'monthly' ? 'par semaine' : ''})</h3>
                            <div className="bg-brand-50/60 p-4 rounded-lg h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData.lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                        <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={(value: number) => reportType === 'fines' ? `${value / 1000}k` : value} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '14px' }} />
                                        <Line type="monotone" dataKey={reportType === 'fines' ? 'Montant (CDF)' : 'Impressions'} stroke="var(--brand-400)" strokeWidth={2} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    )}
                    
                    <section>
                        <h3 className="text-md font-semibold text-[--text-muted] mb-4">Répartitions</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="lg:col-span-2 bg-brand-50/60 p-4 rounded-lg">
                                <h4 className="font-medium text-[--text-muted] text-sm text-center mb-2">{reportType === 'fines' ? 'Répartition par Statut' : 'Répartition par Type'}</h4>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={chartData.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelStyle={{ fontSize: '12px', fill: 'var(--text-main)' }}>
                                            {chartData.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="lg:col-span-3 bg-brand-50/60 p-4 rounded-lg">
                                <h4 className="font-medium text-[--text-muted] text-sm text-center mb-2">{reportType === 'fines' ? 'Amendes par Zone' : 'Impressions par Agent'}</h4>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={chartData.barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                        <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '14px' }}/>
                                        <Bar dataKey={reportType === 'fines' ? 'Amendes' : 'Impressions'} fill="var(--brand-400)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-md font-semibold text-[--text-muted] mb-4">Liste détaillée</h3>
                        <div className="overflow-x-auto border border-black/5 rounded-lg">
                            <table className="min-w-full text-sm">
                               {reportType === 'fines' ? (
                                    <>
                                        <thead className="text-left text-[--text-muted] bg-brand-50/50"><tr><th className="p-3 font-semibold">Date</th><th className="p-3 font-semibold">Plaque</th><th className="p-3 font-semibold">Motif</th><th className="p-3 font-semibold">Montant</th><th className="p-3 font-semibold">Statut</th><th className="p-3 font-semibold">Zone</th></tr></thead>
                                        <tbody className="bg-white">{(generatedData as (Fine & { zone: string })[]).map(item => <tr key={item.id} className="border-t border-black/5 hover:bg-brand-50/50"><td className="p-3 text-[--text-main]">{new Date(item.date).toLocaleDateString()}</td><td className="p-3 font-mono text-[--text-main]">{item.plate}</td><td className="p-3 text-[--text-main]">{item.reason}</td><td className="p-3 text-[--text-main]">{item.amount.toLocaleString()} FC</td><td className="p-3"><FineStatusBadge status={item.status} /></td><td className="p-3 text-[--text-main]">{item.zone}</td></tr>)}</tbody>
                                    </>
                               ) : (
                                    <>
                                        <thead className="text-left text-[--text-muted] bg-brand-50/50"><tr><th className="p-3 font-semibold">Date</th><th className="p-3 font-semibold">Type</th><th className="p-3 font-semibold">Identifiant</th><th className="p-3 font-semibold">Agent</th><th className="p-3 font-semibold">Zone</th></tr></thead>
                                        <tbody className="bg-white">{(generatedData as Impression[]).map(item => <tr key={item.id} className="border-t border-black/5 hover:bg-brand-50/50"><td className="p-3 text-[--text-main]">{new Date(item.date).toLocaleDateString()}</td><td className="p-3 text-[--text-main]">{item.documentType}</td><td className="p-3 font-mono text-[--text-main]">{item.identifier}</td><td className="p-3 text-[--text-main]">{item.agentName}</td><td className="p-3 text-[--text-main]">{item.zone}</td></tr>)}</tbody>
                                    </>
                               )}
                            </table>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;