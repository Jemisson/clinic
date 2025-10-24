export type AttachmentKind = 'document' | 'exam';

export type AttachmentAttributes = {
  id: number;
  patient_id: number;
  title: string | null;
  kind: AttachmentKind;
  captured_at: string | null; // ISO8601
  created_at: string;
  updated_at: string;
  file_url: string | null;
  file_thumb_url: string | null;
  creator?: { id: number; email: string } | null;
  updater?: { id: number; email: string } | null;
};

export type AttachmentResource = {
  id: string;      // JSON:API usa string para id no topo
  type: 'patient_attachment';
  attributes: AttachmentAttributes;
};

export type PaginationMeta = {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
};

export type IndexResponse = {
  data: AttachmentResource[];
  meta?: PaginationMeta;
};

export type ShowResponse = {
  data: AttachmentResource;
};

// payloads de create/update (sem file/thumb gerados pela API)
export type CreateOrUpdatePatientAttachmentInput = {
  title?: string | null;
  kind: AttachmentKind;
  captured_at?: string | null; // ISO8601
};

export type ExtraUpload = {
  file?: File | null; // opcional em update
};
