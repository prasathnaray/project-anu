// middleware/deviceMiddleware.js

function detectVRDevice(userAgent) {
  const ua = userAgent.toLowerCase();

  const vrDevices = {
    metaQuest: /oculusbrowser|quest|pacific/i,
    picoVR: /pico/i,
    appleVision: /apple vision|xros/i,
    htcVive: /vive/i,
    windowsMR: /windowsmr/i,
    samsungGearVR: /samsung.+gearvr/i,
    googleDaydream: /daydream/i,
  };

  for (const [device, regex] of Object.entries(vrDevices)) {
    if (regex.test(ua)) {
      return { isVR: true, device };
    }
  }

  return { isVR: false, device: "browser" };
}

function detectOS(userAgent) {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os/i.test(userAgent)) return "Mac";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Unknown";
}

// Middleware Export
const deviceMiddleware = (req, res, next) => {
  const ua = req.headers["user-agent"] || "";

  const vrInfo = detectVRDevice(ua);
  const osInfo = detectOS(ua);

  req.deviceInfo = {
    ...vrInfo,
    os: osInfo,
    userAgent: ua,
  };

  console.log("📌 Device Info:", req.deviceInfo);

  next();
};

module.exports = deviceMiddleware;