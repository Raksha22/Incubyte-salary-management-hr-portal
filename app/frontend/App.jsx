import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch, apiJson } from "./api";

const emptyEmployee = {
  first_name: "",
  last_name: "",
  job_title: "",
  country: "United States",
  currency: "USD",
  annual_salary: "",
  email: "",
  department: "",
};

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "India",
  "Japan",
  "Australia",
  "Brazil",
  "Mexico",
  "Netherlands",
  "Spain",
  "Italy",
  "Sweden",
  "Poland",
  "Singapore",
  "Ireland",
  "South Africa",
];

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium ${
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function EmployeesPanel() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [per] = useState(25);
  const [country, setCountry] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyEmployee);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        per: String(per),
      });
      if (country) params.set("country", country);
      if (q) params.set("q", q);
      const { res, body } = await apiFetch(`/api/v1/employees?${params}`);
      setItems(Array.isArray(body) ? body : []);
      setTotal(Number(res.headers.get("X-Total-Count") || 0));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, per, country, q]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm(emptyEmployee);
    setModal("create");
  };

  const openEdit = (row) => {
    setForm({
      first_name: row.first_name,
      last_name: row.last_name,
      job_title: row.job_title,
      country: row.country,
      currency: row.currency,
      annual_salary: String(row.annual_salary),
      email: row.email,
      department: row.department || "",
    });
    setModal({ mode: "edit", id: row.id });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      employee: {
        ...form,
        annual_salary: Number(form.annual_salary),
      },
    };
    try {
      if (modal === "create") {
        await apiFetch("/api/v1/employees", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else if (modal?.mode === "edit") {
        await apiFetch(`/api/v1/employees/${modal.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      }
      setModal(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    setError("");
    try {
      await apiFetch(`/api/v1/employees/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / per)),
    [total, per],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600">
            Country
          </label>
          <select
            className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            value={country}
            onChange={(e) => {
              setPage(1);
              setCountry(e.target.value);
            }}
          >
            <option value="">All</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[220px] flex-1">
          <label className="block text-xs font-medium text-slate-600">
            Search
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Name, email, or job title"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Add employee
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-slate-700">
                Name
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-700">
                Title
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-700">
                Country
              </th>
              <th className="px-3 py-2 text-right font-medium text-slate-700">
                Salary
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-700">
                Email
              </th>
              <th className="px-3 py-2 text-right font-medium text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-medium text-slate-900">
                  {row.full_name}
                </td>
                <td className="px-3 py-2 text-slate-700">{row.job_title}</td>
                <td className="px-3 py-2 text-slate-700">{row.country}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-900">
                  {row.currency} {Number(row.annual_salary).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-slate-600">{row.email}</td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button
                    type="button"
                    className="text-indigo-600 hover:underline"
                    onClick={() => openEdit(row)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-red-600 hover:underline"
                    onClick={() => remove(row.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Page {page} of {pages} — {per} per page of {total.toLocaleString()}{" "}
          employees
        </span>
        <div className="space-x-2">
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              {modal === "create" ? "Add employee" : "Edit employee"}
            </h3>
            <form className="mt-4 space-y-3" onSubmit={submit}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    First name
                  </label>
                  <input
                    required
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    value={form.first_name}
                    onChange={(e) =>
                      setForm({ ...form, first_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Last name
                  </label>
                  <input
                    required
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    value={form.last_name}
                    onChange={(e) =>
                      setForm({ ...form, last_name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Job title
                </label>
                <input
                  required
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={form.job_title}
                  onChange={(e) =>
                    setForm({ ...form, job_title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Country
                  </label>
                  <select
                    required
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Currency
                  </label>
                  <input
                    required
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    value={form.currency}
                    onChange={(e) =>
                      setForm({ ...form, currency: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Annual salary
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={form.annual_salary}
                  onChange={(e) =>
                    setForm({ ...form, annual_salary: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={modal?.mode === "edit"}
                  title={
                    modal?.mode === "edit"
                      ? "Email is the stable identifier in this demo"
                      : ""
                  }
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Department
                </label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded border border-slate-300 px-4 py-2 text-sm"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InsightsPanel() {
  const [country, setCountry] = useState("United States");
  const [jobTitle, setJobTitle] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const params = new URLSearchParams({ country });
      if (jobTitle.trim()) params.set("job_title", jobTitle.trim());
      const json = await apiJson(`/api/v1/salary_insights?${params}`);
      setData(json);
    } catch (e) {
      setError(e.message);
      setData(null);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600">
            Country
          </label>
          <select
            className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[240px] flex-1">
          <label className="block text-xs font-medium text-slate-600">
            Job title filter (optional)
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Exact title, e.g. Software Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Refresh
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {data ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">
              Country-wide salary
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Employees</dt>
                <dd className="font-medium tabular-nums">
                  {data.overall?.employee_count}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Minimum</dt>
                <dd className="font-medium tabular-nums">
                  {data.overall?.min_salary?.toLocaleString?.()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Maximum</dt>
                <dd className="font-medium tabular-nums">
                  {data.overall?.max_salary?.toLocaleString?.()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Average</dt>
                <dd className="font-medium tabular-nums">
                  {data.overall?.avg_salary?.toLocaleString?.()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Total payroll</dt>
                <dd className="font-medium tabular-nums">
                  {data.overall?.total_payroll?.toLocaleString?.()}
                </dd>
              </div>
            </dl>
          </div>
          {data.filtered_by_job_title ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">
                Selected job title
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Matches exact title within the country.
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Employees</dt>
                  <dd className="font-medium tabular-nums">
                    {data.filtered_by_job_title.employee_count}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Average</dt>
                  <dd className="font-medium tabular-nums">
                    {data.filtered_by_job_title.avg_salary?.toLocaleString?.()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Min / Max</dt>
                  <dd className="font-medium tabular-nums">
                    {data.filtered_by_job_title.min_salary?.toLocaleString?.()}{" "}
                    —{" "}
                    {data.filtered_by_job_title.max_salary?.toLocaleString?.()}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
          <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">
              Top job titles (headcount & averages)
            </h3>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Count</th>
                    <th className="py-2 pr-4">Avg</th>
                    <th className="py-2 pr-4">Min</th>
                    <th className="py-2">Max</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.job_title_breakdown || []).map((row) => (
                    <tr
                      key={row.job_title}
                      className="border-b border-slate-100"
                    >
                      <td className="py-2 pr-4 font-medium text-slate-900">
                        {row.job_title}
                      </td>
                      <td className="py-2 pr-4 tabular-nums">
                        {row.employee_count}
                      </td>
                      <td className="py-2 pr-4 tabular-nums">
                        {row.avg_salary?.toLocaleString?.()}
                      </td>
                      <td className="py-2 pr-4 tabular-nums">
                        {row.min_salary?.toLocaleString?.()}
                      </td>
                      <td className="py-2 tabular-nums">
                        {row.max_salary?.toLocaleString?.()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("employees");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Salary management</h1>
        <p className="mt-1 text-sm text-slate-600">
          HR workspace for employee records and country-level salary insights.
        </p>
        <div className="mt-4 flex gap-2">
          <TabButton
            active={tab === "employees"}
            onClick={() => setTab("employees")}
          >
            Employees
          </TabButton>
          <TabButton
            active={tab === "insights"}
            onClick={() => setTab("insights")}
          >
            Salary insights
          </TabButton>
        </div>
      </header>
      {tab === "employees" ? <EmployeesPanel /> : <InsightsPanel />}
    </div>
  );
}
