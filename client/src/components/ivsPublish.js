import React, { useEffect, useRef, useState } from "react";
import { Stage, LocalStageStream } from "amazon-ivs-web-broadcast";
import { jwtDecode } from "jwt-decode";

export default function IvsPublisher() {
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const localStreamRef = useRef(null);
  const isMountedRef = useRef(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      // Cleanup on unmount
      if (stageRef.current) {
        stageRef.current.leave();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startPublishing = async () => {
    try {
      setIsPublishing(true);
      setError(null);
      
      const tokenn = localStorage.getItem("user_token");
      if (!tokenn) throw new Error("No user token found");

      const decoded = jwtDecode(tokenn);
      const userMail = decoded.user_mail;

      // Get token for publishing
      const res = await fetch("http://localhost:4004/api/v1/tokenn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageArn: "arn:aws:ivs:ap-south-1:299822065337:stage/zFMYIVZchIZO",
          userId: userMail + "-publisher",
          capabilities: ["PUBLISH", "SUBSCRIBE"],
        }),
      });

      if (!res.ok) {
        throw new Error(`Token fetch failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const token = data.result.data.token;
      if (!token) throw new Error("No token received from backend");

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      
      // Display local stream preview
      if (videoRef.current && isMountedRef.current) {
        videoRef.current.srcObject = stream;
        
        // Use a promise to handle the play request properly
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Local preview playing successfully");
            })
            .catch(err => {
              console.warn("Autoplay prevented:", err);
            });
        }
      }

      // Create IVS stage with local stream
      const stage = new Stage(token, {
        localStageStream: new LocalStageStream(stream),
        shouldPublishParticipant: () => true,
        shouldSubscribeToParticipant: () => false,
        getPublishConfiguration: () => ({ 
          video: true, 
          audio: true 
        }),
        getSubscribeConfiguration: () => ({ 
          video: false, 
          audio: false 
        }),
      });

      stageRef.current = stage;

      // Set up event handlers
      stage.on("streamAdded", (remoteStream) => {
        console.log("Remote stream added:", remoteStream);
      });

      stage.on("streamRemoved", (remoteStream) => {
        console.log("Remote stream removed:", remoteStream);
      });

      stage.on("participantJoined", (participant) => {
        console.log("Participant joined:", participant);
      });

      stage.on("participantLeft", (participant) => {
        console.log("Participant left:", participant);
      });

      stage.on("error", (err) => {
        console.error("Stage error:", err);
        if (isMountedRef.current) {
          setError(`Stage error: ${err.message}`);
        }
      });

      // Join the stage
      await stage.join();
      console.log("Publisher joined successfully");

    } catch (err) {
      console.error("Publisher error:", err);
      if (isMountedRef.current) {
        setError(`Failed to publish: ${err.message}`);
        setIsPublishing(false);
      }
      
      // Clean up on error
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
    }
  };
  const stopPublishing = async () => {
    try {
      if (stageRef.current) {
        await stageRef.current.leave();
        stageRef.current = null;
      }
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsPublishing(false);
    } catch (err) {
      console.error("Error stopping publication:", err);
      setError(`Error stopping: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">IVS Publisher</h2>
      
      <div className="mb-4">
        {!isPublishing ? (
          <button
            onClick={startPublishing}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Publishing
          </button>
        ) : (
          <button
            onClick={stopPublishing}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Stop Publishing
          </button>
        )}
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-md border rounded"
      />
      {isPublishing && (
        <div className="mt-4 text-green-600">
          ✓ Publishing live stream...
        </div>
      )}
    </div>
  );
}