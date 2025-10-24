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
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

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
    
    const exportToPdf = () => { /* PDF export logic */ };
    const exportToCsv = () => { /* CSV export logic */ };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Générateur de Rapports</h1>
                <p className="text-sm text-gray-500">Configurez et exportez des rapports détaillés.</p>
            </div>

            {/* Configuration Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4 border-b pb-3">
                    <SlidersHorizontal className="w-5 h-5 text-gray-600 mr-3" />
                    <h2 className="text-lg font-semibold text-gray-800">Configuration</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">Type de rapport</label>
                        <select id="reportType" name="reportType" value={reportType} onChange={(e) => setReportType(e.target.value as any)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500">
                            <option value="fines">Amendes</option>
                            <option value="prints">Impressions</option>
                        </select>
                    </div>
                    <div>
                         <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">Période</label>
                        <select id="period" name="period" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500">
                            <option value="daily">Journalier</option>
                            <option value="weekly">Hebdomadaire</option>
                            <option value="monthly">Mensuel</option>
                            <option value="quarterly">Trimestriel</option>
                            <option value="semiannual">Semestriel</option>
                            <option value="annual">Annuel</option>
                        </select>
                    </div>
                    <div>
                         <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
                        <select id="zone" name="zone" value={zone} onChange={(e) => setZone(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500">
                            <option value="all">Toutes les zones</option>
                            <option value="Goma">Goma</option>
                            <option value="Bukavu">Bukavu</option>
                            <option value="Kinshasa">Kinshasa</option>
                        </select>
                    </div>
                    <button onClick={handleGenerateReport} disabled={isLoading} className="w-full md:w-auto flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <FileText className="w-5 h-5 mr-2" />}
                        {isLoading ? 'Génération...' : 'Générer'}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {generatedData && summaryStats && chartData && (
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-8">
                    <div className="flex flex-wrap justify-between items-center border-b pb-3">
                         <h2 className="text-lg font-semibold text-gray-800">Résultats du Rapport</h2>
                         <div className="flex items-center space-x-2">
                             <button onClick={exportToPdf} className="flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"><FileDown className="w-4 h-4 mr-2" /> PDF</button>
                             <button onClick={exportToCsv} className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"><FileDown className="w-4 h-4 mr-2" /> CSV</button>
                         </div>
                    </div>
                    
                    <section>
                        <h3 className="text-md font-semibold text-gray-700 mb-4">Vue d'ensemble</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(summaryStats).map(([title, value]) => <StatCard key={title} title={title} value={String(value)} icon={ListChecks} />)}
                        </div>
                    </section>

                    {chartData.lineChartData.length > 0 && (
                        <section>
                            <h3 className="text-md font-semibold text-gray-700 mb-4">Évolution sur la période ({period === 'monthly' ? 'par semaine' : ''})</h3>
                            <div className="bg-gray-50 p-4 rounded-lg h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData.lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value: number) => reportType === 'fines' ? `${value / 1000}k` : value} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '14px' }} />
                                        <Line type="monotone" dataKey={reportType === 'fines' ? 'Montant (CDF)' : 'Impressions'} stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    )}
                    
                    <section>
                        <h3 className="text-md font-semibold text-gray-700 mb-4">Répartitions</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-600 text-sm text-center mb-2">{reportType === 'fines' ? 'Répartition par Statut' : 'Répartition par Type'}</h4>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={chartData.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelStyle={{ fontSize: '12px' }}>
                                            {chartData.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="lg:col-span-3 bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-600 text-sm text-center mb-2">{reportType === 'fines' ? 'Amendes par Zone' : 'Impressions par Agent'}</h4>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={chartData.barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '14px' }}/>
                                        <Bar dataKey={reportType === 'fines' ? 'Amendes' : 'Impressions'} fill="#3B82F6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-md font-semibold text-gray-700 mb-4">Liste détaillée</h3>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full text-sm">
                               {reportType === 'fines' ? (
                                    <>
                                        <thead className="text-left text-gray-500 bg-gray-50"><tr><th className="p-3 font-semibold">Date</th><th className="p-3 font-semibold">Plaque</th><th className="p-3 font-semibold">Motif</th><th className="p-3 font-semibold">Montant</th><th className="p-3 font-semibold">Statut</th><th className="p-3 font-semibold">Zone</th></tr></thead>
                                        <tbody>{(generatedData as (Fine & { zone: string })[]).map(item => <tr key={item.id} className="border-t hover:bg-gray-50"><td className="p-3 text-gray-800">{new Date(item.date).toLocaleDateString()}</td><td className="p-3 font-mono text-gray-800">{item.plate}</td><td className="p-3 text-gray-800">{item.reason}</td><td className="p-3 text-gray-800">{item.amount.toLocaleString()} FC</td><td className="p-3 text-gray-800">{item.status}</td><td className="p-3 text-gray-800">{item.zone}</td></tr>)}</tbody>
                                    </>
                               ) : (
                                    <>
                                        <thead className="text-left text-gray-500 bg-gray-50"><tr><th className="p-3 font-semibold">Date</th><th className="p-3 font-semibold">Type</th><th className="p-3 font-semibold">Identifiant</th><th className="p-3 font-semibold">Agent</th><th className="p-3 font-semibold">Zone</th></tr></thead>
                                        <tbody>{(generatedData as Impression[]).map(item => <tr key={item.id} className="border-t hover:bg-gray-50"><td className="p-3 text-gray-800">{new Date(item.date).toLocaleDateString()}</td><td className="p-3 text-gray-800">{item.documentType}</td><td className="p-3 font-mono text-gray-800">{item.identifier}</td><td className="p-3 text-gray-800">{item.agentName}</td><td className="p-3 text-gray-800">{item.zone}</td></tr>)}</tbody>
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