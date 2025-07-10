import React, { useEffect, useState } from 'react';
import axios from '../api/apiInstance';
import { useNavigate } from 'react-router-dom';

const roleFeatures = {
  coordinator: {
    label: 'Tasks',
    endpoint: '/volunteer/tasks',
    key: 'tasks',
  },
  driver: {
    label: 'Routes',
    endpoint: '/volunteer/routes',
    key: 'routes',
  },
  packer: {
    label: 'Tasks',
    endpoint: '/volunteer/tasks',
    key: 'tasks',
  },
  distributor: {
    label: 'Distributions',
    endpoint: '/volunteer/distributions',
    key: 'distributions',
  },
  admin: {
    label: 'Reports',
    endpoint: '/volunteer/reports',
    key: 'reports',
  },
};

export default function VolunteerDashboard() {
  const volunteer = JSON.parse(localStorage.getItem('volunteer'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!volunteer || !volunteer.role) {
      navigate('/volunteer-signin');
      return;
    }
    const feature = roleFeatures[volunteer.role];
    if (!feature) return;
    setLoading(true);
    axios.get(feature.endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setData(res.data[feature.key]))
      .catch(err => setError('Failed to fetch data.'))
      .finally(() => setLoading(false));
  }, [volunteer, token]);

  if (!volunteer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Please sign in as a volunteer to access your dashboard.
      </div>
    );
  }
  const feature = roleFeatures[volunteer.role];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Welcome, {volunteer.firstName}!</h1>
        <h2 className="text-lg text-gray-600 mb-6">Role: <span className="font-semibold text-blue-600">{volunteer.role}</span></h2>
        {feature && (
          <>
            <h3 className="text-xl font-semibold mb-4">Your {feature.label}:</h3>
            {loading && <div className="text-gray-500">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {data && Array.isArray(data) && data.length > 0 ? (
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {data.map((item, i) => (
                  <li key={i}>{Object.values(item).map((v, j) => <span key={j} className="mr-2">{v}</span>)}</li>
                ))}
              </ul>
            ) : !loading && !error ? (
              <div className="text-gray-400">No {feature.label.toLowerCase()} found.</div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
} 