// Client-side Emergency Audio Beacon and Voice Guidance service

// Web Audio API Emergency Rescue Whistle / Acoustic Beacon
class SoundBeaconManager {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: any = null;
  private isRunning: boolean = false;

  public start(onStateChange?: (active: boolean) => void) {
    if (this.isRunning) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        console.warn('Web Audio API not supported on this browser.');
        return;
      }

      this.audioCtx = new AudioCtxClass();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator = this.audioCtx.createOscillator();
      // Dual resonant frequency for emergency search & rescue acoustic beacon (2800 Hz)
      this.oscillator.type = 'triangle';
      this.oscillator.frequency.setValueAtTime(2800, this.audioCtx.currentTime);
      this.oscillator.connect(this.gainNode);
      this.oscillator.start();

      this.isRunning = true;
      if (onStateChange) onStateChange(true);

      // Pulse pattern: 3 sharp burst beeps (SOS acoustic pattern)
      let beepState = false;
      this.intervalId = setInterval(() => {
        if (!this.audioCtx || !this.gainNode) return;
        beepState = !beepState;
        const now = this.audioCtx.currentTime;
        if (beepState) {
          // Sharp audible pulse
          this.gainNode.gain.cancelScheduledValues(now);
          this.gainNode.gain.linearRampToValueAtTime(0.35, now + 0.05);
        } else {
          // Silence
          this.gainNode.gain.cancelScheduledValues(now);
          this.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.05);
        }
      }, 350);
    } catch (err) {
      console.error('Failed to start sound beacon:', err);
    }
  }

  public stop(onStateChange?: (active: boolean) => void) {
    if (!this.isRunning) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      if (this.audioCtx && this.audioCtx.state !== 'closed') {
        this.audioCtx.close();
        this.audioCtx = null;
      }
    } catch (err) {
      console.error('Error stopping sound beacon:', err);
    }

    this.isRunning = false;
    if (onStateChange) onStateChange(false);
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const soundBeacon = new SoundBeaconManager();

// Speech Synthesis Helper for 10-80 year olds
export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis not supported');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Slightly slower, clear pace for elderly & children
  utterance.pitch = 1.05; // Friendly, clear tone
  utterance.volume = 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Emergency Hotlines for Bangladesh & Nepal
export interface EmergencyHotline {
  number: string;
  displayNumber: string;
  name: string;
  banglaName?: string;
  nepaliName?: string;
  description: string;
  iconType: 'police' | 'flood' | 'ambulance' | 'general' | 'child';
  freeOfCharge: boolean;
}

export const REGIONAL_HOTLINES: Record<'bangladesh' | 'nepal', EmergencyHotline[]> = {
  bangladesh: [
    {
      number: '999',
      displayNumber: '999',
      name: 'National Emergency Service',
      banglaName: 'জাতীয় জরুরি সেবা',
      description: 'Police, Ambulance & Fire Rescue (24/7 Toll-Free)',
      iconType: 'police',
      freeOfCharge: true,
    },
    {
      number: '1090',
      displayNumber: '1090',
      name: 'Flood & Disaster Early Warning',
      banglaName: 'বন্যা ও দুর্যোগ পূর্ব সতর্কবার্তা',
      description: 'Official Ministry of Disaster Management hotline',
      iconType: 'flood',
      freeOfCharge: true,
    },
    {
      number: '16206',
      displayNumber: '16206',
      name: 'Disaster Relief & Shelter Coordination',
      banglaName: 'ত্রাণ ও আশ্রয়কেন্দ্র সমন্বয়',
      description: 'Request emergency dry food, water kits and boat rescue',
      iconType: 'general',
      freeOfCharge: true,
    },
    {
      number: '109',
      displayNumber: '109',
      name: 'Child & Women Emergency Help',
      banglaName: 'শিশু ও নারী জরুরি সহায়তা',
      description: 'Priority protection for children and vulnerable elders',
      iconType: 'child',
      freeOfCharge: true,
    },
  ],
  nepal: [
    {
      number: '112',
      displayNumber: '112 / 100',
      name: 'Nepal Emergency Police Hotline',
      nepaliName: 'नेपाल प्रहरी आपतकालीन सेवा',
      description: 'National emergency response & search operations',
      iconType: 'police',
      freeOfCharge: true,
    },
    {
      number: '1155',
      displayNumber: '1155',
      name: 'Flood Early Warning Toll-Free',
      nepaliName: 'बाढी पूर्वसूचना सेवा',
      description: 'Department of Hydrology & Meteorology flood alerts',
      iconType: 'flood',
      freeOfCharge: true,
    },
    {
      number: '102',
      displayNumber: '102',
      name: 'Emergency Ambulance & Red Cross',
      nepaliName: 'एम्बुलेन्स सेवा',
      description: 'Critical medical evacuation & flood injury transport',
      iconType: 'ambulance',
      freeOfCharge: true,
    },
    {
      number: '1098',
      displayNumber: '1098',
      name: 'Childline Emergency Nepal',
      nepaliName: 'बाल हेल्पलाइन',
      description: 'Emergency assistance for separated or stranded children',
      iconType: 'child',
      freeOfCharge: true,
    },
  ],
};
