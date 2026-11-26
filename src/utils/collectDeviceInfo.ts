export interface DeviceDetails {
  device: string;
  os: string;
  browser: string;
  screenResolution: string;
  language: string;
  timezone: string;
  clientDate: string;
  clientTime: string;
  referrer: string;
  gate: string;
  battery: string | null;
  connectionType: string | null;
}

export function detectDevice(): { device: string; os: string; browser: string } {
  if (typeof window === 'undefined' || !navigator) {
    return { device: 'Unknown', os: 'Unknown', browser: 'Unknown' };
  }

  const ua = navigator.userAgent;

  let os = 'Unknown OS';
  if (/iPad|iPhone|iPod/.test(ua)) {
    os = 'iOS';
  } else if (/Android/.test(ua)) {
    os = 'Android';
  } else if (/Windows NT/.test(ua)) {
    os = 'Windows';
  } else if (/Macintosh|Mac OS X/.test(ua)) {
    os = 'macOS';
  } else if (/Linux/.test(ua)) {
    os = 'Linux';
  } else if (/CrOS/.test(ua)) {
    os = 'ChromeOS';
  }

  let device = 'Desktop';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(
      ua
    );

  if (isTablet) {
    device = 'Tablet';
  } else if (isMobile) {
    device = 'Mobile';
  }

  let browser = 'Unknown Browser';
  if (/Instagram/i.test(ua)) {
    browser = 'Instagram In-App';
  } else if (/FBAN|FBAV/i.test(ua)) {
    browser = 'Facebook In-App';
  } else if (/MicroMessenger/i.test(ua)) {
    browser = 'WeChat In-App';
  } else if (/WhatsApp/i.test(ua)) {
    browser = 'WhatsApp In-App';
  } else if (/Edg\//i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/Chrome\//i.test(ua) && !/Chromium|Edg/i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari\//i.test(ua) && !/Chrome|Chromium|Edg/i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox\//i.test(ua)) {
    browser = 'Mozilla Firefox';
  } else if (/SamsungBrowser/i.test(ua)) {
    browser = 'Samsung Internet';
  }

  return { device, os, browser };
}

export function formatDDMMYY(d: Date = new Date()): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function formatTime12h(d: Date = new Date()): string {
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export async function collectAllDeviceInfo(): Promise<DeviceDetails> {
  const now = new Date();
  const { device, os, browser } = detectDevice();

  let screenResolution = 'Unknown';
  if (typeof window !== 'undefined' && window.screen) {
    screenResolution = `${window.screen.width}x${window.screen.height} (@${
      window.devicePixelRatio || 1
    }x)`;
  }

  let language = 'en';
  let timezone = 'UTC';
  try {
    language = navigator.language || 'en';
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    // Ignore Intl errors
  }

  let gate = 'Main Entrance';
  let referrer = '';
  if (typeof window !== 'undefined') {
    referrer = document.referrer || 'Direct / QR Scan';
    try {
      const params = new URLSearchParams(window.location.search);
      const gateParam = params.get('gate') || params.get('entrance') || params.get('g');
      if (gateParam) {
        gate = gateParam;
      }
    } catch {
      // Ignore query errors
    }
  }

  let connectionType: string | null = null;
  try {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
    };
    if (nav.connection?.effectiveType) {
      connectionType = nav.connection.effectiveType;
    }
  } catch {
    // Ignore
  }

  return {
    device,
    os,
    browser,
    screenResolution,
    language,
    timezone,
    clientDate: formatDDMMYY(now),
    clientTime: formatTime12h(now),
    referrer,
    gate,
    battery: null,
    connectionType,
  };
}
