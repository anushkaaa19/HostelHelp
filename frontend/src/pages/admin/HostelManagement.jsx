import { useState, useEffect } from "react";
import {
  getHostels,
  createHostel,
  updateHostel,
  deleteHostel,
} from "../../services/hostelService";

export default function HostelManagement() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    facilities: "",
  });

  // Edit Modal State
  const [editingHostel, setEditingHostel] = useState(null);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await getHostels();
      setHostels(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch hostels");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        facilities: formData.facilities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await createHostel(payload);
      setSuccessMsg("Hostel created successfully!");
      setFormData({ name: "", address: "", facilities: "" });
      fetchHostels();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create hostel");
    }
  };

  const handleEditClick = (hostel) => {
    setEditingHostel({
      ...hostel,
      facilities: Array.isArray(hostel.facilities)
        ? hostel.facilities.join(", ")
        : "",
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const payload = {
        name: editingHostel.name,
        address: editingHostel.address,
        facilities: editingHostel.facilities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await updateHostel(editingHostel._id, payload);
      setSuccessMsg("Hostel updated successfully!");
      setEditingHostel(null);
      fetchHostels();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update hostel");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setError("");
    setSuccessMsg("");

    try {
      await deleteHostel(id);
      setSuccessMsg("Hostel deleted successfully!");
      fetchHostels();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete hostel");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hostel Management</h1>
        <p className="text-sm text-slate-500">Create, view, update, and manage campus hostels</p>
      </div>

      {/* Status Banners */}
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
          {successMsg}
        </div>
      )}

      {/* Creation Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Add New Hostel</h2>
        <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Hostel Name *</label>
            <input
              type="text"
              placeholder="e.g. Aryabhata Hall"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Address / Location</label>
            <input
              type="text"
              placeholder="e.g. North Campus, Block 4"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Facilities (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Wi-Fi, Gym, Laundry"
              value={formData.facilities}
              onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition"
            >
              Create Hostel
            </button>
          </div>
        </form>
      </div>

      {/* Hostels Table / Card List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">All Hostels</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading hostels...</div>
        ) : hostels.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No hostels found. Add one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Address</th>
                  <th className="px-6 py-3.5">Facilities</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hostels.map((hostel) => (
                  <tr key={hostel._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{hostel.name}</td>
                    <td className="px-6 py-4">{hostel.address || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {hostel.facilities && hostel.facilities.length > 0 ? (
                          hostel.facilities.map((fac, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-md"
                            >
                              {fac}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(hostel)}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hostel._id, hostel.name)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingHostel && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Edit Hostel</h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Hostel Name *</label>
                <input
                  type="text"
                  value={editingHostel.name}
                  onChange={(e) =>
                    setEditingHostel({ ...editingHostel, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editingHostel.address}
                  onChange={(e) =>
                    setEditingHostel({ ...editingHostel, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Facilities (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingHostel.facilities}
                  onChange={(e) =>
                    setEditingHostel({ ...editingHostel, facilities: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingHostel(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}