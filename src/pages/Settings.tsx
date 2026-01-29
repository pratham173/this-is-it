import React, { useEffect, useState } from 'react';
import { useTheme, ACCENT_COLORS } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AccentColor } from '../types';
import { getStorageInfo } from '../services/offlineStorage';

export function Settings() {
  const { theme, setThemeMode, setAccentColor } = useTheme();
  const [storageInfo, setStorageInfo] = useState({ used: 0, quota: 0, percentage: 0 });

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    const info = await getStorageInfo();
    setStorageInfo(info);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const accentColorMap: Record<AccentColor, string> = {
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    cyan: 'bg-cyan-500',
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your Harmony experience</p>
      </div>

      {/* Theme Mode */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Theme Mode</label>
            <div className="flex gap-3">
              <Button
                variant={theme.mode === 'light' ? 'primary' : 'secondary'}
                onClick={() => setThemeMode('light')}
              >
                Light
              </Button>
              <Button
                variant={theme.mode === 'dark' ? 'primary' : 'secondary'}
                onClick={() => setThemeMode('dark')}
              >
                Dark
              </Button>
              <Button
                variant={theme.mode === 'system' ? 'primary' : 'secondary'}
                onClick={() => setThemeMode('system')}
              >
                System
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Accent Color</label>
            <div className="flex flex-wrap gap-3">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-12 h-12 rounded-full ${accentColorMap[color]} ${
                    theme.accentColor === color ? 'ring-4 ring-offset-2 ring-accent' : ''
                  } transition-all hover:scale-110`}
                  aria-label={`${color} accent color`}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Storage */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Storage</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Used</span>
            <span className="font-medium">{formatBytes(storageInfo.used)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available</span>
            <span className="font-medium">{formatBytes(storageInfo.quota)}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${Math.min(100, storageInfo.percentage)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {storageInfo.percentage.toFixed(1)}% used
          </p>
          <Button variant="secondary" size="sm" onClick={loadStorageInfo} className="w-full">
            Refresh Storage Info
          </Button>
        </div>
      </Card>

      {/* About */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            Harmony is a modern music streaming Progressive Web App built with React, TypeScript, and Tailwind CSS.
          </p>
          <p className="text-muted-foreground">
            Music powered by <a href="https://www.jamendo.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Jamendo</a>
          </p>
          <p className="text-muted-foreground mt-4">
            Version 1.0.0
          </p>
        </div>
      </Card>
    </div>
  );
}
