"use client";

import { Button } from "@shipshitdev/ui";
import { MarkdownEditor } from "@components/markdown/markdown-editor";
import type { ILessonFormProps, ILessonFormValues } from "@interfaces/lesson-form.interface";
import type { LessonAction, LessonPrompt } from "@interfaces/lesson.interface";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const EMPTY_VALUES: ILessonFormValues = {
  title: "",
  slug: "",
  courseId: "",
  sortOrder: 0,
  isPublished: false,
  isPreview: false,
  videoId: "",
  content: "",
  actions: [],
  prompts: [],
};

export function LessonForm({ initialValues, courses, submitLabel, onSubmit }: ILessonFormProps) {
  const [values, setValues] = useState<ILessonFormValues>(EMPTY_VALUES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues({ ...EMPTY_VALUES, ...initialValues });
  }, [initialValues]);

  const handleChange = (
    field: keyof ILessonFormValues,
    value: string | number | boolean | LessonAction[] | LessonPrompt[],
  ): void => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const addAction = () => {
    setValues((prev) => ({
      ...prev,
      actions: [...(prev.actions || []), { title: "", content: "", description: "" }],
    }));
  };

  const updateAction = (index: number, field: keyof LessonAction, value: string) => {
    setValues((prev) => {
      const actions = [...(prev.actions || [])];
      actions[index] = { ...actions[index], [field]: value };
      return { ...prev, actions };
    });
  };

  const removeAction = (index: number) => {
    setValues((prev) => ({
      ...prev,
      actions: (prev.actions || []).filter((_, i) => i !== index),
    }));
  };

  const addPrompt = () => {
    setValues((prev) => ({
      ...prev,
      prompts: [...(prev.prompts || []), { title: "", prompt: "", description: "" }],
    }));
  };

  const updatePrompt = (index: number, field: keyof LessonPrompt, value: string) => {
    setValues((prev) => {
      const prompts = [...(prev.prompts || [])];
      prompts[index] = { ...prompts[index], [field]: value };
      return { ...prev, prompts };
    });
  };

  const removePrompt = (index: number) => {
    setValues((prev) => ({
      ...prev,
      prompts: (prev.prompts || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Title</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.title}
            onChange={(event) => handleChange("title", event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Slug</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.slug}
            onChange={(event) => handleChange("slug", event.target.value)}
            placeholder="leave blank to auto-generate"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Course</span>
          <select
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.courseId}
            onChange={(event) => handleChange("courseId", event.target.value)}
          >
            <option value="">Select</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Sort order</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            type="number"
            value={values.sortOrder}
            onChange={(event) => handleChange("sortOrder", Number(event.target.value))}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-semibold">YouTube video ID</span>
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            value={values.videoId}
            onChange={(event) => handleChange("videoId", event.target.value)}
            placeholder="e.g. dQw4w9WgXcQ"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={values.isPublished}
            onChange={(event) => handleChange("isPublished", event.target.checked)}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={values.isPreview}
            onChange={(event) => handleChange("isPreview", event.target.checked)}
          />
          Preview lesson
        </label>
      </div>

      <MarkdownEditor value={values.content} onChange={(next) => handleChange("content", next)} />

      {/* Actions Section */}
      <div className="space-y-4 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
          <Button type="button" variant="outline" size="sm" onClick={addAction}>
            <Plus className="h-4 w-4 mr-1" />
            Add Action
          </Button>
        </div>
        {values.actions && values.actions.length > 0 ? (
          <div className="space-y-4">
            {values.actions.map((action, index) => (
              <div
                key={`action-${index}-${action.title || ""}-${action.content?.substring(0, 10) || ""}`}
                className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Action {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAction(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm">
                    <span className="font-semibold">Title</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                      value={action.title}
                      onChange={(e) => updateAction(index, "title", e.target.value)}
                      placeholder="e.g. Try this command"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-semibold">Description (optional)</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                      value={action.description || ""}
                      onChange={(e) => updateAction(index, "description", e.target.value)}
                      placeholder="Brief description of what this action does"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-semibold">Content</span>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2 font-mono text-sm"
                      rows={4}
                      value={action.content}
                      onChange={(e) => updateAction(index, "content", e.target.value)}
                      placeholder="The action content to copy (command, code, etc.)"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No actions added yet.</p>
        )}
      </div>

      {/* Prompts Section */}
      <div className="space-y-4 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Prompts</h3>
          <Button type="button" variant="outline" size="sm" onClick={addPrompt}>
            <Plus className="h-4 w-4 mr-1" />
            Add Prompt
          </Button>
        </div>
        {values.prompts && values.prompts.length > 0 ? (
          <div className="space-y-4">
            {values.prompts.map((prompt, index) => {
              const promptKey = `${prompt.title || ""}-${prompt.prompt?.substring(0, 20) || ""}-${index}`;
              return (
                <div
                  key={promptKey}
                  className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Prompt {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePrompt(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm">
                      <span className="font-semibold">Title</span>
                      <input
                        className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                        value={prompt.title}
                        onChange={(e) => updatePrompt(index, "title", e.target.value)}
                        placeholder="e.g. ChatGPT Prompt for X"
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="font-semibold">Description (optional)</span>
                      <input
                        className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                        value={prompt.description || ""}
                        onChange={(e) => updatePrompt(index, "description", e.target.value)}
                        placeholder="Brief description of what this prompt does"
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="font-semibold">Prompt</span>
                      <textarea
                        className="mt-1 w-full rounded-lg border border-gray-200 p-2 font-mono text-sm"
                        rows={6}
                        value={prompt.prompt}
                        onChange={(e) => updatePrompt(index, "prompt", e.target.value)}
                        placeholder="The prompt text to copy"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No prompts added yet.</p>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}
