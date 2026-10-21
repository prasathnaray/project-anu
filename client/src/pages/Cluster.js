import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import GetVolInsAPI from '../API/GetVolInsAPI';

const STORAGE_KEY = 'project_anu_cluster_list';

function Cluster() {
  const navigate = useNavigate();
  const [buttonOpen, setButtonOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [volumes, setVolumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleButtonOpen = () => {
    setButtonOpen((prev) => !prev);
  };

  const isFetchingRef = useRef(false);
  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const [volumeResult] = await Promise.allSettled([
        GetVolInsAPI(),
      ]);

      if (volumeResult.status === 'rejected') {
        throw volumeResult.reason;
      }

      const allVolumes = Array.isArray(volumeResult.value?.data) ? volumeResult.value.data : [];

      setVolumes(allVolumes);

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
    return volumes.filter((vol) => Boolean(vol.conversion_completion));
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

  const handleSaveCluster = (e) => {
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
    setOpenAddModal(false);
    toast.success('Cluster added successfully!');
  };

  const handleDeleteCluster = (clusterId) => {
    const updated = clusters.filter((c) => c.cluster_id !== clusterId);
    setClusters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  const handleUpdateCluster = (e) => {
    e.preventDefault();
    if (!editClusterForm.cluster_name.trim()) {
      toast.error('Please enter a cluster name.');
      return;
    }
    if (!editClusterForm.selected_volume_ids || editClusterForm.selected_volume_ids.length === 0) {
      toast.error('Please select at least one volume.');
      return;
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search size={16} className="text-gray-400 mr-2" />,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#8DC63F] hover:bg-[#7cb336] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <Plus size={16} />
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
                    filteredClusters.map((cluster) => {
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

                          {/* Recordings are intentionally isolated from Cluster. */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[11px] bg-gray-50 text-gray-500 border border-gray-200 font-semibold">
                              0
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[11px] bg-gray-50 text-gray-500 border border-gray-200 font-semibold">
                              0
                            </span>
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

    </div>
  );
}

export default Cluster;
