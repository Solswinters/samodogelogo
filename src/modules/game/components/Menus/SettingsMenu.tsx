/**
 * Settings menu component
 */

'use client'

import { Button } from '@/shared/components/Button'
import { Switch } from '@/shared/components/Switch'
import { Slider } from '@/shared/components/Slider/Slider'

export interface GameSettings {
  soundEnabled: boolean
  musicEnabled: boolean
  soundVolume: number
  musicVolume: number
  particlesEnabled: boolean
  showFPS: boolean
  reducedMotion: boolean
}

export interface SettingsMenuProps {
  settings: GameSettings
  onSettingChange: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void
  onClose: () => void
  onReset: () => void
}

export function SettingsMenu({ settings, onSettingChange, onClose, onReset }: SettingsMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg space-y-6 rounded-lg bg-gray-800 p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 transition-colors hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Audio</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Sound Effects</span>
              <Switch
                checked={settings.soundEnabled}
                onChange={checked => onSettingChange('soundEnabled', checked)}
              />
            </div>
            {settings.soundEnabled && (
              <Slider
                label="Sound Volume"
                value={settings.soundVolume}
                onChange={value => onSettingChange('soundVolume', value)}
                min={0}
                max={100}
              />
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Music</span>
              <Switch
                checked={settings.musicEnabled}
                onChange={checked => onSettingChange('musicEnabled', checked)}
              />
            </div>
            {settings.musicEnabled && (
              <Slider
                label="Music Volume"
                value={settings.musicVolume}
                onChange={value => onSettingChange('musicVolume', value)}
                min={0}
                max={100}
              />
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Graphics</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Particle Effects</span>
              <Switch
                checked={settings.particlesEnabled}
                onChange={checked => onSettingChange('particlesEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Show FPS</span>
              <Switch
                checked={settings.showFPS}
                onChange={checked => onSettingChange('showFPS', checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Accessibility</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Reduced Motion</span>
              <Switch
                checked={settings.reducedMotion}
                onChange={checked => onSettingChange('reducedMotion', checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-700 pt-6">
          <Button onClick={onReset} variant="outline" className="flex-1">
            Reset to Default
          </Button>
          <Button onClick={onClose} variant="default" className="flex-1">
            Save & Close
          </Button>
        </div>
      </div>
    </div>
  )
}
