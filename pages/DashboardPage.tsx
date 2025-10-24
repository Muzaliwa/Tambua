import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/Dashboard/StatCard';
import { Car, Bike, CircleDollarSign, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

type Period = 'weekly' | 'monthly' | 'quarterly';

// --- DATA GENERATION FOR CHARTS ---
const generateChartData = (period: Period) => {
    const weeklyLineData = [
        { name: 'Lun', Revenus: 400000 }, { name: 'Mar', Revenus: 300000 },
        { name: 'Mer', Revenus: 500000 }, { name: 'Jeu', Revenus: 278000 },
        { name: 'Ven', Revenus: 189000 }, { name: 'Sam', Revenus: 239000 },
        { name: 'Dim', Revenus: 349000 },
    ];
    const weeklyPieData = [
        { name: 'Excès de vitesse', value: 40 }, { name: 'Stationnement', value: 30 },
        { name: 'Défaut assurance', value: 20 }, { name: 'Autres', value: 10 },
    ];

    const monthlyLineData = [
        { name: 'Sem 1', Revenus: 1700000 }, { name: 'Sem 2', Revenus: 1500000 },
        { name: 'Sem 3', Revenus: 2100000 }, { name: 'Sem 4', Revenus: 1800000 },
    ];
    const monthlyPieData = [
        { name: 'Excès de vitesse', value: 35 }, { name: 'Stationnement', value: 25 },
        { name: 'Défaut assurance', value: 25 }, { name: 'Autres', value: 15 },
    ];

    const quarterlyLineData = [
        { name: 'Mois 1', Revenus: 6500000 }, { name: 'Mois 2', Revenus: 5900000 },
        { name: 'Mois 3', Revenus: 7800000 },
    ];
     const quarterlyPieData = [
        { name: 'Excès de vitesse', value: 30 }, { name: 'Stationnement', value: 20 },
        { name: 'Défaut assurance', value: 35 }, { name: 'Autres', value: 15 },
    ];

    switch (period) {
        case 'monthly': return { lineData: monthlyLineData, pieData: monthlyPieData };
        case 'quarterly': return { lineData: quarterlyLineData, pieData: quarterlyPieData };
        case 'weekly':
        default: return { lineData: weeklyLineData, pieData: weeklyPieData };
    }
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('weekly');
    const chartData = useMemo(() => generateChartData(period), [period]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Tableau de bord Superviseur</h1>
                <p className="text-sm text-gray-500">Vue d'ensemble du système et performances.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Revenus Totaux (CDF)" value="1,85M" icon={CircleDollarSign} change="+12%" description="que le mois dernier" />
                <StatCard title="Nouveaux Enregistrements" value="112" icon={Car} change="+8" description="cette semaine" />
                <StatCard title="Amendes Payées" value="89" icon={CircleDollarSign} change="+5%" description="que la semaine dernière" />
                <StatCard title="Documents Imprimés" value="230" icon={AlertTriangle} description="ce mois-ci" />
            </div>

            {/* Charts Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Analyse & Rapports</h2>
                    <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                        {(['weekly', 'monthly', 'quarterly'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                                    period === p ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {p === 'weekly' ? 'Semaine' : p === 'monthly' ? 'Mois' : 'Trimestre'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Revenus des amendes</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData.lineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value: number) => `${(value / 1000)}k`} />
                                <Tooltip formatter={(value: number) => [`${value.toLocaleString()} CDF`, "Revenus"]} />
                                <Legend wrapperStyle={{ fontSize: '14px' }} />
                                <Line type="monotone" dataKey="Revenus" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="lg:col-span-2">
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Types d'infractions</h3>
                         <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData.pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelStyle={{ fontSize: '12px' }}
                                >
                                    {chartData.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {/* You can add Agent supervision and Recent Activity tables here if needed */}

        </div>
    );
};

export default DashboardPage;
