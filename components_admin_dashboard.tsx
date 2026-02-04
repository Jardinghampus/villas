import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Home, Zap, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [leadsRes, propsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/leads'),
        fetch('/api/admin/properties'),
        fetch('/api/admin/analytics'),
      ]);

      setLeads(await leadsRes.json());
      setProperties(await propsRes.json());
      setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Agent Dashboard</h1>
            <p className="text-slate-600">Manage your leads, properties & performance</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            + New Listing
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Active Leads',
              value: leads.filter(l => l.status === 'Active').length,
              icon: <Users className="w-6 h-6 text-blue-600" />,
              trend: '+12%',
            },
            {
              title: 'My Listings',
              value: properties.filter(p => p.status === 'Available').length,
              icon: <Home className="w-6 h-6 text-emerald-600" />,
              trend: '+4 this month',
            },
            {
              title: 'Conversion Rate',
              value: `${analytics?.conversionRate || 0}%`,
              icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
              trend: '+2.3% vs last month',
            },
            {
              title: 'Avg Days-to-Sale',
              value: `${analytics?.avgDaysToSale || 0}d`,
              icon: <Zap className="w-6 h-6 text-purple-600" />,
              trend: '-3 days vs avg',
            },
          ].map((kpi, i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-slate-600">{kpi.title}</h3>
                {kpi.icon}
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{kpi.value}</div>
              <p className="text-xs text-slate-500">{kpi.trend}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">My Leads</TabsTrigger>
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Leads */}
              <Card className="lg:col-span-2 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Qualified Leads</h2>
                <div className="space-y-3">
                  {leads.slice(0, 5).map(lead => (
                    <div key={lead.id} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition">
                      <div>
                        <p className="font-semibold text-slate-900">{lead.name}</p>
                        <p className="text-sm text-slate-600">
                          Looking: {lead.lookingFor} • {lead.bedrooms} BR • {lead.communities.join(', ')}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          📊 Match Score: {lead.matchScore}/100 • Budget: {lead.budget}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          lead.status === 'Hot' ? 'bg-red-100 text-red-800' :
                          lead.status === 'Warm' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="w-4 h-4 mr-2" /> Send bulk WhatsApp
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Phone className="w-4 h-4 mr-2" /> Schedule calls
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Home className="w-4 h-4 mr-2" /> Add property
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" /> View market trends
                  </Button>
                </div>
              </Card>
            </div>

            {/* Leads Pipeline Chart */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Lead Pipeline (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.pipelineData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">My Qualified Leads</h2>
              
              {/* Filter Options */}
              <div className="flex gap-2 mb-6">
                {['All', 'Hot', 'Warm', 'Cold', 'Converted'].map(filter => (
                  <Button key={filter} variant="outline" size="sm" className="text-xs">
                    {filter}
                  </Button>
                ))}
              </div>

              {/* Leads Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Budget</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Communities</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Match Score</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-900">{lead.name}</td>
                        <td className="py-3 px-4 text-slate-600">{lead.lookingFor}</td>
                        <td className="py-3 px-4 text-slate-600">{lead.budget}</td>
                        <td className="py-3 px-4 text-slate-600">{lead.communities.join(', ')}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{ width: `${lead.matchScore}%` }}
                              />
                            </div>
                            <span className="font-semibold text-slate-900">{lead.matchScore}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            lead.status === 'Hot' ? 'bg-red-100 text-red-800' :
                            lead.status === 'Warm' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">My Listings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.map(prop => (
                  <Card key={prop.id} className="border border-slate-200">
                    <img src={prop.image} alt={prop.title} className="w-full h-48 object-cover rounded-t-lg" />
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 mb-2">{prop.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{prop.community}</p>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-emerald-600">
                          {prop.price ? `${(prop.price / 1000000).toFixed(1)}M AED` : `${prop.rent} AED/mo`}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          prop.status === 'Available' ? 'bg-green-100 text-green-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {prop.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 mb-3">
                        <p>👁️ {prop.viewCount} views • ⏱️ {prop.daysOnMarket} days</p>
                        <p>🛏️ {prop.bedrooms} BR • 📏 {prop.sqft} sqft</p>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        Edit Listing
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Performance Metrics</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analytics?.performanceData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgDaysToSale" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Top Performing Communities</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Community</th>
                      <th className="text-left py-3 px-4">Listings</th>
                      <th className="text-left py-3 px-4">Sold/Rented</th>
                      <th className="text-left py-3 px-4">Avg Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics?.topCommunities || []).map(community => (
                      <tr key={community.name} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium">{community.name}</td>
                        <td className="py-3 px-4">{community.listings}</td>
                        <td className="py-3 px-4">{community.converted}</td>
                        <td className="py-3 px-4">{community.avgDays}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
