"use client";

import { useState, KeyboardEvent, useTransition, useRef } from "react";
import { addSkill, deleteSkill } from "@/app/actions";
import { Input } from "./ui/input";
import { X, Plus } from "lucide-react";

interface Skill {
  id: number;
  skill: string;
}

export default function SkillsPills({ skills }: { skills?: Skill[] }) {
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddSkill = async () => {
    if (!inputValue.trim()) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("skill", inputValue.trim());

      const result = await addSkill({}, formData);

      if (result.success) {
        setInputValue("");
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    });
  };

  const handleDeleteSkill = async (skillId: number) => {
    startTransition(async () => {
      await deleteSkill(skillId);
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Agregar habilidad"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="flex-1"
        />
        <button
          onClick={handleAddSkill}
          disabled={isPending || !inputValue.trim()}
          type="button"
          className="
            p-1 rounded-full 
            disabled:opacity-50 
            disabled:cursor-default 
          enabled:hover:bg-gray-100 
            enabled:cursor-pointer
          "
        >
          <Plus size={18} />
        </button>
      </div>

      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100  text-primary rounded-full text-sm font-medium"
            >
              <span>{skill.skill}</span>
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                disabled={isPending}
                className="ml-1 hover:bg-primary/10 rounded-full p-0.5 transition-colors disabled:opacity-50 cursor-pointer"
                type="button"
                aria-label={`Eliminar ${skill.skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
