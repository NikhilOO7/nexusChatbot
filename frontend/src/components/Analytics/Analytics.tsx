import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Analytics.css';

export const Analytics: React.FC = () => {
  const metrics = [
    {
      title: 'Total Conversations',
      value: '1,254',
      change: '+12%',
      isPositive: true
    },
    {
      title: 'Avg. Satisfaction Score',
      value: '4.2/5',
      change: '+0.3',
      isPositive: true
    },
    {
      title: 'Avg. Response Time',
      value: '1.8s',
      change: '-23%',
      isPositive: true
    }
  ];

  const commonQueries = [
    { name: 'Reset password', count: 187 },
    { name: 'Billing issues', count: 143 },
    { name: 'Product compatibility', count: 112 },
    { name: 'Return process', count: 95 },
    { name: 'Account activation', count: 82 }
  ];

  const sentimentData = [
    { name: 'Positive', value: 64, color: '#22c55e' },
    { name: 'Neutral', value: 30, color: '#94a3b8' },
    { name: 'Negative', value: 6, color: '#ef4444' }
  ];

  const knowledgeGaps = [
    {
      query: 'Integration with third-party apps',
      count: 42,
      status: 'insufficient',
      statusLabel: 'Insufficient Docs'
    },
    {
      query: 'Enterprise licensing options',
      count: 37,
      status: 'missing',
      statusLabel: 'Missing Info'
    },
    {
      query: 'Password reset process',
      count: 28,
      status: 'good',
      statusLabel: 'Well Documented'
    }
  ];

  return (
    <div className="analytics-container">
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <h3 className="metric-title">{metric.title}</h3>
            <div className="metric-value">{metric.value}</div>
            <div className={`metric-change ${metric.isPositive ? 'positive' : 'negative'}`}>
              {metric.change} from last month
            </div>
          </div>
        ))}
      </div>
      
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Most Common Queries</h3>
          <div className="chart-container" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commonQueries} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="chart-card">
          <h3 className="chart-title">Response Sentiment</h3>
          <div className="chart-container" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="gaps-section">
        <h3 className="section-title">Knowledge Gap Analysis</h3>
        <div className="gaps-table">
          <div className="table-header">
            <div className="th query">Query</div>
            <div className="th count">Count</div>
            <div className="th status">Status</div>
            <div className="th action">Action</div>
          </div>
          {knowledgeGaps.map((gap, index) => (
            <div key={index} className="table-row">
              <div className="td query">{gap.query}</div>
              <div className="td count">{gap.count}</div>
              <div className="td status">
                <span className={`status-badge ${gap.status}`}>{gap.statusLabel}</span>
              </div>
              <div className="td action">
                {gap.status !== 'good' ? (
                  <button className="action-button">Create Document</button>
                ) : (
                  <span className="no-action">No Action Needed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};