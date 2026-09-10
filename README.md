# SystemPulse 🔥

**A professional, real-time system monitoring dashboard built with Next.js, PostgreSQL, and modern web technologies.**

![SystemPulse](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)

> 📚 **Quick Links**: [Quick Start](./QUICKSTART.md) | [Features](./FEATURES.md) | [Deployment](./DEPLOYMENT.md) | [Contributing](./CONTRIBUTING.md) | [Documentation Index](./DOCUMENTATION_INDEX.md)

## 🌟 Features

### Real-Time Monitoring
- **CPU Usage** - Live CPU percentage, core count, model information, and frequency
- **Memory (RAM)** - Total, used, and available memory with percentage
- **Disk Usage** - Storage space monitoring with usage statistics
- **Network Activity** - Real-time upload/download speeds in MB/s
- **CPU Temperature** - Temperature monitoring (when available)

### Historical Data Tracking
- PostgreSQL database integration for persistent storage
- 5-minute rolling history charts for CPU and RAM
- Query historical data by time range
- Automatic data retention management

### Process Management
- View top 10 processes by memory usage
- Real-time process statistics (PID, CPU%, Memory%, Memory Usage)
- Sort by CPU or memory consumption

### Alert System
- Configurable threshold alerts for CPU, RAM, and Disk
- Visual indicators with color-coded warnings:
  - 🟢 Green: < 70% (Normal)
  - 🟡 Yellow: 70-85% (Warning)
  - 🔴 Red: > 85% (Critical)
- Real-time alert notifications on dashboard
- Enable/disable individual alerts

### Data Export
- Export historical data to CSV format
- Configurable time ranges (last 24 hours by default)
- Includes all metrics: CPU, RAM, Disk, Network, Temperature

### Dark/Light Theme
- Beautiful dark mode for reduced eye strain
- Light mode for daytime use
- Smooth transitions between themes
- System preference detection

### User Interface
- Modern, card-based design with gradients
- Responsive layout (works on desktop, tablet, mobile)
- Real-time charts with Recharts
- Smooth animations and transitions
- Professional color scheme and typography

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16.2 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL with Drizzle ORM
- **System Monitoring**: systeminformation (Node.js library)
- **Charts**: Recharts (React charting library)
- **Styling**: Tailwind CSS 4.1
- **Icons**: Lucide React
- **Theme**: next-themes

### Project Structure
```
SystemPulse/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── alerts/          # Alert settings API
│   │   │   ├── export/          # CSV export API
│   │   │   ├── health/          # Health check
│   │   │   └── system/
│   │   │       ├── current/     # Real-time system stats
│   │   │       ├── history/     # Historical data CRUD
│   │   │       └── processes/   # Process list API
│   │   ├── settings/            # Settings page
│   │   ├── layout.tsx           # Root layout with theme
│   │   ├── page.tsx             # Main dashboard
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── AlertBadge.tsx       # Alert notification component
│   │   ├── MetricCard.tsx       # Metric display card
│   │   ├── ProcessTable.tsx     # Process list table
│   │   ├── SystemChart.tsx      # Historical charts
│   │   ├── ThemeProvider.tsx    # Theme context provider
│   │   └── ThemeToggle.tsx      # Theme switcher
│   └── db/
│       ├── index.ts             # Database connection
│       └── schema.ts            # Database tables
├── package.json
└── README.md
```

### Database Schema

**system_readings** - Stores historical system metrics
```sql
- id (serial, primary key)
- timestamp (timestamp, default now)
- cpu_percent (real)
- ram_percent (real)
- ram_used (real, GB)
- ram_total (real, GB)
- disk_percent (real)
- disk_used (real, GB)
- disk_total (real, GB)
- network_down (real, MB/s)
- network_up (real, MB/s)
- cpu_temp (real, °C, nullable)
```

**alert_settings** - Stores alert configurations
```sql
- id (serial, primary key)
- name (text, unique)
- enabled (boolean, default true)
- threshold (real)
- last_triggered (timestamp, nullable)
```

**process_snapshots** - Stores process snapshots (future use)
```sql
- id (serial, primary key)
- timestamp (timestamp, default now)
- pid (integer)
- name (text)
- cpu_percent (real)
- mem_percent (real)
- mem_usage (real, MB)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (with npm)
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd systempulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/systempulse
   ```

4. **Push database schema**
   ```bash
   npx drizzle-kit push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📊 API Endpoints

### System Monitoring
- `GET /api/system/current` - Get current system stats
- `GET /api/system/processes?limit=10&sortBy=mem` - Get process list
- `GET /api/system/history?minutes=60` - Get historical readings
- `POST /api/system/history` - Save current reading to database
- `DELETE /api/system/history?days=7` - Delete old readings

### Alerts
- `GET /api/alerts` - Get alert settings
- `PUT /api/alerts` - Update alert setting
  ```json
  {
    "name": "cpu",
    "enabled": true,
    "threshold": 90
  }
  ```

### Export
- `GET /api/export?hours=24` - Export data as CSV

### Health Check
- `GET /api/health` - Application health status

## ⚙️ Configuration

### Refresh Rate
Adjust the refresh rate from the dashboard header:
- 0.5 seconds (High frequency)
- 1 second (Default)
- 2 seconds (Balanced)
- 5 seconds (Low overhead)

### Recording
- Click **"Start Recording"** to save readings to the database
- Click **"Stop Recording"** to pause data collection
- Useful for capturing specific time periods for analysis

### Alert Thresholds
Configure in Settings page:
- **CPU Alert**: Trigger when CPU usage exceeds threshold (default: 90%)
- **RAM Alert**: Trigger when RAM usage exceeds threshold (default: 85%)
- **Disk Alert**: Trigger when Disk usage exceeds threshold (default: 90%)

### Data Retention
Clean old data from Settings page:
- Delete data older than 7 days
- Delete data older than 30 days
- Delete data older than 90 days

## 🎨 Customization

### Theme Colors
Edit `src/components/MetricCard.tsx` to customize card colors:
```typescript
const colorClasses = {
  green: 'from-green-500/20 to-green-600/20 border-green-500/30',
  yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
  red: 'from-red-500/20 to-red-600/20 border-red-500/30',
  blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
};
```

### Chart Colors
Edit `src/app/page.tsx` to change chart colors:
```typescript
<SystemChart data={cpuHistory} label="CPU" color="#3b82f6" />
<SystemChart data={ramHistory} label="RAM" color="#a855f7" />
```

## 📈 Usage Examples

### Monitoring Server Performance
1. Navigate to the dashboard
2. Click "Start Recording" to begin logging data
3. Monitor real-time metrics in the cards
4. View historical trends in the charts
5. Check top processes consuming resources

### Setting Up Alerts
1. Go to Settings page
2. Configure thresholds for each metric
3. Enable/disable alerts as needed
4. Return to dashboard to see active alerts

### Exporting Data
1. Click "Export CSV" button
2. File downloads with timestamp
3. Open in Excel/Google Sheets for analysis
4. Includes all metrics from last 24 hours

## 🔧 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` in `.env` file
- Ensure database exists: `createdb systempulse`

### Missing System Information
- Some metrics (CPU temperature) may not be available on all systems
- The app gracefully handles missing data
- Network speeds are calculated based on system capabilities

### Performance Issues
- Increase refresh rate to 5 seconds
- Clean old database records
- Disable unused alerts

## 🛣️ Roadmap

### Planned Features
- [ ] User authentication and multi-user support
- [ ] Custom dashboard layouts
- [ ] Email/SMS alert notifications
- [ ] GPU monitoring
- [ ] Extended process management (kill processes)
- [ ] System uptime tracking
- [ ] Custom time range selection for charts
- [ ] Mobile app (React Native)
- [ ] Docker deployment support
- [ ] Clustering support for multiple servers

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@systempulse.com (placeholder)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [systeminformation](https://github.com/sebhildebrandt/systeminformation) - System monitoring
- [Recharts](https://recharts.org/) - Charting library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM

---

**Built with ❤️ using Next.js and TypeScript**

© 2024 SystemPulse - Real-time System Monitoring Dashboard
