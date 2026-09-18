import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  InitialLayerPreference,
  Stage,
  StageConnectionState,
  StageEvents,
  SubscribeType
} from 'amazon-ivs-web-broadcast';
import { createViewerSession } from '../../API/streamingAPI';

function StreamVideo({ mediaStream, muted }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = mediaStream;
    ref.current.muted = muted;
    ref.current.play().catch(() => {});
  }, [mediaStream, muted]);

  return <video ref={ref} autoPlay playsInline muted={muted} className="w-full h-full object-contain bg-black" />;
}

export default function AdminStreamPanel() {
  const stageRef = useRef(null);
  const directoryRef = useRef(new Map());
  const mediaRef = useRef(new Map());
  const selectedRef = useRef(null);
  const [streams, setStreams] = useState(new Map());
  const [selectedId, setSelectedId] = useState(null);
  const [audibleId, setAudibleId] = useState(null);
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const participantMedia = mediaRef.current;

    const connect = async () => {
      try {
        const session = await createViewerSession();
        if (cancelled) return;
        directoryRef.current = new Map(session.trainees.map((trainee) => [trainee.userId, trainee.name]));

        const strategy = {
          stageStreamsToPublish: () => [],
          shouldPublishParticipant: () => false,
          shouldSubscribeToParticipant: (participant) =>
            directoryRef.current.has(participant.userId) ? SubscribeType.AUDIO_VIDEO : SubscribeType.NONE,
          subscribeConfiguration: () => ({
            simulcast: { initialLayerPreference: InitialLayerPreference.LOWEST_QUALITY }
          }),
          preferredLayerForStream: (participant, stream) =>
            selectedRef.current === participant.id
              ? stream.getHighestQualityLayer?.()
              : stream.getLowestQualityLayer?.()
        };

        const stage = new Stage(session.token, strategy);
        stageRef.current = stage;

        stage.on(StageEvents.STAGE_CONNECTION_STATE_CHANGED, (connectionState) => {
          if (cancelled) return;
          if (connectionState === StageConnectionState.CONNECTED) setStatus('connected');
          else if (connectionState === StageConnectionState.ERRORED) setStatus('error');
          else setStatus('connecting');
        });

        stage.on(StageEvents.STAGE_PARTICIPANT_STREAMS_ADDED, (participant, remoteStreams) => {
          if (cancelled || !directoryRef.current.has(participant.userId)) return;
          const media = participantMedia.get(participant.id) || new MediaStream();
          remoteStreams.forEach((remoteStream) => {
            const track = remoteStream.mediaStreamTrack;
            if (!media.getTracks().some((existing) => existing.id === track.id)) media.addTrack(track);
          });
          participantMedia.set(participant.id, media);
          setStreams((previous) => {
            const next = new Map(previous);
            next.set(participant.id, {
              id: participant.id,
              userId: participant.userId,
              name: directoryRef.current.get(participant.userId),
              mediaStream: media
            });
            return next;
          });
          setSelectedId((current) => {
            if (current) return current;
            selectedRef.current = participant.id;
            return participant.id;
          });
        });

        const removeParticipant = (participant, removedStreams = null) => {
          const media = participantMedia.get(participant.id);
          if (media && removedStreams) {
            removedStreams.forEach((remoteStream) => media.removeTrack(remoteStream.mediaStreamTrack));
          }
          if (removedStreams && media?.getTracks().length) return;
          participantMedia.delete(participant.id);
          setStreams((previous) => {
            const next = new Map(previous);
            next.delete(participant.id);
            return next;
          });
          setSelectedId((current) => {
            if (current !== participant.id) return current;
            selectedRef.current = null;
            return null;
          });
          setAudibleId((current) => current === participant.id ? null : current);
        };

        stage.on(StageEvents.STAGE_PARTICIPANT_STREAMS_REMOVED, removeParticipant);
        stage.on(StageEvents.STAGE_PARTICIPANT_LEFT, (participant) => removeParticipant(participant));
        stage.on(StageEvents.ERROR, (stageError) => {
          if (cancelled) return;
          console.error('IVS viewer error', stageError);
          setError('The live-stream viewer lost its connection. Refresh to reconnect.');
          setStatus('error');
        });

        await stage.join();
      } catch (connectError) {
        if (!cancelled) {
          setError(connectError?.response?.data?.message || 'Unable to connect to this scan center’s streams.');
          setStatus('error');
        }
      }
    };

    connect();
    return () => {
      cancelled = true;
      stageRef.current?.leave();
      stageRef.current = null;
      participantMedia.forEach((media) => media.getTracks().forEach((track) => track.stop()));
      participantMedia.clear();
    };
  }, []);

  const liveStreams = useMemo(() => Array.from(streams.values()), [streams]);

  const selectStream = (participantId) => {
    selectedRef.current = participantId;
    setSelectedId(participantId);
    setAudibleId(participantId);
    stageRef.current?.refreshStrategy();
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Live trainee streams</h2>
          <p className="text-sm text-gray-500 mt-1">Select a tile to enlarge it and enable its audio.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{liveStreams.length} live</span>
          <span className={`px-3 py-1 rounded-full text-sm ${status === 'connected' ? 'bg-green-100 text-green-700' : status === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
            {status === 'connected' ? 'Connected' : status === 'error' ? 'Disconnected' : 'Connecting'}
          </span>
        </div>
      </div>

      {error && <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700">{error}</div>}

      {status === 'connected' && liveStreams.length === 0 ? (
        <div className="min-h-64 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-500">
          No trainees are streaming right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-[220px]">
          {liveStreams.map((stream) => {
            const selected = selectedId === stream.id;
            return (
              <button
                type="button"
                key={stream.id}
                onClick={() => selectStream(stream.id)}
                className={`relative overflow-hidden rounded-lg border-2 text-left bg-black ${selected ? 'md:col-span-2 md:row-span-2 border-[#8DC63F]' : 'border-transparent'}`}
              >
                <StreamVideo mediaStream={stream.mediaStream} muted={audibleId !== stream.id} />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-4 pt-8 pb-3 text-white">
                  <span className="font-medium truncate">{stream.name}</span>
                  <span className="text-xs rounded-full bg-red-600 px-2 py-1">LIVE</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
