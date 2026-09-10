# SystemPulse Quick Start Guide

Get SystemPulse up and running in 5 minutes!

## 🚀 Fast Track Installation

### Prerequisites
- [Node.js 18+](https://nodejs.org/) installed
- [PostgreSQL 14+](https://www.postgresql.org/) running
- Terminal/Command Prompt access

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/systempulse.git
cd systempulse

# Install dependencies
npm install
```

### Step 2: Configure Database (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/systempulse
```

**Quick PostgreSQL Setup** (if needed):
```bash
# Create database
createdb systempulse

# Or using psql
psql -U postgres -c "CREATE DATABASE systempulse;"
```

### Step 3: Initialize Database (30 seconds)

```bash
# Push database schema
npm run db:push
```

### Step 4: Start Application (30 seconds)

```bash
# Development mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

---

## 🎯 First Steps

### 1. View Real-Time Metrics
The dashboard loads automatically showing:
- CPU usage
- RAM usage
- Disk usage
- Network speed

### 2. Start Recording Data
Click the **"Start Recording"** button to begin saving metrics to the database.

### 3. Adjust Refresh Rate
Use the dropdown to change how often metrics update:
- 0.5s = Very fast (for intensive monitoring)
- 1s = Default (balanced)
- 2s = Moderate
- 5s = Low overhead

### 4. Configure Alerts
1. Click **"Settings"** in the top navigation
2. Adjust threshold percentages for CPU, RAM, Disk
3. Enable/disable alerts with toggles
4. Alerts show on dashboard when thresholds exceeded

### 5. Export Data
Click **"Export CSV"** to download last 24 hours of metrics.

---

## 📱 Interface Overview

### Dashboard Components

```
┌─────────────────────────────────────────────────┐
│  SystemPulse  [Live]  [Settings] [About] [Theme]│
├─────────────────────────────────────────────────┤
│                                                 │
│  [CPU 45%]  [RAM 62%]  [Disk 71%]  [Net 2MB/s] │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ CPU History  │  │ RAM History  │           │
│  │  📈 Chart    │  │  📈 Chart    │           │
│  └──────────────┘  └──────────────┘           │
│                                                 │
│  Top Processes by Memory:                      │
│  ┌─────────────────────────────────────────┐  │
│  │ PID | Name    | CPU% | MEM% | MB       │  │
│  │ 123 | chrome  | 5.2  | 12.4 | 1024     │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Color Indicators
- 🟢 **Green** (< 70%) - Normal, healthy
- 🟡 **Yellow** (70-85%) - Warning, elevated
- 🔴 **Red** (> 85%) - Critical, high usage

---

## ⚡ Common Tasks

### Change Refresh Rate
```
Top bar → Dropdown → Select (0.5s / 1s / 2s / 5s)
```

### Start/Stop Recording
```
Top bar → "Start Recording" button → Data saves automatically
```

### Export Historical Data
```
Top bar → "Export CSV" button → Downloads systempulse-[timestamp].csv
```

### Configure Alerts
```
Settings → Alert Thresholds → Adjust sliders → Toggle enable/disable
```

### Clean Old Data
```
Settings → Data Management → Choose 7/30/90 days → Confirm
```

### View System Info
```
About → See hardware specs, OS details, CPU info
```

### Switch Theme
```
Top bar → Sun/Moon icon → Toggles dark/light mode
```

---

## 🔧 Development Mode

### Start Development Server
```bash
npm run dev
```
- App runs on http://localhost:3000
- Hot reload enabled
- Debug mode active

### Check Types
```bash
npm run typecheck
```

### Build for Production
```bash
npm run build
npm start
```

### Access Database Studio
```bash
npm run db:studio
```
Opens Drizzle Studio at http://localhost:4983

---

## 📊 Understanding the Metrics

### CPU Usage
- **Percentage**: Current CPU utilization across all cores
- **Cores**: Number of physical/logical cores
- **Model**: CPU brand and model name
- **Speed**: Current clock frequency in GHz

### Memory (RAM)
- **Percentage**: Used RAM vs. total RAM
- **Used**: Amount of RAM currently in use (GB)
- **Total**: Total system RAM (GB)
- **Available**: RAM available for new applications

### Disk
- **Percentage**: Used storage vs. total storage
- **Used**: Amount of disk space used (GB)
- **Total**: Total disk capacity (GB)

### Network
- **Download**: Current incoming traffic (MB/s)
- **Upload**: Current outgoing traffic (MB/s)

### Temperature (if available)
- **CPU Temp**: Processor temperature in Celsius

---

## 🎨 Keyboard Shortcuts

(Future feature - currently none)

---

## 🆘 Troubleshooting

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
cat .env

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Charts not showing
- Start recording first (data needed for charts)
- Wait 30 seconds for data to accumulate
- Refresh page

### No temperature data
- Temperature sensors not available on all systems
- Normal behavior, app continues without it

---

## 📚 Next Steps

1. ✅ **Read the full README** - [README.md](./README.md)
2. ✅ **Explore features** - [FEATURES.md](./FEATURES.md)
3. ✅ **Learn deployment** - [DEPLOYMENT.md](./DEPLOYMENT.md)
4. ✅ **Contribute** - [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 💡 Pro Tips

### Tip 1: Long-term Monitoring
Set refresh rate to 5s and leave recording enabled for continuous monitoring with minimal overhead.

### Tip 2: Troubleshooting Performance
Use 0.5s refresh rate during debugging to catch short performance spikes.

### Tip 3: Regular Cleanup
Clean old data monthly to keep database size manageable.

### Tip 4: Export Before Cleanup
Always export data before cleaning if you need historical records.

### Tip 5: Alert Tuning
Start with default thresholds, then adjust based on your system's normal behavior.

---

## 🌟 Features at a Glance

| Feature | Location | Description |
|---------|----------|-------------|
| Real-time metrics | Dashboard | Live CPU, RAM, Disk, Network |
| Historical charts | Dashboard | 5-minute rolling graphs |
| Process list | Dashboard | Top 10 processes |
| Recording | Dashboard header | Start/stop data capture |
| Alerts | Settings | Configure thresholds |
| Export | Dashboard header | Download CSV |
| Theme | Dashboard header | Dark/light mode |
| System info | About page | Hardware details |

---

## 📞 Need Help?

- 📖 Read the [full documentation](./README.md)
- 🐛 Report bugs in [GitHub Issues](https://github.com/yourusername/systempulse/issues)
- 💬 Ask questions in [Discussions](https://github.com/yourusername/systempulse/discussions)
- 📧 Email: support@systempulse.com (placeholder)

---

## ✨ Enjoy SystemPulse!

You're all set! SystemPulse is now monitoring your system in real-time.

**Happy Monitoring!** 📊

---

© 2024 SystemPulse - Built with ❤️ using Next.js and TypeScript
