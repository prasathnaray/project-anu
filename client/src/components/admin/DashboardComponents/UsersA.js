import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { BriefcaseBusiness, GraduationCap, Layers3, Users } from "lucide-react";
import GetIntructorsAPI from "../../../API/GetIntructorsAPI";
import TraineeListAPI from "../../../API/TraineeListAPI";
import TraineesPerBatch from "../../../charts/TraineesPerBatch";

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
}

function UsersA({ APIS }) {
  const programOptions = [
    { value: "103", label: "Trainees" },
    { value: "102", label: "Instructors" },
  ];
  const [apiState, setApiState] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [role, setRole] = React.useState("103");

  const handleAPI = async (roleValue) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = roleValue === "102"
        ? await GetIntructorsAPI(token)
        : await TraineeListAPI(1, 500);
      setApiState(roleValue === "102" ? response?.data || [] : response?.data?.rows || []);
    } catch (err) {
      console.log(err);
      setApiState([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => { handleAPI("103"); }, []);

  const selectedLabel = programOptions.find((option) => option.value === role)?.label;
  const totalUsers = apiState.length;
  const totalBatches = new Set(
    apiState.flatMap((person) => Array.isArray(person?.batch_names)
      ? person.batch_names.filter(Boolean)
      : [person?.batch_names || person?.batch_name].filter(Boolean))
  ).size;

  return (
    <div className="px-3 py-5 md:px-5">
      <div className="rounded-2xl bg-gradient-to-r from-[#1f3a2d] via-[#2f6044] to-[#8DC63F] p-6 text-white shadow-lg">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-100"><Users size={17} /> People directory</div>
            <h1 className="text-2xl font-bold tracking-tight">Users &amp; cohorts</h1>
            <p className="mt-1 max-w-xl text-sm text-green-50">Review your {selectedLabel.toLowerCase()} and see how people are distributed across batches.</p>
          </div>
          <div className="w-full rounded-xl bg-white/95 p-1.5 text-gray-700 shadow-sm md:w-[220px]">
            <FormControl fullWidth size="small">
              <InputLabel id="users-role-select-label">View people</InputLabel>
              <Select
                labelId="users-role-select-label"
                value={role}
                onChange={(event) => {
                  const nextRole = event.target.value;
                  setRole(nextRole);
                  handleAPI(nextRole);
                }}
                label="View people"
              >
                {programOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total {selectedLabel}</p><p className="mt-2 text-3xl font-bold text-gray-800">{totalUsers}</p></div><div className="rounded-xl bg-green-50 p-3 text-[#6da52f]"><Users size={22} /></div></div></div>
        <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Assigned batches</p><p className="mt-2 text-3xl font-bold text-gray-800">{totalBatches}</p></div><div className="rounded-xl bg-blue-50 p-3 text-blue-500"><Layers3 size={22} /></div></div></div>
        <div className="hidden rounded-xl border border-purple-100 bg-white p-4 shadow-sm lg:block"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Current view</p><p className="mt-2 text-xl font-bold text-gray-800">{selectedLabel}</p></div><div className="rounded-xl bg-purple-50 p-3 text-purple-500">{role === "103" ? <GraduationCap size={22} /> : <BriefcaseBusiness size={22} />}</div></div></div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><div><h2 className="font-bold text-gray-800">{selectedLabel} directory</h2><p className="mt-1 text-xs text-gray-400">Names, batch assignments, and account status</p></div><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#6da52f]">{totalUsers} people</span></div>
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead className="sticky top-0 z-[1] bg-gray-50/95 text-[11px] uppercase tracking-wider text-gray-400"><tr><th className="px-5 py-3 font-semibold">Name</th><th className="px-5 py-3 font-semibold">Batch</th><th className="px-5 py-3 font-semibold">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? <tr><td colSpan={3} className="px-5 py-12 text-center text-sm text-gray-400">Loading people…</td></tr> : apiState.length === 0 ? <tr><td colSpan={3} className="px-5 py-12 text-center text-sm text-gray-400">No {selectedLabel.toLowerCase()} found.</td></tr> : apiState.map((person, index) => {
                  const name = person?.user_name || "Unnamed user";
                  const batches = Array.isArray(person?.batch_names) ? person.batch_names.filter(Boolean).join(", ") : person?.batch_names || person?.batch_name || "Not assigned";
                  const status = person?.status || "Unknown";
                  return <tr key={person?.people_id || person?.user_email || index} className="transition-colors hover:bg-green-50/40"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-[#5d9129]">{initials(name)}</div><div><p className="font-semibold text-gray-800">{name}</p>{person?.user_email && <p className="max-w-[260px] truncate text-xs text-gray-400">{person.user_email}</p>}</div></div></td><td className="px-5 py-3.5 text-sm text-gray-600">{batches}</td><td className="px-5 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${String(status).toLowerCase() === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{status}</span></td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="mb-2 flex items-center justify-between"><div><h2 className="font-bold text-gray-800">Trainees per batch</h2><p className="mt-1 text-xs text-gray-400">Current distribution across cohorts</p></div><div className="rounded-xl bg-amber-50 p-2.5 text-amber-500"><Layers3 size={19} /></div></div><div className="flex min-h-[320px] items-center justify-center"><TraineesPerBatch PropsTraineesPerBatch={APIS} /></div></section>
      </div>
    </div>
  );
}

export default UsersA;
