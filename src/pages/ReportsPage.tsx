import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FileText, Calendar } from 'lucide-react';
import { VehicleHistory, Driver } from '../types';
import { getHistory, getDrivers } from '../services/api';
import { filterHistoryByDays } from '../utils/dateFilters';

const TIME_PERIODS = [
  { label: '7 dias', days: 7 },
  { label: '30 dias', days: 30 },
  { label: '60 dias', days: 60 },
  { label: '180 dias', days: 180 },
];

export const ReportsPage: React.FC = () => {
  const [history, setHistory] = useState<VehicleHistory[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, driversRes] = await Promise.all([
          getHistory(),
          getDrivers(),
        ]);
        setHistory(historyRes.data);
        setDrivers(driversRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  const filteredHistory = filterHistoryByDays(history, selectedPeriod);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Relatório de Veículos</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <select
            className="border rounded-md px-3 py-1.5"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
          >
            {TIME_PERIODS.map((period) => (
              <option key={period.days} value={period.days}>
                Últimos {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motorista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((record) => {
                const driver = drivers.find((d) => d.id === record.driverId);
                return (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(record.checkoutTime), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.vehicleModel} ({record.vehicleId})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {driver?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {record.returnTime ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Devolvido em {format(new Date(record.returnTime), 'dd/MM/yyyy HH:mm')}
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Em uso
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};