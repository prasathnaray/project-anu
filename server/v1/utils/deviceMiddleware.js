// middleware/deviceMiddleware.js

function detectVRDevice(req) {
  const ua = (req.headers?.["user-agent"] || "").toLowerCase();

  const vrDevices = {
    metaQuest: /oculusbrowser|quest|pacific|oculus/i,
    picoVR: /pico/i,
    appleVision: /apple vision|xros/i,
    htcVive: /vive/i,
    windowsMR: /windowsmr/i,
    samsungGearVR: /samsung.+gearvr/i,
    googleDaydream: /daydream/i,
    unityVR: /unity|unreal|openxr|webxr/i,
  };

  for (const [device, regex] of Object.entries(vrDevices)) {
    if (regex.test(ua)) {
      return { isVR: true, device };
    }
  }

  const headerDevice = req.headers?.['x-device-type'] || req.headers?.['x-client'] || req.headers?.['x-vr-device'];
  if (headerDevice && String(headerDevice).toLowerCase().includes('vr')) {
    return { isVR: true, device: String(headerDevice) };
  }

  if (req.query?.isVr === 'true' || req.query?.isvr === 'true' || req.body?.isVr === true || req.body?.loginContext === 'vr') {
    return { isVR: true, device: 'VR Headset' };
  }

  return { isVR: false, device: "browser" };
}

function detectOS(userAgent) {
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os/i.test(userAgent)) return "Mac";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Unknown";
}

// Middleware Export
const deviceMiddleware = (req, res, next) => {
  const ua = req.headers["user-agent"] || "";

  const vrInfo = detectVRDevice(req);
  const osInfo = detectOS(ua);

  req.deviceInfo = {
    ...vrInfo,
    os: osInfo,
    userAgent: ua,
  };

  //console.log("📌 Device Info:", req.deviceInfo);

  next();
};

module.exports = deviceMiddleware;