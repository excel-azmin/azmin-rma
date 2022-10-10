export class DataImportSuccessResponseInterface {
  name: string;
  reference_doctype: string;
  action: string;
  doctype: string;
  import_status: string;
  insert_new: number;
  log_details: string;
}

export class FileUploadSuccessResponseInterface {
  file_name: string;
  is_private: number;
  file_url: string;
  folder: string;
  attached_to_doctype: string;
  attached_to_name: string;
  doctype: string;
}
