import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Layers, PlusCircle, Trash2, Edit3, RefreshCw, Activity, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

// 🩺 হসপিটালের কমন মেডিকেল টেস্টগুলোর প্রফেশনাল ডেটাবেজ
const COMMON_HOSPITAL_TESTS = [
  { name: "Complete Blood Count (CBC)", code: "CBC01", defaultFee: 400, desc: "Routine blood test to evaluate overall health." },
  { name: "Random Blood Sugar (RBS)", code: "RBS02", defaultFee: 150, desc: "Measures blood glucose at any given time." },
  { name: "Fasting Blood Sugar (FBS)", code: "FBS03", defaultFee: 150, desc: "Requires 8-12 hours of fasting before test." },
  { name: "HbA1c (Glycated Haemoglobin)", code: "HBA1C", defaultFee: 1200, desc: "Reflects average blood sugar levels over 3 months." },
  { name: "Lipid Profile", code: "LIPID", defaultFee: 1000, desc: "Measures cholesterol and triglycerides (Fasting required)." },
  { name: "Serum Creatinine (Kidney Function)", code: "CREAT", defaultFee: 350, desc: "Evaluates how well kidneys are filtering waste." },
  { name: "SGPT / ALT (Liver Function)", code: "SGPT01", defaultFee: 400, desc: "Checks for liver damage or inflammation." },
  { name: "Urine Routine Examination (Urine R/E)", code: "URINE", defaultFee: 250, desc: "Analyzes urine for infections or kidney issues." },
  { name: "X-Ray Chest P/A View", code: "XRAY01", defaultFee: 500, desc: "Imaging to inspect lungs, heart, and chest wall." },
  { name: "Ultrasonography (USG) of Whole Abdomen", code: "USG01", defaultFee: 1500, desc: "6-8 hours fasting or full bladder might be required." },
  { name: "Electrocardiogram (ECG / EKG)", code: "ECG01", defaultFee: 400, desc: "Records the electrical signals of the heart." },
  { name: "Echocardiogram (2D Echo)", code: "ECHO01", defaultFee: 2500, desc: "Ultrasound of the heart to examine structure and valves." },
  { name: "CT Scan - Brain (Plain)", code: "CTBR01", defaultFee: 4000, desc: "Advanced cross-sectional imaging of brain tissue." },
  { name: "MRI of Brain (Plain)", code: "MRIBR1", defaultFee: 7000, desc: "High-resolution magnetic resonance imaging of brain." },
  { name: "Dengue NS1 Antigen", code: "DENGNS1", defaultFee: 600, desc: "Rapid test for early detection of Dengue virus." },
  { name: "TSH (Thyroid Stimulating Hormone)", code: "TSH01", defaultFee: 600, desc: "Evaluates thyroid gland function." },
];

const ManageTests = () => {
  const { user } = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // ফর্ম স্টেট
  const [testName, setTestName] = useState('');
  const [testCode, setTestCode] = useState('');
  const [testFee, setTestFee] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  // 🎯 ডাটা ফেচ ফাংশন (Clean Roster Path)
  const loadTests = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/hospitals/tests/${user.email}`);
      const data = await res.json();
      setTests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadTests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // 🎯 ড্রপডাউন সিলেক্ট ইভেন্ট
  const handleDropdownChange = (selectedName) => {
    setTestName(selectedName);
    const matchedPreset = COMMON_HOSPITAL_TESTS.find(t => t.name === selectedName);
    if (matchedPreset) {
      setTestCode(matchedPreset.code);
      setTestFee(matchedPreset.defaultFee);
      setDescription(matchedPreset.desc);
    } else {
      setTestCode('');
      setTestFee('');
      setDescription('');
    }
  };

  // 🎯 সাবমিট হ্যান্ডলার (অ্যাড এবং এডিট)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testName || !testCode || !testFee) {
      return Swal.fire('Missing Fields', 'Please complete the configuration parameters.', 'error');
    }

    setBtnLoading(true);
    const payload = { adminEmail: user?.email, testName, testCode, testFee, description };

    try {
      let res;
      if (editingId) {
        res = await fetch(`http://localhost:3000/hospitals/tests/update/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, status: 'available' })
        });
      } else {
        res = await fetch(`http://localhost:3000/hospitals/tests/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        throw new Error("HTTP Server Error Pipeline");
      }

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: editingId ? 'Catalog Updated!' : 'Test Active!',
          text: editingId ? 'Parameter rewritten successfully.' : 'New diagnostics added to hospital list.',
          timer: 1500,
          showConfirmButton: false
        });
        resetForm();
        loadTests();
      } else {
        Swal.fire('Failed', result.message || 'Operation aborted', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Server Sync Failure. Please ensure backend routes are correct.', 'error');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleEditClick = (test) => {
    setEditingId(test._id);
    setTestName(test.testName);
    setTestCode(test.testCode);
    setTestFee(test.testFee);
    setDescription(test.description);
  };

  const resetForm = () => {
    setEditingId(null);
    setTestName('');
    setTestCode('');
    setTestFee('');
    setDescription('');
  };

  const handleDeleteTest = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action will purge this record from hospital database matrix!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete permanently'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/hospitals/tests/delete/${id}`, { method: 'DELETE' });
          if (res.ok) {
            Swal.fire('Purged!', 'Test profile destroyed.', 'success');
            loadTests();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-900">🔬 Hospital Diagnostic Tests & Pricing</h2>
          <p className="text-xs text-gray-400 mt-0.5">Select common clinical presets, adjust local pricing catalogs instantly.</p>
        </div>
        <button onClick={loadTests} className="btn btn-ghost btn-circle border border-gray-100 bg-gray-50 hover:bg-gray-100">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-fit">
          <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" />
            {editingId ? "📝 Edit Test Parameter" : "🚀 Map New Medical Test"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-gray-500">Select Medical Test *</label>
              <select 
                className="select select-bordered w-full rounded-xl text-sm font-bold bg-gray-50 border-gray-200"
                value={testName}
                onChange={(e) => handleDropdownChange(e.target.value)}
                disabled={!!editingId}
                required
              >
                <option value="">-- Choose Diagnostic Exam --</option>
                {COMMON_HOSPITAL_TESTS.map((preset, index) => (
                  <option key={index} value={preset.name}>📍 {preset.name}</option>
                ))}
                <option value="Custom Test Profile">➕ Custom Test (Not in preset list)</option>
              </select>
              {testName === "Custom Test Profile" && (
                <input 
                  type="text"
                  placeholder="Enter Custom Test Name"
                  className="input input-bordered w-full rounded-xl text-sm font-semibold mt-2 bg-blue-50/50"
                  onChange={(e) => setTestName(e.target.value)}
                  required
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-bold text-gray-500">Test Code *</label>
                <input 
                  type="text" 
                  placeholder="e.g., CBC01" 
                  className="input input-bordered w-full rounded-xl text-sm font-bold font-mono text-primary bg-gray-50 border-gray-200"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label text-xs font-bold text-gray-500">Test Fee (BDT) *</label>
                <input 
                  type="number" 
                  placeholder="TK" 
                  className="input input-bordered w-full rounded-xl text-sm font-black text-gray-900 border-gray-200"
                  value={testFee}
                  onChange={(e) => setTestFee(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="label text-xs font-bold text-gray-500">Clinical Instruction / Description</label>
              <textarea 
                placeholder="Instructions..." 
                className="textarea textarea-bordered w-full rounded-xl text-xs font-medium h-20 bg-gray-50 border-gray-200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Auto-populated based on medical smart presets.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={btnLoading} className="btn btn-primary flex-1 rounded-xl text-white font-bold text-sm tracking-wide shadow-md">
                {btnLoading ? <span className="loading loading-spinner loading-xs"></span> : editingId ? "Update Test" : "Save to Catalog"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-ghost border border-gray-200 rounded-xl font-bold">Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-400" /> Active Hospital Catalog ({tests.length})
          </h3>
          
          {loading && tests.length === 0 ? (
            <div className="flex justify-center py-12"><span className="loading loading-spinner text-primary loading-lg"></span></div>
          ) : tests.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Activity className="w-12 h-12 text-gray-300 mx-auto animate-pulse" />
              <h4 className="text-sm font-bold text-gray-600">No Catalog Matches</h4>
              <p className="text-xs text-gray-400">Add medical parameters to build your diagnostic catalog matrix.</p>
            </div>
          ) : (
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th>Test Specifications</th>
                  <th>Hospital Rate</th>
                  <th>Clinical Instruction</th>
                  <th className="text-right">Roster Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 font-semibold">
                {tests.map((test) => (
                  <tr key={test._id} className="border-b border-gray-50">
                    <td>
                      <div className="font-bold text-gray-900">{test.testName}</div>
                      <div className="text-[10px] text-primary font-mono bg-blue-50 px-2 py-0.5 rounded-md w-fit mt-0.5 font-bold">{test.testCode}</div>
                    </td>
                    <td className="text-gray-900 font-black text-sm">{test.testFee} ৳</td>
                    <td className="max-w-[200px] text-xs text-gray-400 font-normal leading-relaxed">{test.description || 'No specialized instructions.'}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEditClick(test)} className="btn btn-ghost btn-circle text-blue-500 hover:bg-blue-50 btn-xs" title="Modify Test Pricing"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteTest(test._id)} className="btn btn-ghost btn-circle text-red-500 hover:bg-red-50 btn-xs" title="Purge Test"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTests;