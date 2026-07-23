'use client'

import { useRef, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload, Image, X, Loader2, Check, ChevronRight } from "lucide-react"
import { MAX_FILE_SIZE, ACCEPTED_PDF_TYPES, MAX_IMAGE_SIZE, ACCEPTED_IMAGE_TYPES, voiceOptions, voiceCategories, DEFAULT_VOICE } from "@/lib/constanst"

/* ─────────────────────────────────────────────
   Validation schema
   ───────────────────────────────────────────── */
const formSchema = z.object({
  pdfFile: z
    .instanceof(File, { message: "PDF file is required" })
    .refine((f) => f.size <= MAX_FILE_SIZE, "File must be under 50MB")
    .refine((f) => ACCEPTED_PDF_TYPES.includes(f.type), "Only PDF files are accepted"),
  coverImage: z
    .instanceof(File)
    .refine((f) => !f || f.size <= MAX_IMAGE_SIZE, "Image must be under 10MB")
    .refine(
      (f) => !f || ACCEPTED_IMAGE_TYPES.includes(f.type),
      "Only JPEG, PNG, or WebP images are accepted"
    )
    .optional()
    .nullable(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author name is required"),
  voice: z.string().min(1, "Please select a voice"),
})

type FormValues = z.infer<typeof formSchema>

/* ─────────────────────────────────────────────
   Simple shadcn‑style Form field helpers
   ───────────────────────────────────────────── */
function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Dropzone component (reused for PDF & image)
   ───────────────────────────────────────────── */
function FileDropzone({
  accept,
  maxSize,
  icon,
  label,
  hint,
  selectedFile,
  onSelect,
  onRemove,
}: {
  accept: string
  maxSize: number
  icon: React.ReactNode
  label: string
  hint: string
  selectedFile: File | null
  onSelect: (file: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files?.[0]
      if (file) onSelect(file)
    },
    [onSelect]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onSelect(file)
    },
    [onSelect]
  )

  if (selectedFile) {
    return (
      <div
        className={`upload-dropzone upload-dropzone-uploaded ${isDragOver ? "ring-2 ring-[#663820]" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
        <div className="flex items-center gap-3">
          {icon}
          <span className="upload-dropzone-text">{selectedFile.name}</span>
          <button
            type="button"
            className="upload-dropzone-remove"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`upload-dropzone ${isDragOver ? "ring-2 ring-[#663820]" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <div className="file-upload-shadow">
        {icon}
        <span className="upload-dropzone-text">{label}</span>
        <span className="upload-dropzone-hint">{hint}</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Voice selector card for a single voice
   ───────────────────────────────────────────── */
function VoiceCard({
  voiceKey,
  name,
  description,
  selected,
  onSelect,
}: {
  voiceKey: string
  name: string
  description: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div
      className={`voice-selector-option cursor-pointer ${
        selected ? "voice-selector-option-selected" : "voice-selector-option-default"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 w-full">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            selected
              ? "border-[#663820] bg-[#663820]"
              : "border-gray-300"
          }`}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-[var(--text-primary)] text-base">{name}</span>
          <span className="text-sm text-[var(--text-secondary)]">{description}</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Voice group component (Male / Female)
   ───────────────────────────────────────────── */
function VoiceGroup({
  label,
  voiceKeys,
  selected,
  onSelect,
}: {
  label: string
  voiceKeys: string[]
  selected: string
  onSelect: (key: string) => void
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
        {label}
      </p>
      <div className="voice-selector-options flex-col">
        {voiceKeys.map((key) => {
          const voice = voiceOptions[key as keyof typeof voiceOptions]
          if (!voice) return null
          return (
            <VoiceCard
              key={key}
              voiceKey={key}
              name={voice.name}
              description={voice.description}
              selected={selected === key}
              onSelect={() => onSelect(key)}
            />
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Loading overlay component
   ───────────────────────────────────────────── */
function LoadingOverlay() {
  return (
    <div className="loading-wrapper">
      <div className="loading-shadow-wrapper bg-white">
        <div className="loading-shadow">
          <Loader2 className="loading-animation w-10 h-10 text-[#663820]" />
          <h3 className="loading-title">Synthesising your audiobook…</h3>
          <div className="loading-progress">
            <div className="loading-progress-item">
              <span className="loading-progress-status" />
              <span>Analysing PDF content</span>
            </div>
            <div className="loading-progress-item">
              <span className="loading-progress-status" />
              <span>Generating interview questions</span>
            </div>
            <div className="loading-progress-item">
              <span className="loading-progress-status" />
              <span>Creating voice synthesis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main UploadForm component
   ───────────────────────────────────────────── */
const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pdfFile: undefined,
      coverImage: null,
      title: "",
      author: "",
      voice: DEFAULT_VOICE,
    },
  })

  const pdfFile = watch("pdfFile")
  const coverImage = watch("coverImage")
  const selectedVoice = watch("voice")

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    // Simulate async submission — replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 5000))
    console.log("Form data:", data)
    setIsSubmitting(false)
  }

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      <div className="new-book-wrapper">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ── PDF upload ── */}
          <FormField label="PDF File" error={errors.pdfFile?.message}>
            <FileDropzone
              accept=".pdf"
              maxSize={MAX_FILE_SIZE}
              icon={<Upload className="upload-dropzone-icon" />}
              label="Click to upload PDF"
              hint="PDF file (max 50MB)"
              selectedFile={pdfFile ?? null}
              onSelect={(file) => setValue("pdfFile", file, { shouldValidate: true })}
              onRemove={() => resetField("pdfFile")}
            />
          </FormField>

          {/* ── Cover image upload ── */}
          <FormField label="Cover Image" error={errors.coverImage?.message}>
            <FileDropzone
              accept=".jpg,.jpeg,.png,.webp"
              maxSize={MAX_IMAGE_SIZE}
              icon={<Image className="upload-dropzone-icon" />}
              label="Click to upload cover image"
              hint="Leave empty to auto-generate from PDF"
              selectedFile={coverImage ?? null}
              onSelect={(file) => setValue("coverImage", file, { shouldValidate: true })}
              onRemove={() => setValue("coverImage", null, { shouldValidate: true })}
            />
          </FormField>

          {/* ── Title ── */}
          <FormField label="Title" error={errors.title?.message}>
            <input
              {...register("title")}
              className="form-input"
              placeholder="ex: Rich Dad Poor Dad"
            />
          </FormField>

          {/* ── Author ── */}
          <FormField label="Author Name" error={errors.author?.message}>
            <input
              {...register("author")}
              className="form-input"
              placeholder="ex: Robert Kiyosaki"
            />
          </FormField>

          {/* ── Voice selector ── */}
          <FormField label="Choose Assistant Voice" error={errors.voice?.message}>
            <div className="space-y-4">
              <VoiceGroup
                label="Male Voices"
                voiceKeys={voiceCategories.male}
                selected={selectedVoice}
                onSelect={(key) => setValue("voice", key, { shouldValidate: true })}
              />
              <VoiceGroup
                label="Female Voices"
                voiceKeys={voiceCategories.female}
                selected={selectedVoice}
                onSelect={(key) => setValue("voice", key, { shouldValidate: true })}
              />
            </div>
          </FormField>

          {/* ── Submit ── */}
          <button type="submit" className="form-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Synthesising…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Begin Synthesis
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </button>
        </form>
      </div>
    </>
  )
}

export default UploadForm