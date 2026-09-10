import { pgTable, serial, text, timestamp, real, integer, boolean } from "drizzle-orm/pg-core";

// System metrics readings table
export const systemReadings = pgTable("system_readings", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  cpuPercent: real("cpu_percent").notNull(),
  ramPercent: real("ram_percent").notNull(),
  ramUsed: real("ram_used").notNull(), // in GB
  ramTotal: real("ram_total").notNull(), // in GB
  diskPercent: real("disk_percent").notNull(),
  diskUsed: real("disk_used").notNull(), // in GB
  diskTotal: real("disk_total").notNull(), // in GB
  networkDown: real("network_down").notNull(), // in MB/s
  networkUp: real("network_up").notNull(), // in MB/s
  cpuTemp: real("cpu_temp"), // in Celsius, nullable
});

// Alert settings table
export const alertSettings = pgTable("alert_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  enabled: boolean("enabled").notNull().default(true),
  threshold: real("threshold").notNull(),
  lastTriggered: timestamp("last_triggered"),
});

// Process snapshots table
export const processSnapshots = pgTable("process_snapshots", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  pid: integer("pid").notNull(),
  name: text("name").notNull(),
  cpuPercent: real("cpu_percent").notNull(),
  memPercent: real("mem_percent").notNull(),
  memUsage: real("mem_usage").notNull(), // in MB
});
