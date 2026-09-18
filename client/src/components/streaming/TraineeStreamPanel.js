import React, { useEffect, useRef, useState } from 'react';
import {
  Stage,
  StageConnectionState,
  StageEvents,
  SubscribeType
} from 'amazon-ivs-web-broadcast';
import { createSelfViewerSession } from '../../API/streamingAPI';

export default function TraineeStreamPanel() {
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const mediaRef = useRef(null);
  const [state, setState] = useState('connecting');
  const [error, setError] = useState('');
  const [muted, setMuted] = useState(true);
  const [connectionAttempt, setConnectionAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const clearMedia = () => {
      mediaRef.current?.getTracks().forEach((track) => track.stop());
      mediaRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    const connect = async () => {
      setState('connecting');
      setError('');
      clearMedia();

      try {
        const session = await createSelfViewerSession();
        if (cancelled) return;

        const strategy = {
          stageStreamsToPublish: () => [],
          shouldPublishParticipant: () => false,
          shouldSubscribeToParticipant: (participant) =>
            participant.userId === session.publisherUserId
              ? SubscribeType.AUDIO_VIDEO
              : SubscribeType.NONE
        };
        const stage = new Stage(session.token, strategy);
        stageRef.current = stage;

        stage.on(StageEvents.STAGE_CONNECTION_STATE_CHANGED, (connectionState) => {
          if (cancelled) return;
          if (connectionState === StageConnectionState.CONNECTED) {
            setState(mediaRef.current ? 'live' : 'waiting');
          } else if (connectionState === StageConnectionState.ERRORED) {
            setState('error');
            setError('The VR preview lost its connection. Reconnect to continue watching.');
          }
        });

        stage.on(StageEvents.STAGE_PARTICIPANT_STREAMS_ADDED, (participant, remoteStreams) => {
          if (cancelled || participant.userId !== session.publisherUserId) return;
          const media = mediaRef.current || new MediaStream();
          remoteStreams.forEach((remoteStream) => {
            const track = remoteStream.mediaStreamTrack;
            if (!media.getTracks().some((existing) => existing.id === track.id)) media.addTrack(track);
          });
          mediaRef.current = media;
          if (videoRef.current) {
            videoRef.current.srcObject = media;
            videoRef.current.play().catch(() => {});
          }
          setState('live');
        });

        const removeStreams = (participant, removedStreams = null) => {
          if (participant.userId !== session.publisherUserId) return;
          if (removedStreams && mediaRef.current) {
            removedStreams.forEach((remoteStream) => {
              mediaRef.current.removeTrack(remoteStream.mediaStreamTrack);
            });
          }
          if (removedStreams && mediaRef.current?.getTracks().length) return;
          clearMedia();
          if (!cancelled) setState('waiting');
        };

        stage.on(StageEvents.STAGE_PARTICIPANT_STREAMS_REMOVED, removeStreams);
        stage.on(StageEvents.STAGE_PARTICIPANT_LEFT, (participant) => removeStreams(participant));
        stage.on(StageEvents.ERROR, (stageError) => {
          if (cancelled) return;
          console.error('IVS trainee preview error', stageError);
          setError('The VR preview encountered a connection error. Reconnect to try again.');
          setState('error');
        });

        await stage.join();
        if (!cancelled) setState(mediaRef.current ? 'live' : 'waiting');
      } catch (connectError) {
        if (!cancelled) {
          setError(connectError?.response?.data?.message || 'Unable to connect to your VR stream.');
          setState('error');
        }
      }
    };

    connect();
    return () => {
      cancelled = true;
      stageRef.current?.leave();
      stageRef.current = null;
      clearMedia();
    };
  }, [connectionAttempt]);

  const toggleAudio = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.play().catch(() => {});
    }
  };

  const badgeClass = state === 'live'
    ? 'bg-green-100 text-green-700'
    : state === 'error'
      ? 'bg-red-100 text-red-700'
      : 'bg-amber-100 text-amber-700';
  const badgeText = state === 'live'
    ? 'Live'
    : state === 'error'
      ? 'Disconnected'
      : state === 'waiting'
        ? 'Waiting for VR'
        : 'Connecting';

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">My VR live stream</h2>
          <p className="text-sm text-gray-500 mt-1">
            This preview shows the VR output being shared with administrators in your scan center.
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className="w-full h-full object-contain"
          />
          {state === 'connecting' && <div className="absolute text-white">Connecting to VR preview…</div>}
          {state === 'waiting' && <div className="absolute text-white">Waiting for the VR application to start streaming…</div>}
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {state === 'live' && (
            <button
              type="button"
              onClick={toggleAudio}
              className="px-5 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800"
            >
              {muted ? 'Enable audio' : 'Mute audio'}
            </button>
          )}
          {state === 'error' && (
            <button
              type="button"
              onClick={() => setConnectionAttempt((attempt) => attempt + 1)}
              className="px-5 py-2 rounded-md bg-[#8DC63F] text-white hover:bg-[#79ad35]"
            >
              Reconnect preview
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
