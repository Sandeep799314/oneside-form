import React from "react";
import { User, Briefcase, Phone, Mail, Building2, Globe } from "lucide-react";

export default function ContactCard({ contact, isEditing, onUpdate }) {

  const handleChange = (field, value) => {
    onUpdate({
      ...contact,
      [field]: value
    });
  };

  return (

    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">

        <DetailRow
          icon={<User size={18} />}
          label="Name"
          value={contact?.name}
          isEditing={isEditing}
          onChange={(v) => handleChange("name", v)}
        />

        <DetailRow
          icon={<Briefcase size={18} />}
          label="Designation"
          value={contact?.designation}
          isEditing={isEditing}
          onChange={(v) => handleChange("designation", v)}
        />

        <DetailRow
          icon={<Phone size={18} />}
          label="Phone"
          value={contact?.phone}
          isEditing={isEditing}
          onChange={(v) => handleChange("phone", v)}
        />

        <DetailRow
          icon={<Mail size={18} />}
          label="Email"
          value={contact?.email}
          isEditing={isEditing}
          onChange={(v) => handleChange("email", v)}
        />

        <DetailRow
          icon={<Building2 size={18} />}
          label="Company"
          value={contact?.company}
          isEditing={isEditing}
          onChange={(v) => handleChange("company", v)}
        />

        <DetailRow
          icon={<Globe size={18} />}
          label="Website"
          value={contact?.website}
          isEditing={isEditing}
          onChange={(v) => handleChange("website", v)}
        />

      </div>

    </div>
  );
}


function DetailRow({ icon, label, value, isEditing, onChange }) {

  return (

    <div className="flex gap-4">

      <div className="w-10 h-10 bg-gray-50 border rounded-xl flex items-center justify-center text-[#eab308]">
        {icon}
      </div>

      <div className="flex flex-col w-full">

        <span className="text-[9px] uppercase text-gray-400 font-bold">
          {label}
        </span>

        {isEditing && onChange ? (

          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm font-bold"
          />

        ) : (

          <span className="text-sm font-bold text-gray-800">
            {value || "—"}
          </span>

        )}

      </div>

    </div>

  );

}