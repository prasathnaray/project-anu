import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { Pencil, Plus, RotateCcw, Search, Trash2, Upload, X } from 'lucide-react';
import { TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, Pagination } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import GetVolInsAPI from '../API/GetVolInsAPI';
import {
  GetClustersAPI,
  CreateClusterAPI,
  UpdateClusterAPI,
  DeleteClusterAPI,
  GetClusterRecordingCountsAPI,
  GetClusterRecordingsAPI,
  UploadClusterRecordingAPI,
  UploadRecordingAPI,
  ReplaceClusterRecordingAPI,
} from '../API/ClusterAPI';

const STORAGE_KEY = 'project_anu_cluster_list';
const COUNTS_STORAGE_KEY = 'project_anu_cluster_rec_counts';

const extractFileName = (ref, fallback = 'file') => {
  if (!ref || typeof ref !== 'string') return fallback;
  try {
    const withoutQuery = ref.split('?')[0];
    const parts = withoutQuery.split('/');
    const last = parts[parts.length - 1];
    return decodeURIComponent(last) || fallback;
  } catch {
    return fallback;
  }
};

const safeParseFileList = (files) => {
  if (!files) return [];
  if (Array.isArray(files)) return files;
  if (typeof files === 'string') {
    try {
      const parsed = JSON.parse(files);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [files];
    }
  }
  return [];
};

function Cluster() {
  const navigate = useNavigate();
  const [buttonOpen, setButtonOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [volumes, setVolumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  // Clusters state
  const [clusters, setClusters] = useState([]);
  const [editingCluster, setEditingCluster] = useState(null);

  // Form state for Add Cluster modal
  const [clusterForm, setClusterForm] = useState({
    cluster_name: '',
    selected_volume_ids: [],
    fetal_presentation: '',
  });

  // Form state for Edit Cluster modal
  const [editClusterForm, setEditClusterForm] = useState({
    cluster_name: '',
    selected_volume_ids: [],
    fetal_presentation: '',
  });

  // Recording counts per cluster: { [cluster_id]: { step: number, shadow: number } }
  const [recordingCounts, setRecordingCounts] = useState(() => {
    try {
      const saved = localStorage.getItem(COUNTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Upload Recording Modal state
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('step'); // 'step' | 'shadow'
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'replace'
  const [clusterRecordings, setClusterRecordings] = useState([]);
  const [selectedRecordingId, setSelectedRecordingId] = useState('');
  const [loadingRecordings, setLoadingRecordings] = useState(false);
  const [selectedUploadCluster, setSelectedUploadCluster] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    recording_name: '',
    volume_id: '',
    recording_files: [],
    audio_files: [],
    image_files: [],
    manifest_file: null,
  });

  const handleButtonOpen = () => {
    setButtonOpen((prev) => !prev);
  };

  const fetchRecordingCounts = useCallback(async () => {
    try {
      const res = await GetClusterRecordingCountsAPI();
      const d = res?.data?.data || res?.data;
      const countList = Array.isArray(d) ? d : [];
      setRecordingCounts((prev) => {
        const updated = { ...prev };
        countList.forEach((item) => {
          if (item?.cluster_id) {
            updated[item.cluster_id] = {
              step: Number(item.step_recording_count) || 0,
              shadow: Number(item.shadow_recording_count) || 0,
            };
          }
        });
        localStorage.setItem(COUNTS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.warn('Could not load cluster recording counts from API:', err?.message);
    }
  }, []);

  const isFetchingRef = useRef(false);
  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const [volumeResult, clusterResult, countsResult] = await Promise.allSettled([
        GetVolInsAPI(),
        GetClustersAPI(),
        GetClusterRecordingCountsAPI(),
      ]);

      if (countsResult.status === 'fulfilled' && countsResult.value?.data) {
        const d = countsResult.value.data?.data || countsResult.value.data;
        const countList = Array.isArray(d) ? d : [];
        setRecordingCounts((prev) => {
          const updated = { ...prev };
          countList.forEach((item) => {
            if (item?.cluster_id) {
              updated[item.cluster_id] = {
                step: Number(item.step_recording_count) || 0,
                shadow: Number(item.shadow_recording_count) || 0,
              };
            }
          });
          localStorage.setItem(COUNTS_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }

      if (volumeResult.status === 'rejected') {
        throw volumeResult.reason;
      }

      const allVolumes = Array.isArray(volumeResult.value?.data) ? volumeResult.value.data : [];
      setVolumes(allVolumes);

      let fetchedClusters = [];
      if (clusterResult.status === 'fulfilled' && clusterResult.value?.data) {
        const d = clusterResult.value.data;
        fetchedClusters = Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : []);
      }

      if (fetchedClusters.length > 0) {
        const mapped = fetchedClusters.map((c) => ({
          cluster_id: c.cluster_id,
          cluster_name: c.cluster_name,
          fetal_presentation: c.fetal_presentation || '',
          volume_ids: Array.isArray(c.volumes) ? c.volumes.map((v) => v.volume_id) : (c.volume_ids || []),
          volume_id: Array.isArray(c.volumes) && c.volumes[0] ? c.volumes[0].volume_id : (c.volume_id || ''),
          volume_name: Array.isArray(c.volumes) && c.volumes.length > 0
            ? c.volumes.map((v) => v.volume_name).filter(Boolean).join(', ')
            : (c.volume_name || ''),
          volumes: c.volumes || [],
          created_at: c.created_at,
        }));
        setClusters(mapped);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      } else {
        // Load clusters from localStorage or initialize from converted volumes
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setClusters(JSON.parse(saved));
          } catch {
            setClusters([]);
          }
        } else {
          const converted = allVolumes.filter((v) => Boolean(v.conversion_completion));
          const initial = converted.slice(0, 3).map((v, idx) => ({
            cluster_id: `CLU-${v.volume_id?.substring(0, 8).toUpperCase() || (idx + 1)}`,
            cluster_name: `${v.volume_name || 'Volume'} Cluster`,
            volume_ids: [v.volume_id],
            volume_id: v.volume_id,
            volume_name: v.volume_name,
            fetal_presentation: v.volume_fetal_presentation || v.fetal_presentation || '',
            is_initial: true,
          }));
          setClusters(initial);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        }
      }
    } catch (err) {
      console.error('Failed to load cluster data:', err);
      toast.error('Failed to load volumes.');
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Clusters use converted volumes independently from volume recordings.
  const convertedVolumes = useMemo(() => {
    return volumes
      .filter((vol) => Boolean(vol.conversion_completion))
      .sort((a, b) =>
        (a.volume_name || '').localeCompare(b.volume_name || '', undefined, {
          sensitivity: 'base',
          numeric: true,
        })
      );
  }, [volumes]);

  // Filtered clusters based on search
  const filteredClusters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clusters;
    return clusters.filter((c) =>
      (c.cluster_id || '').toLowerCase().includes(q) ||
      (c.cluster_name || '').toLowerCase().includes(q) ||
      (c.fetal_presentation || '').toLowerCase().includes(q) ||
      (c.volume_name || '').toLowerCase().includes(q)
    );
  }, [clusters, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredClusters.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * pageSize;
  const visibleClusters = filteredClusters.slice(pageStart, pageStart + pageSize);

  // Keep the selected page valid after deleting or updating a matching cluster.
  useEffect(() => {
    setPage((previous) => Math.min(previous, pageCount));
  }, [pageCount]);

  const handleOpenAddModal = () => {
    setClusterForm({
      cluster_name: '',
      selected_volume_ids: convertedVolumes.length > 0 ? [convertedVolumes[0].volume_id] : [],
      fetal_presentation: '',
    });
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleSaveCluster = async (e) => {
    e.preventDefault();
    if (!clusterForm.cluster_name.trim()) {
      toast.error('Please enter a cluster name.');
      return;
    }
    if (!clusterForm.selected_volume_ids || clusterForm.selected_volume_ids.length === 0) {
      toast.error('Please select at least one volume.');
      return;
    }

    const matchedVolumes = volumes.filter((v) => clusterForm.selected_volume_ids.includes(v.volume_id));
    const matchedNames = matchedVolumes.map((v) => v.volume_name || 'Volume');

    try {
      const res = await CreateClusterAPI({
        cluster_name: clusterForm.cluster_name.trim(),
        fetal_presentation: clusterForm.fetal_presentation || '',
        volume_ids: clusterForm.selected_volume_ids,
      });

      const serverData = res?.data?.data || res?.data;
      const createdId = serverData?.cluster_id || `CLU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const newCluster = {
        cluster_id: createdId,
        cluster_name: clusterForm.cluster_name.trim(),
        volume_ids: clusterForm.selected_volume_ids,
        volume_id: clusterForm.selected_volume_ids[0] || '',
        volume_name: matchedNames.join(', '),
        fetal_presentation: clusterForm.fetal_presentation || '',
        is_new: true,
      };

      const updated = [newCluster, ...clusters];
      setClusters(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecordingCounts((prev) => {
        const updatedCounts = {
          ...prev,
          [createdId]: { step: 0, shadow: 0 },
        };
        localStorage.setItem(COUNTS_STORAGE_KEY, JSON.stringify(updatedCounts));
        return updatedCounts;
      });
      setOpenAddModal(false);
      toast.success('Cluster added successfully!');
    } catch (apiErr) {
      console.error('API create cluster failed, saving locally:', apiErr);
      const newCluster = {
        cluster_id: `CLU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        cluster_name: clusterForm.cluster_name.trim(),
        volume_ids: clusterForm.selected_volume_ids,
        volume_id: clusterForm.selected_volume_ids[0] || '',
        volume_name: matchedNames.join(', '),
        fetal_presentation: clusterForm.fetal_presentation || '',
        is_new: true,
      };

      const updated = [newCluster, ...clusters];
      setClusters(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecordingCounts((prev) => {
        const updatedCounts = {
          ...prev,
          [newCluster.cluster_id]: { step: 0, shadow: 0 },
        };
        localStorage.setItem(COUNTS_STORAGE_KEY, JSON.stringify(updatedCounts));
        return updatedCounts;
      });
      setOpenAddModal(false);
      toast.success('Cluster added successfully!');
    }
  };

  const handleDeleteCluster = async (clusterId) => {
    try {
      await DeleteClusterAPI(clusterId);
    } catch (err) {
      console.warn('API delete cluster:', err.message);
    }
    const updated = clusters.filter((c) => c.cluster_id !== clusterId);
    setClusters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRecordingCounts((prev) => {
      const nextCounts = { ...prev };
      delete nextCounts[clusterId];
      localStorage.setItem(COUNTS_STORAGE_KEY, JSON.stringify(nextCounts));
      return nextCounts;
    });
    toast.info('Cluster removed.');
  };

  const handleOpenEditModal = (cluster) => {
    const initialIds = Array.isArray(cluster.volume_ids)
      ? cluster.volume_ids
      : (cluster.volume_id ? [cluster.volume_id] : []);
    setEditingCluster(cluster);
    setEditClusterForm({
      cluster_name: cluster.cluster_name,
      selected_volume_ids: initialIds,
      fetal_presentation: cluster.fetal_presentation || '',
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingCluster(null);
  };

  const handleUpdateCluster = async (e) => {
    e.preventDefault();
    if (!editClusterForm.cluster_name.trim()) {
      toast.error('Please enter a cluster name.');
      return;
    }
    if (!editClusterForm.selected_volume_ids || editClusterForm.selected_volume_ids.length === 0) {
      toast.error('Please select at least one volume.');
      return;
    }

    try {
      await UpdateClusterAPI(editingCluster.cluster_id, {
        cluster_name: editClusterForm.cluster_name.trim(),
        fetal_presentation: editClusterForm.fetal_presentation || '',
        volume_ids: editClusterForm.selected_volume_ids,
      });
    } catch (err) {
      console.warn('API update cluster:', err.message);
    }

    const matchedVolumes = volumes.filter((v) => editClusterForm.selected_volume_ids.includes(v.volume_id));
    const matchedNames = matchedVolumes.map((v) => v.volume_name || 'Volume');
    const updated = clusters.map((c) => {
      if (c.cluster_id === editingCluster.cluster_id) {
        return {
          ...c,
          cluster_name: editClusterForm.cluster_name.trim(),
          volume_ids: editClusterForm.selected_volume_ids,
          volume_id: editClusterForm.selected_volume_ids[0] || '',
          volume_name: matchedNames.join(', '),
          fetal_presentation: editClusterForm.fetal_presentation || '',
          is_new: true,
        };
      }
      return c;
    });

    setClusters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setOpenEditModal(false);
    setEditingCluster(null);
    toast.success('Cluster updated successfully!');
  };

  const clusterVolumesForUpload = useMemo(() => {
    if (!selectedUploadCluster) return [];
    const ids = Array.isArray(selectedUploadCluster.volume_ids)
      ? selectedUploadCluster.volume_ids
      : (selectedUploadCluster.volume_id ? [selectedUploadCluster.volume_id] : []);
    return ids.map((id) => {
      const vol = volumes.find((v) => v.volume_id === id);
      return vol || { volume_id: id, volume_name: id, volume_type: '' };
    });
  }, [selectedUploadCluster, volumes]);

  const activeExistingRecording = useMemo(() => {
    if (modalMode !== 'replace') return null;
    return (
      clusterRecordings.find((r) => r.recording_id === selectedRecordingId) ||
      clusterRecordings[0] ||
      null
    );
  }, [modalMode, clusterRecordings, selectedRecordingId]);

  const existingJsonFiles = useMemo(() => {
    return safeParseFileList(activeExistingRecording?.rec_files);
  }, [activeExistingRecording]);

  const existingAudioFiles = useMemo(() => {
    return safeParseFileList(activeExistingRecording?.audio_files);
  }, [activeExistingRecording]);

  const existingImageFiles = useMemo(() => {
    return safeParseFileList(activeExistingRecording?.image_files);
  }, [activeExistingRecording]);

  const existingManifestFile = useMemo(() => {
    const m = activeExistingRecording?.manifest_file;
    if (!m || m === '-') return null;
    if (Array.isArray(m)) return m[0] || null;
    return m;
  }, [activeExistingRecording]);

  const handleOpenUploadModal = async (cluster, type, initialMode = 'add') => {
    const ids = Array.isArray(cluster.volume_ids)
      ? cluster.volume_ids
      : (cluster.volume_id ? [cluster.volume_id] : []);
    const defaultVolId = ids[0] || cluster.volume_id || '';
    const typeLabel = type === 'step' ? 'Step' : 'Shadow';

    setSelectedUploadCluster(cluster);
    setUploadType(type);
    setModalMode(initialMode);
    setSelectedRecordingId('');
    setClusterRecordings([]);
    setUploadForm({
      recording_name: `${cluster.cluster_name || 'Cluster'} ${typeLabel} Recording`,
      volume_id: defaultVolId,
      recording_files: [],
      audio_files: [],
      image_files: [],
      manifest_file: null,
    });
    setOpenUploadModal(true);

    setLoadingRecordings(true);
    try {
      const res = await GetClusterRecordingsAPI(cluster.cluster_id);
      const d = res?.data?.data || res?.data?.recordings || res?.data;
      const list = Array.isArray(d) ? d : [];
      const matching = list.filter((r) => {
        const t = (r.recording_type || '').toLowerCase().trim();
        return t === type || t.includes(type);
      });
      setClusterRecordings(matching);
      if (matching.length > 0) {
        setSelectedRecordingId(matching[0].recording_id);
        if (initialMode === 'replace') {
          setUploadForm((prev) => ({
            ...prev,
            recording_name: matching[0].recording_name || prev.recording_name,
            volume_id: matching[0].volume_id || prev.volume_id,
          }));
        }
      } else if (initialMode === 'replace') {
        setModalMode('add');
      }
    } catch (err) {
      console.warn('Could not fetch cluster recordings:', err?.message);
    } finally {
      setLoadingRecordings(false);
    }
  };

  const handleCloseUploadModal = () => {
    if (uploading) return;
    setOpenUploadModal(false);
    setSelectedUploadCluster(null);
    setClusterRecordings([]);
    setSelectedRecordingId('');
    setModalMode('add');
    setUploadForm({
      recording_name: '',
      volume_id: '',
      recording_files: [],
      audio_files: [],
      image_files: [],
      manifest_file: null,
    });
  };

  const handleSwitchModalMode = (mode) => {
    setModalMode(mode);
    if (mode === 'replace' && clusterRecordings.length > 0) {
      const current = clusterRecordings.find((r) => r.recording_id === selectedRecordingId) || clusterRecordings[0];
      if (current) {
        setSelectedRecordingId(current.recording_id);
        setUploadForm((prev) => ({
          ...prev,
          recording_name: current.recording_name || prev.recording_name,
          volume_id: current.volume_id || prev.volume_id,
        }));
      }
    }
  };

  const handleSelectRecordingToReplace = (recId) => {
    setSelectedRecordingId(recId);
    const rec = clusterRecordings.find((r) => r.recording_id === recId);
    if (rec) {
      setUploadForm((prev) => ({
        ...prev,
        recording_name: rec.recording_name || prev.recording_name,
        volume_id: rec.volume_id || prev.volume_id,
      }));
    }
  };

  const handleJsonFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((file) => file.name.toLowerCase().endsWith('.json'));
    if (valid.length !== selected.length) {
      toast.warn('Only .json files are accepted for JSON recordings.');
    }
    setUploadForm((prev) => ({ ...prev, recording_files: valid }));
  };

  const handleAudioFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((file) => file.name.toLowerCase().endsWith('.wav'));
    if (valid.length !== selected.length) {
      toast.warn('Only .wav files are accepted for audio recordings.');
    }
    setUploadForm((prev) => ({ ...prev, audio_files: valid }));
  };

  const handleImageFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const allowed = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'];
    const valid = selected.filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return allowed.includes(ext);
    });
    if (valid.length !== selected.length) {
      toast.warn('Only image files (PNG, JPG, JPEG, WEBP, GIF, BMP) are accepted.');
    }
    setUploadForm((prev) => ({ ...prev, image_files: valid }));
  };

  const handleManifestFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadForm((prev) => ({ ...prev, manifest_file: null }));
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'json' && ext !== 'manifest') {
      toast.warn('Manifest file must be a .json or .manifest file.');
      e.target.value = '';
      return;
    }
    setUploadForm((prev) => ({ ...prev, manifest_file: file }));
  };

  const handleUploadRecordingSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.volume_id) {
      toast.error('Please select a volume.');
      return;
    }

    if (modalMode === 'replace') {
      const hasReplacementFile = uploadForm.recording_files.length > 0
        || uploadForm.audio_files.length > 0
        || uploadForm.image_files.length > 0
        || Boolean(uploadForm.manifest_file)
        || Boolean(uploadForm.recording_name.trim());

      if (!hasReplacementFile) {
        toast.error('Please select at least 1 file to replace (JSON, Audio, Image, or Manifest).');
        return;
      }

      setUploading(true);
      try {
        const data = new FormData();
        data.append('volume_id', uploadForm.volume_id);
        data.append('cluster_id', selectedUploadCluster.cluster_id);
        data.append('recording_type', uploadType);
        if (selectedRecordingId) {
          data.append('recording_id', selectedRecordingId);
        }
        if (uploadForm.recording_name.trim()) {
          data.append('recording_name', uploadForm.recording_name.trim());
        }

        uploadForm.recording_files.forEach((file) => {
          data.append('recording_file', file);
        });
        uploadForm.audio_files.forEach((file) => {
          data.append('audio_file', file);
        });
        uploadForm.image_files.forEach((file) => {
          data.append('images', file);
        });
        if (uploadForm.manifest_file) {
          data.append('manifest_file', uploadForm.manifest_file);
        }

        await ReplaceClusterRecordingAPI(
          selectedUploadCluster.cluster_id,
          selectedRecordingId,
          data
        );

        toast.success(
          `${uploadType === 'step' ? 'Step' : 'Shadow'} recording file(s) replaced successfully!`
        );

        handleCloseUploadModal();
        fetchRecordingCounts();
      } catch (err) {
        console.error('Failed to replace recording files:', err);
        const errMsg = err.response?.data?.error
          || err.response?.data?.message
          || 'Failed to replace recording files. Please check file formats and try again.';
        toast.error(errMsg);
      } finally {
        setUploading(false);
      }
      return;
    }

    // Modal mode === 'add' (requires all 4 files)
    if (!uploadForm.recording_name.trim()) {
      toast.error('Please enter a recording name.');
      return;
    }
    if (uploadForm.recording_files.length === 0) {
      toast.error('Please upload at least 1 JSON file (.json).');
      return;
    }
    if (uploadForm.audio_files.length === 0) {
      toast.error('Please upload at least 1 audio file (.wav).');
      return;
    }
    if (uploadForm.image_files.length === 0) {
      toast.error('Please upload at least 1 image file.');
      return;
    }
    if (!uploadForm.manifest_file) {
      toast.error('Please upload 1 manifest file (.json or .manifest).');
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('volume_id', uploadForm.volume_id);
      data.append('cluster_id', selectedUploadCluster.cluster_id);
      data.append('recording_name', uploadForm.recording_name.trim());
      data.append('recording_type', uploadType);

      uploadForm.recording_files.forEach((file) => {
        data.append('recording_file', file);
      });
      uploadForm.audio_files.forEach((file) => {
        data.append('audio_file', file);
      });
      uploadForm.image_files.forEach((file) => {
        data.append('images', file);
      });
      data.append('manifest_file', uploadForm.manifest_file);

      try {
        await UploadClusterRecordingAPI(selectedUploadCluster.cluster_id, data);
      } catch (clusterApiErr) {
        // Fallback to uploadvolumerecording endpoint
        await UploadRecordingAPI(data);
      }

      toast.success(`${uploadType === 'step' ? 'Step' : 'Shadow'} recording uploaded successfully!`);

      // Update local count immediately
      setRecordingCounts((prev) => {
        const cur = prev[selectedUploadCluster.cluster_id] || { step: 0, shadow: 0 };
        const updated = {
          ...prev,
          [selectedUploadCluster.cluster_id]: {
            ...cur,
            [uploadType]: (cur[uploadType] || 0) + 1,
          },
        };
        localStorage.setItem(COUNTS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      handleCloseUploadModal();
      fetchRecordingCounts();
    } catch (err) {
      console.error('Failed to upload recording:', err);
      const errMsg = err.response?.data?.error
        || err.response?.data?.message
        || 'Failed to upload recording files. Please check file formats and try again.';
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>
      <div className="flex flex-grow pt-12">
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        <div
          className={`${
            buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'
          } flex-grow overflow-y-auto bg-gray-100 min-h-[calc(100vh-3rem)] transition-all`}
        >
          {/* Top Header */}
          <div className="p-3 px-6 flex justify-between items-center border-b bg-white">
            <div className="font-semibold text-gray-800 text-base">Cluster List</div>
            <div className="flex gap-2 text-xs text-gray-400">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-[#8DC63F] hover:underline cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-gray-600">Cluster</span>
            </div>
          </div>

          {/* Search bar and Add Cluster button */}
          <div className="m-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-gray-100">
              <div className="w-full sm:w-80">
                <TextField
                  fullWidth
                  size="small"
                  label="Search clusters"
                  placeholder="Search by ID, name, or volume"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  InputProps={{
                    startAdornment: <Search size={16} className="text-gray-400 mr-2" />,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#8DC63F] px-4 py-2.5 text-xs font-semibold text-gray-900 shadow-sm transition-colors hover:bg-[#7cb336] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8DC63F] focus-visible:ring-offset-2"
              >
                <Plus size={16} aria-hidden="true" />
                Add Cluster
              </button>
            </div>

            {/* Clusters Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8faf6] border-b border-gray-200 text-gray-700 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Cluster ID</th>
                    <th className="py-3 px-4">Cluster Name</th>
                    <th className="py-3 px-4">Fetal Presentation</th>
                    <th className="py-3 px-4">Volumes</th>
                    <th className="py-3 px-4">Step Recording</th>
                    <th className="py-3 px-4">Shadow Recording</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {loading ? (
                    <tr>
                        <td colSpan={7} className="py-10 text-center text-gray-500">
                        <ClipLoader color="#8DC63F" size={24} />
                        <p className="mt-2 text-xs text-gray-400">Loading clusters…</p>
                      </td>
                    </tr>
                  ) : filteredClusters.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="py-10 text-center text-gray-400">
                        No clusters found. Click &quot;Add Cluster&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    visibleClusters.map((cluster) => {
                      const volumeIds = Array.isArray(cluster.volume_ids)
                        ? cluster.volume_ids
                        : (cluster.volume_id ? [cluster.volume_id] : []);
                      const matchedVol = volumes.find((v) => volumeIds.includes(v.volume_id));
                      const displayFetalPresentation = cluster.fetal_presentation
                        || matchedVol?.volume_fetal_presentation
                        || matchedVol?.fetal_presentation
                        || '';

                      return (
                        <tr key={cluster.cluster_id} className="hover:bg-gray-50 transition-colors">
                          {/* 1. Cluster ID */}
                          <td className="py-3 px-4 font-mono font-medium text-gray-800">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                              {cluster.cluster_id}
                            </span>
                          </td>

                          {/* 2. Cluster Name */}
                          <td className="py-3 px-4 font-semibold text-gray-800">
                            {cluster.cluster_name}
                          </td>

                          {/* 3. Fetal Presentation */}
                          <td className="py-3 px-4">
                            {displayFetalPresentation ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {displayFetalPresentation}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>

                          {/* 4. Volumes */}
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {volumeIds.length > 0 ? (
                                volumeIds.map((vId) => {
                                  const vol = volumes.find((v) => v.volume_id === vId);
                                  const name = vol?.volume_name || vId;
                                  return (
                                    <span
                                      key={vId}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 border border-gray-200 text-gray-800"
                                    >
                                      {name}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 border border-gray-200 text-gray-800">
                                  {cluster.volume_name || 'Volume'}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Step Recording */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                  (recordingCounts[cluster.cluster_id]?.step || 0) > 0
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-gray-50 text-gray-500 border-gray-200'
                                }`}
                              >
                                {recordingCounts[cluster.cluster_id]?.step || 0}
                              </span>
                            </div>
                          </td>

                          {/* Shadow Recording */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                  (recordingCounts[cluster.cluster_id]?.shadow || 0) > 0
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-gray-50 text-gray-500 border-gray-200'
                                }`}
                              >
                                {recordingCounts[cluster.cluster_id]?.shadow || 0}
                              </span>
                            </div>
                          </td>

                          {/* Action (Edit & Delete) */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(cluster)}
                                className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors cursor-pointer"
                                title="Edit Cluster"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCluster(cluster.cluster_id)}
                                className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                                title="Delete Cluster"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {!loading && (
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/50 px-4 py-4 rounded-b-lg">
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <p role="status" aria-live="polite">
                    Showing <span className="font-semibold text-gray-800">{filteredClusters.length ? pageStart + 1 : 0}–{Math.min(pageStart + pageSize, filteredClusters.length)}</span> of{' '}
                    <span className="font-semibold text-gray-800">{filteredClusters.length}</span> clusters
                  </p>
                  <label className="flex items-center gap-2">
                    Rows per page
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
                    >
                      {[5, 10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}
                    </select>
                  </label>
                </div>
                <Pagination
                  aria-label="Cluster list pagination"
                  count={pageCount}
                  page={currentPage}
                  onChange={(_, nextPage) => setPage(nextPage)}
                  disabled={filteredClusters.length === 0}
                  shape="rounded"
                  size="small"
                  siblingCount={0}
                  sx={{
                    '& .MuiPaginationItem-root': { border: '1px solid #e5e7eb', backgroundColor: '#fff', fontWeight: 500, borderRadius: '8px' },
                    '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#8DC63F', color: '#1f340e', borderColor: '#8DC63F' },
                    '& .MuiPaginationItem-root.Mui-selected:hover': { backgroundColor: '#7cb336' },
                    '& .MuiPaginationItem-ellipsis': { border: 0, backgroundColor: 'transparent' },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Cluster Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center border-b pb-3">
          <span className="font-bold text-gray-800 text-base">Add Cluster</span>
          <button
            type="button"
            onClick={handleCloseAddModal}
            className="text-gray-400 hover:text-gray-600 p-1 rounded cursor-pointer"
          >
            <X size={18} />
          </button>
        </DialogTitle>
        <form onSubmit={handleSaveCluster}>
          <DialogContent className="pt-4 space-y-4">
            <div>
              <TextField
                fullWidth
                size="small"
                label="Cluster Name"
                placeholder="e.g. Fetal Growth Assessment Cluster"
                value={clusterForm.cluster_name}
                onChange={(e) => setClusterForm({ ...clusterForm, cluster_name: e.target.value })}
                required
              />
            </div>

            <div>
              <TextField
                select
                fullWidth
                size="small"
                label="Fetal Presentation"
                value={clusterForm.fetal_presentation || ''}
                onChange={(e) => setClusterForm({ ...clusterForm, fetal_presentation: e.target.value })}
              >
                <MenuItem value="">Select Fetal Presentation</MenuItem>
                <MenuItem value="Cephalic_left">Cephalic_left</MenuItem>
                <MenuItem value="Cephalic_right">Cephalic_right</MenuItem>
                <MenuItem value="Breech_left">Breech_left</MenuItem>
                <MenuItem value="Breech_right">Breech_right</MenuItem>
              </TextField>
            </div>

            <div>
              <TextField
                select
                fullWidth
                size="small"
                label="Volumes"
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => {
                    if (!selected || selected.length === 0) return 'Select volumes';
                    return selected
                      .map((id) => volumes.find((v) => v.volume_id === id)?.volume_name || convertedVolumes.find((v) => v.volume_id === id)?.volume_name || id)
                      .join(', ');
                  },
                }}
                value={clusterForm.selected_volume_ids || []}
                onChange={(e) => {
                  const val = e.target.value;
                  setClusterForm({
                    ...clusterForm,
                    selected_volume_ids: typeof val === 'string' ? val.split(',') : (val || []),
                  });
                }}
                required
              >
                {convertedVolumes.length === 0 ? (
                  <MenuItem disabled value="">
                    No converted volumes available
                  </MenuItem>
                ) : (
                  convertedVolumes.map((vol) => (
                    <MenuItem key={vol.volume_id} value={vol.volume_id}>
                      <Checkbox
                        size="small"
                        checked={(clusterForm.selected_volume_ids || []).includes(vol.volume_id)}
                      />
                      <span className="font-medium text-gray-800 ml-1">{vol.volume_name}</span>
                      <span className="text-xs text-gray-400 ml-2">({vol.volume_type || 'Converted'})</span>
                    </MenuItem>
                  ))
                )}
              </TextField>
            </div>

          </DialogContent>
          <DialogActions className="border-t p-3 px-5">
            <button
              type="button"
              onClick={handleCloseAddModal}
              className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded border border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#8DC63F] hover:bg-[#7cb336] rounded shadow-sm cursor-pointer"
            >
              Add Cluster
            </button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Cluster Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center border-b pb-3">
          <span className="font-bold text-gray-800 text-base">Edit Cluster</span>
          <button
            type="button"
            onClick={handleCloseEditModal}
            className="text-gray-400 hover:text-gray-600 p-1 rounded cursor-pointer"
          >
            <X size={18} />
          </button>
        </DialogTitle>
        <form onSubmit={handleUpdateCluster}>
          <DialogContent className="pt-4 space-y-4">
            <div>
              <TextField
                fullWidth
                size="small"
                label="Cluster Name"
                value={editClusterForm.cluster_name}
                onChange={(e) => setEditClusterForm({ ...editClusterForm, cluster_name: e.target.value })}
                required
              />
            </div>

            <div>
              <TextField
                select
                fullWidth
                size="small"
                label="Fetal Presentation"
                value={editClusterForm.fetal_presentation || ''}
                onChange={(e) => setEditClusterForm({ ...editClusterForm, fetal_presentation: e.target.value })}
              >
                <MenuItem value="">Select Fetal Presentation</MenuItem>
                <MenuItem value="Cephalic_left">Cephalic_left</MenuItem>
                <MenuItem value="Cephalic_right">Cephalic_right</MenuItem>
                <MenuItem value="Breech_left">Breech_left</MenuItem>
                <MenuItem value="Breech_right">Breech_right</MenuItem>
              </TextField>
            </div>

            <div>
              <TextField
                select
                fullWidth
                size="small"
                label="Volumes"
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => {
                    if (!selected || selected.length === 0) return 'Select volumes';
                    return selected
                      .map((id) => volumes.find((v) => v.volume_id === id)?.volume_name || convertedVolumes.find((v) => v.volume_id === id)?.volume_name || id)
                      .join(', ');
                  },
                }}
                value={editClusterForm.selected_volume_ids || []}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditClusterForm({
                    ...editClusterForm,
                    selected_volume_ids: typeof val === 'string' ? val.split(',') : (val || []),
                  });
                }}
                required
              >
                {convertedVolumes.length === 0 ? (
                  <MenuItem disabled value="">
                    No converted volumes available
                  </MenuItem>
                ) : (
                  convertedVolumes.map((vol) => (
                    <MenuItem key={vol.volume_id} value={vol.volume_id}>
                      <Checkbox
                        size="small"
                        checked={(editClusterForm.selected_volume_ids || []).includes(vol.volume_id)}
                      />
                      <span className="font-medium text-gray-800 ml-1">{vol.volume_name}</span>
                      <span className="text-xs text-gray-400 ml-2">({vol.volume_type || 'Converted'})</span>
                    </MenuItem>
                  ))
                )}
              </TextField>
            </div>

          </DialogContent>
          <DialogActions className="border-t p-3 px-5">
            <button
              type="button"
              onClick={handleCloseEditModal}
              className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded border border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#8DC63F] hover:bg-[#7cb336] rounded shadow-sm cursor-pointer"
            >
              Save Changes
            </button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Upload / Replace Recording Modal */}
      <Dialog
        open={openUploadModal}
        onClose={handleCloseUploadModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center border-b pb-3">
          <div>
            <span className="font-bold text-gray-800 text-base">
              {modalMode === 'replace' ? 'Replace' : 'Upload'} {uploadType === 'step' ? 'Step' : 'Shadow'} Recording
            </span>
            {selectedUploadCluster && (
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Cluster: <span className="font-medium text-gray-700">{selectedUploadCluster.cluster_name}</span> ({selectedUploadCluster.cluster_id})
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleCloseUploadModal}
            className="text-gray-400 hover:text-gray-600 p-1 rounded cursor-pointer"
          >
            <X size={18} />
          </button>
        </DialogTitle>

        <form onSubmit={handleUploadRecordingSubmit}>
          <DialogContent className="pt-4 space-y-4 text-xs">
            {/* Mode switch tabs if cluster has existing recordings */}
            {clusterRecordings.length > 0 && (
              <div className="flex border-b border-gray-200 -mt-1 mb-2">
                <button
                  type="button"
                  onClick={() => handleSwitchModalMode('replace')}
                  className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    modalMode === 'replace'
                      ? 'border-[#8DC63F] text-[#8DC63F]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <RotateCcw size={13} />
                  <span>Replace Existing Recording</span>
                </button>
              </div>
            )}

            {/* Instruction banner */}
            {modalMode === 'replace' ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-[11px] leading-relaxed">
                <strong>Replace Mode:</strong> Every type of file can be replaced (JSON recordings, Audio .wav, Images, Manifest). Already existing files are shown under each section below. Choose new file(s) for any section you wish to replace; unselected sections will keep their existing files intact.
              </div>
            ) : (
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-800 text-[11px] leading-relaxed">
                Please upload all required files: <strong>at least 1 JSON file</strong>, <strong>1 WAV audio file</strong>, <strong>1 image file</strong>, and <strong>1 manifest file</strong>.
              </div>
            )}

            {/* If multiple recordings exist in replace mode, choose which recording to replace */}
            {modalMode === 'replace' && clusterRecordings.length > 1 && (
              <div>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Select Recording to Replace"
                  value={selectedRecordingId}
                  onChange={(e) => handleSelectRecordingToReplace(e.target.value)}
                  helperText="Choose the recording whose files you want to replace"
                >
                  {clusterRecordings.map((rec) => (
                    <MenuItem key={rec.recording_id} value={rec.recording_id}>
                      <span className="font-medium text-gray-800">{rec.recording_name || 'Recording'}</span>
                      <span className="text-xs text-gray-400 ml-2 font-mono">({rec.recording_id})</span>
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            )}

            {/* Recording Name */}
            <div>
              <TextField
                fullWidth
                size="small"
                label="Recording Name"
                placeholder="e.g. Fetal Heart Step Recording"
                value={uploadForm.recording_name}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, recording_name: e.target.value }))}
                required={modalMode === 'add'}
              />
            </div>

            {/* Select Volume (if cluster has multiple volumes, let user pick) */}
            {clusterVolumesForUpload.length > 1 && (
              <div>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Select Volume"
                  value={uploadForm.volume_id}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, volume_id: e.target.value }))}
                  required
                >
                  {clusterVolumesForUpload.map((vol) => (
                    <MenuItem key={vol.volume_id} value={vol.volume_id}>
                      <span className="font-medium text-gray-800">{vol.volume_name}</span>
                      <span className="text-xs text-gray-400 ml-2">({vol.volume_type || 'Volume'})</span>
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            )}

            {/* 1. JSON Files */}
            <div className={`border rounded-md p-3 ${modalMode === 'replace' ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50/50'}`}>
              <label className="block text-gray-700 font-semibold mb-1">
                JSON Recording Files (.json){' '}
                {modalMode === 'replace' ? (
                  <span className="text-gray-500 font-normal">(Select new file to replace)</span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </label>

              {/* Already existing JSON files display */}
              {modalMode === 'replace' && (
                <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-[11px] font-semibold text-gray-700 block mb-1">
                    Already existing JSON file(s):
                  </span>
                  {existingJsonFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {existingJsonFiles.map((fileRef, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-white border border-gray-300 text-gray-800 px-2 py-0.5 rounded text-[11px] font-mono shadow-xs"
                          title={fileRef}
                        >
                          <span className="text-gray-400">📄</span>
                          <span>{extractFileName(fileRef, `recording_${idx + 1}.json`)}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">No existing JSON files found</span>
                  )}
                </div>
              )}

              <input
                type="file"
                multiple
                accept=".json,application/json"
                onChange={handleJsonFilesChange}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7cb336] cursor-pointer"
              />
              {uploadForm.recording_files.length > 0 ? (
                <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px] text-emerald-700">
                  <span className="font-semibold">{modalMode === 'replace' ? 'Will replace with:' : 'Selected:'}</span>
                  {uploadForm.recording_files.map((f, i) => (
                    <span key={i} className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      {f.name}
                    </span>
                  ))}
                </div>
              ) : modalMode === 'replace' && existingJsonFiles.length > 0 ? (
                <div className="mt-1 text-[10px] text-gray-400 italic">
                  (No new file selected &mdash; existing JSON file will be kept)
                </div>
              ) : null}
            </div>

            {/* 2. Audio Files */}
            <div className={`border rounded-md p-3 ${modalMode === 'replace' ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50/50'}`}>
              <label className="block text-gray-700 font-semibold mb-1">
                Audio Files (.wav){' '}
                {modalMode === 'replace' ? (
                  <span className="text-gray-500 font-normal">(Select new file to replace)</span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </label>

              {/* Already existing Audio files display */}
              {modalMode === 'replace' && (
                <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-[11px] font-semibold text-gray-700 block mb-1">
                    Already existing audio file(s):
                  </span>
                  {existingAudioFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {existingAudioFiles.map((fileRef, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-white border border-gray-300 text-gray-800 px-2 py-0.5 rounded text-[11px] font-mono shadow-xs"
                          title={fileRef}
                        >
                          <span className="text-gray-400">🎵</span>
                          <span>{extractFileName(fileRef, `audio_${idx + 1}.wav`)}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">No existing audio files found</span>
                  )}
                </div>
              )}

              <input
                type="file"
                multiple
                accept=".wav,audio/wav,audio/*"
                onChange={handleAudioFilesChange}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7cb336] cursor-pointer"
              />
              {uploadForm.audio_files.length > 0 ? (
                <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px] text-emerald-700">
                  <span className="font-semibold">{modalMode === 'replace' ? 'Will replace with:' : 'Selected:'}</span>
                  {uploadForm.audio_files.map((f, i) => (
                    <span key={i} className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      {f.name}
                    </span>
                  ))}
                </div>
              ) : modalMode === 'replace' && existingAudioFiles.length > 0 ? (
                <div className="mt-1 text-[10px] text-gray-400 italic">
                  (No new file selected &mdash; existing audio file will be kept)
                </div>
              ) : null}
            </div>

            {/* 3. Image Files */}
            <div className={`border rounded-md p-3 ${modalMode === 'replace' ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50/50'}`}>
              <label className="block text-gray-700 font-semibold mb-1">
                Image Files (PNG, JPG, JPEG, WEBP){' '}
                {modalMode === 'replace' ? (
                  <span className="text-gray-500 font-normal">(Select new file to replace)</span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </label>

              {/* Already existing Image files display */}
              {modalMode === 'replace' && (
                <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-[11px] font-semibold text-gray-700 block mb-1">
                    Already existing image file(s):
                  </span>
                  {existingImageFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {existingImageFiles.map((fileRef, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-white border border-gray-300 text-gray-800 px-2 py-0.5 rounded text-[11px] font-mono shadow-xs"
                          title={fileRef}
                        >
                          <span className="text-gray-400">🖼️</span>
                          <span>{extractFileName(fileRef, `image_${idx + 1}.png`)}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">No existing image files found</span>
                  )}
                </div>
              )}

              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.webp,.gif,.bmp,image/*"
                onChange={handleImageFilesChange}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7cb336] cursor-pointer"
              />
              {uploadForm.image_files.length > 0 ? (
                <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px] text-emerald-700">
                  <span className="font-semibold">{modalMode === 'replace' ? 'Will replace with:' : 'Selected:'}</span>
                  {uploadForm.image_files.map((f, i) => (
                    <span key={i} className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      {f.name}
                    </span>
                  ))}
                </div>
              ) : modalMode === 'replace' && existingImageFiles.length > 0 ? (
                <div className="mt-1 text-[10px] text-gray-400 italic">
                  (No new file selected &mdash; existing images will be kept)
                </div>
              ) : null}
            </div>

            {/* 4. Manifest File */}
            <div className={`border rounded-md p-3 ${modalMode === 'replace' ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50/50'}`}>
              <label className="block text-gray-700 font-semibold mb-1">
                Manifest File (.json or .manifest){' '}
                {modalMode === 'replace' ? (
                  <span className="text-gray-500 font-normal">(Select new file to replace)</span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </label>

              {/* Already existing Manifest file display */}
              {modalMode === 'replace' && (
                <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-[11px] font-semibold text-gray-700 block mb-1">
                    Already existing manifest file:
                  </span>
                  {existingManifestFile ? (
                    <span
                      className="inline-flex items-center gap-1 bg-white border border-gray-300 text-gray-800 px-2 py-0.5 rounded text-[11px] font-mono shadow-xs"
                      title={existingManifestFile}
                    >
                      <span className="text-gray-400">📋</span>
                      <span>{extractFileName(existingManifestFile, 'manifest.json')}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">No existing manifest file found</span>
                  )}
                </div>
              )}

              <input
                type="file"
                accept=".json,.manifest,text/plain,application/json"
                onChange={handleManifestFileChange}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7cb336] cursor-pointer"
              />
              {uploadForm.manifest_file ? (
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-700">
                  <span className="font-semibold">{modalMode === 'replace' ? 'Will replace with:' : 'Selected:'}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                    {uploadForm.manifest_file.name}
                  </span>
                </div>
              ) : modalMode === 'replace' && existingManifestFile ? (
                <div className="mt-1 text-[10px] text-gray-400 italic">
                  (No new file selected &mdash; existing manifest will be kept)
                </div>
              ) : null}
            </div>
          </DialogContent>

          <DialogActions className="border-t p-3 px-5">
            <button
              type="button"
              onClick={handleCloseUploadModal}
              disabled={uploading}
              className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded border border-gray-300 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#8DC63F] hover:bg-[#7cb336] rounded shadow-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {uploading ? (
                <>
                  <ClipLoader color="#ffffff" size={12} />
                  <span>{modalMode === 'replace' ? 'Replacing...' : 'Uploading...'}</span>
                </>
              ) : (
                <span>{modalMode === 'replace' ? 'Replace Recording Files' : 'Upload Recording'}</span>
              )}
            </button>
          </DialogActions>
        </form>
      </Dialog>

    </div>
  );
}

export default Cluster;
