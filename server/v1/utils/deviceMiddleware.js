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
    wolvicVR: /wolvic/i,
    firefoxReality: /firefoxreality/i,
    genericVR: /mobile vr|headset|standalone vr/i,
  };

  for (const [device, regex] of Object.entries(vrDevices)) {
    if (regex.test(ua)) {
      return { isVR: true, device };
    }
  }

  const headerDevice = req.headers?.['x-device-type'] ||
    req.headers?.['x-client'] ||
    req.headers?.['x-vr-device'] ||
    req.headers?.['login-source'] ||
    req.headers?.['device'];
  if (headerDevice && String(headerDevice).toLowerCase().includes('vr')) {
    return { isVR: true, device: String(headerDevice) };
  }

  if (req.headers?.['x-vr'] === 'true' || req.headers?.['x-vr'] === true) {
    return { isVR: true, device: 'VR Headset' };
  }

  const isQueryVR = req.query?.isVr === 'true' ||
    req.query?.isvr === 'true' ||
    req.query?.isVR === 'true' ||
    String(req.query?.isVr).toLowerCase() === 'true' ||
    String(req.query?.isvr).toLowerCase() === 'true' ||
    String(req.query?.isVR).toLowerCase() === 'true' ||
    String(req.query?.loginContext).toLowerCase() === 'vr' ||
    String(req.query?.login_context).toLowerCase() === 'vr';

  const isBodyVR = req.body?.isVr === true ||
    req.body?.isvr === true ||
    req.body?.isVR === true ||
    String(req.body?.isVr).toLowerCase() === 'true' ||
    String(req.body?.isvr).toLowerCase() === 'true' ||
    String(req.body?.isVR).toLowerCase() === 'true' ||
    String(req.body?.loginContext).toLowerCase() === 'vr' ||
    String(req.body?.login_context).toLowerCase() === 'vr' ||
    String(req.body?.loginSource).toLowerCase().includes('vr') ||
    String(req.body?.login_source).toLowerCase().includes('vr') ||
    String(req.body?.device).toLowerCase().includes('vr');

  if (isQueryVR || isBodyVR) {
    return { isVR: true, device: req.body?.device || 'VR Headset' };
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