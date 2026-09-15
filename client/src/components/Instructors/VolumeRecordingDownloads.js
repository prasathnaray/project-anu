import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { getVolumeRecordingFiles, downloadVolumeRecordingFile } from '../../API/volumeDownloadAPI';

function VolumeRecordingDownloads({ volume, onClose }) {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState(null);

  useEffect(() => {
    if (!volume) return;
    let cancelled = false;
    setRecordings([]);
    setLoading(true);
    getVolumeRecordingFiles(volume.volume_id)
      .then((response) => {
        if (!cancelled) setRecordings(response.data.recordings || []);
      })
      .catch((error) => {
        if (!cancelled) toast.error(error.response?.data?.message || 'Unable to load recording files.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [volume?.volume_id]);

  const handleDownload = async (recording, fileType, index = null) => {
    const key = `${recording.recording_id}:${fileType}:${index}`;
    setBusyKey(key);
    try {
      const response = await downloadVolumeRecordingFile(
        volume.volume_id, recording.recording_id, fileType, index
      );
      const { url, filename } = response.data;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to download recording file.');
    } finally {
      setBusyKey(null);
    }
  };

  if (!volume) return null;

  const fileButtons = (recording, fileType, count, label) =>
    Array.from({ length: Number(count) || 0 }, (_, index) => {
      const key = `${recording.recording_id}:${fileType}:${index}`;
      return (
        <button key={key} type="button" disabled={Boolean(busyKey)}
          onClick={() => handleDownload(recording, fileType, index)}
          className="px-2 py-1 rounded border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50">
          {busyKey === key ? 'Preparing…' : `${label} ${index + 1}`}
        </button>
      );
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-3"
      onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-label="Volume recording downloads"
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-700">Recording files</h2>
            <p className="text-sm text-gray-500">{volume.volume_name}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close recording files"
            className="p-1 text-gray-600 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          {loading ? <p className="text-gray-500">Loading recordings…</p>
            : recordings.length === 0 ? <p className="text-gray-500">No recordings linked to this volume.</p>
              : recordings.map((recording) => (
                <div key={recording.recording_id} className="border rounded p-3">
                  <div className="font-medium text-gray-700">{recording.recording_name || 'Recording'}</div>
                  <div className="text-xs text-gray-500 capitalize mb-3">{recording.recording_type}</div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {fileButtons(recording, 'recording', recording.recording_count, 'JSON')}
                    {fileButtons(recording, 'audio', recording.audio_count, 'Audio')}
                    {fileButtons(recording, 'image', recording.image_count, 'Image')}
                    {recording.has_manifest && (
                      <button type="button" disabled={Boolean(busyKey)}
                        onClick={() => handleDownload(recording, 'manifest')}
                        className="px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50">
                        {busyKey === `${recording.recording_id}:manifest:null` ? 'Preparing…' : 'Manifest'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </section>
    </div>
  );
}

export default VolumeRecordingDownloads;
