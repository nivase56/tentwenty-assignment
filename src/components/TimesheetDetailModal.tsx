import React, { useState, useEffect } from "react";
import { TimesheetEntry } from "@/types/timesheet";

interface TimesheetDetailModalProps {
	isOpen: boolean;
	entry: TimesheetEntry | null;
	onClose: () => void;
	onSave: (entry: TimesheetEntry) => void;
}

export const TimesheetDetailModal: React.FC<TimesheetDetailModalProps> = ({ isOpen, entry, onClose, onSave }) => {
		const [form, setForm] = useState({
			project: "",
			description: "",
			hours: 0,
			date: "",
		});

		useEffect(() => {
			if (entry) {
				setForm({
					project: entry.project || "",
					description: entry.description || "",
					hours: entry.hours || 0,
					date: entry.date || "",
				});
			}
		}, [entry]);

	if (!isOpen || !entry) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: name === "hours" ? Number(value) : value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({ ...entry, ...form });
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
				<h3 className="text-lg font-bold mb-4">Edit Entry</h3>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="project"
						value={form.project}
						onChange={handleChange}
						placeholder="Project"
						className="w-full border rounded px-3 py-2"
						required
					/>
								{/* Removed type field, not present in TimesheetEntry */}
					<textarea
						name="description"
						value={form.description}
						onChange={handleChange}
						placeholder="Description"
						className="w-full border rounded px-3 py-2"
						required
					/>
					<input
						type="number"
						name="hours"
						value={form.hours}
						onChange={handleChange}
						placeholder="Hours"
						className="w-full border rounded px-3 py-2"
						min={0}
						max={24}
						required
					/>
					<div className="flex justify-end gap-2">
						<button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
						<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
					</div>
				</form>
			</div>
		</div>
	);
};
