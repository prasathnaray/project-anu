import React, { useEffect, useRef, useState } from "react";
import { Stage, StageEvents } from "amazon-ivs-web-broadcast";
import { jwtDecode } from "jwt-decode";
import APP_URL from "../API/config";

// export default function IvsSubscriber() {
//   const videoRef = useRef(null);
//   const stageRef = useRef(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState({})
//   const [isStreamActive, setIsStreamActive] = useState(false);
//   const [debugInfo, setDebugInfo] = useState("");
//   const [connectionStatus, setConnectionStatus] = useState("disconnected");
//   const [retryCount, setRetryCount] = useState(0);

//   const connectToStage = async () => {
//     try {
//       setIsLoading(true);
//       setConnectionStatus("connecting");
//       setDebugInfo("Getting token...");
      
//       // 1️⃣ Get token
//       const tokenn = localStorage.getItem("user_token");
//       if (!tokenn) throw new Error("No user token found");

//       const decoded = jwtDecode(tokenn);
//       const userMail = decoded.user_mail;

//       const res = await fetch("http://172.16.101.57:4004/api/v1/tokenn", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           stageArn: "arn:aws:ivs:ap-south-1:299822065337:stage/zFMYIVZchIZO",
//           userId: userMail,
//           capabilities: ["SUBSCRIBE"]
//         }),
//       });

//       if (!res.ok) {
//         throw new Error(`Token fetch failed: ${res.status} ${res.statusText}`);
//       }

//       const data = await res.json();
//       const token = data.result.data.token;
//       if (!token) throw new Error("No token received from backend");

//       setDebugInfo("Token received, initializing stage...");

//       // 2️⃣ Initialize Stage
//       const stage = new Stage(token, {
//         shouldSubscribeToParticipant: (participant) => {
//           console.log("Should subscribe to participant:", participant);
//           setDebugInfo(`Considering subscription to: ${participant.userId}`);
//           return true;
//         },
        
//         getSubscribeConfiguration: (participant) => ({
//           video: true,
//           audio: true,
//         }),
//       });
      
//       stageRef.current = stage;

//       stage.on(StageEvents.STAGE_CONNECTION_STATE_CHANGED, () => {
//         setConnectionStatus("connected");
//         setDebugInfo("Connected to IVS stage");
//         console.log("Connected to IVS stage");
//       });
//             stage.on(StageEvents.STAGE_PARTICIPANT_STREAMS_ADDED, (participant, streams) => {
//        // console.log("Streams addedd:", participant);
//               //setUserInfo(participant)
//         streams.forEach((remoteStream) => {
//           //console.log(remoteStream?.participantInfo)
//           if (remoteStream.streamType === "video") {
//             const ms = new MediaStream([remoteStream.mediaStreamTrack]);

//             if (videoRef.current) {
//               videoRef.current.srcObject = ms;
//               videoRef.current
//                 .play()
//                 .then(() => console.log("Video playing successfully"))
//                 .catch((err) => console.error("Autoplay failed:", err));
//             }
//           }
//         });
//       });
//       stage.on(StageEvents.STAGE_PARTICIPANT_JOINED, (participant) => {
//         console.log("Participant joined:", participant.userId);
//         setDebugInfo(`Participant joined: ${participant.userId}`);
//       });
//       stage.on(StageEvents.STAGE_PARTICIPANT_LEFT, (participant) => {
//         console.log("Participant left:", participant.userId);
//         setDebugInfo(`Participant left: ${participant.userId}`);
//       });
//       stage.on(StageEvents.ERROR, (err) => {
//         console.error("Stage error:", err);
//         setDebugInfo(`Stage error: ${err.message}`);
//         setError(`Stage error: ${err.message}`);
//         setConnectionStatus("error");
//       });
//       stage.on("disconnected", () => {
//         setConnectionStatus("disconnected");
//         setDebugInfo("Disconnected from stage");
//       });
//       setDebugInfo("Joining stage...");
//       const connectionTimeout = setTimeout(() => {
//         if (connectionStatus !== "connected") {
//           setDebugInfo("Connection timeout - retrying...");
//           setError("Connection timeout. Retrying...");
//           handleRetry();
//         }
//       }, 10000);
//       await stage.join();
//       clearTimeout(connectionTimeout);
//       console.log("Successfully joined stage");
//       setDebugInfo("Successfully joined stage");
//     } catch (err) {
//       console.error("Failed to join stage:", err);
//       setDebugInfo(`Failed to join: ${err.message}`);
//       setError(`Failed to join: ${err.message}`);
//       setConnectionStatus("error");
//       setIsLoading(false);
//     }
//   };
//   const handleRetry = () => {
//     if (retryCount < 3) {
//       setRetryCount(prev => prev + 1);
//       setDebugInfo(`Retrying connection (attempt ${retryCount + 1}/3)...`);
//       setTimeout(() => {
//         connectToStage();
//       }, 2000 * retryCount);
//     } else {
//       setError("Max retry attempts reached. Please refresh the page.");
//     }
//   };
//   useEffect(() => {
//     console.log("Component mounted, videoRef:", videoRef.current);
//     setDebugInfo("Component mounted");
//     connectToStage();
//     return () => {
//       if (stageRef.current) {
//         stageRef.current.leave();
//         console.log("Left the stage");
//         setDebugInfo("Left the stage");
//       }
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//         videoRef.current.srcObject = null;
//       }
//     };
//   }, []);
//   const handleVideoClick = () => {
//     if (videoRef.current) {
//       setDebugInfo("Manual play attempt");
//       videoRef.current.play()
//         .then(() => {
//           console.log("Video started by user interaction");
//           setDebugInfo("Video started by user interaction");
//           setError(null);
//         })
//         .catch(err => {
//           console.error("Still cannot play video:", err);
//           setDebugInfo(`Manual play failed: ${err.message}`);
//           setError("Cannot play video. Check permissions.");
//         });
//     }
//   };
//   const handleReconnect = () => {
//     setRetryCount(0);
//     connectToStage();
//   };
//   //console.log(userInfo)
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100 relative">
//       {/* {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
//           <div className="text-white">
//             {connectionStatus === "connecting" ? "Connecting to stream..." : (
//               <div className="mt-2 text-sm">
//                 Status: {connectionStatus}
//               </div>
//             )}
//           </div>
//         </div>
//       )} */}
      
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted
//         className="w-70 border"
//         onClick={handleVideoClick}
//       />
//       {error && !isStreamActive && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white z-20">
//           <div className="text-center">
//             <p>{error}</p>
//             <p className="text-sm mt-2">Waiting for video stream</p>
//             {connectionStatus === "error" && (
//               <button 
//                 className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
//                 onClick={handleReconnect}
//               >
//                 Reconnect
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//       {error && isStreamActive && (
//         <div 
//           className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white cursor-pointer z-20"
//           onClick={handleVideoClick}
//         >
//           <div className="text-center">
//             <p>{error}</p>
//             <p className="text-sm mt-2">Click to play video</p>
//           </div>
//         </div>
//       )}
//       <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded text-xs max-w-md z-30">
//         <div className="font-bold mb-2">Info:</div>
//         <div className="overflow-auto max-h-32">{debugInfo}</div>
//         <div className="mt-2">
//           Status: {connectionStatus}
//         </div>
//       </div>
//     </div>
//   );
// }

export default function IvsSubscriber({ onParticipantUpdate }) {
  const videoRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    async function connectToStage() {
      const tokenn = localStorage.getItem("user_token");
      const decoded = jwtDecode(tokenn);
      const userMail = decoded.user_mail;

      const res = await fetch(APP_URL+'/api/v1/tokenn', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageArn: "arn:aws:ivs:ap-south-1:299822065337:stage/zFMYIVZchIZO",
          userId: userMail,
          capabilities: ["SUBSCRIBE"],
        }),
      });

      const { result } = await res.json();
      const stage = new Stage(result.data.token, {
        shouldSubscribeToParticipant: () => true,
        getSubscribeConfiguration: () => ({ video: true, audio: true }),
      });

      stageRef.current = stage;

      stage.on(StageEvents.STAGE_PARTICIPANT_STREAMS_ADDED, (participant, streams) => {
        onParticipantUpdate?.(participant);
        streams.forEach((remoteStream) => {
          if (remoteStream.streamType === "video") {
            const ms = new MediaStream([remoteStream.mediaStreamTrack]);
            if (videoRef.current) {
              videoRef.current.srcObject = ms;
              videoRef.current.play().catch(console.error);
            }
          }
        });
      });

      await stage.join();
    }

    connectToStage();

    return () => stageRef.current?.leave();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
          <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full bg-black"
          />
    </div>
  );
}
