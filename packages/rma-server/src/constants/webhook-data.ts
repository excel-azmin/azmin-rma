export function getBearerTokenOnTrashWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'OAuth Bearer Token',
    webhook_docevent: 'on_trash',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getBearerTokenAfterInsertWebhookData(
  webhookURL: string,
  webhookApiKey: string,
  webhookDocevent = 'after_insert',
) {
  return {
    webhook_doctype: 'OAuth Bearer Token',
    webhook_docevent: webhookDocevent,
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getSupplierAfterInsertWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Supplier',
    webhook_docevent: 'after_insert',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getSupplierOnUpdateWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Supplier',
    webhook_docevent: 'on_update',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getSupplierOnTrashWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Supplier',
    webhook_docevent: 'on_trash',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getCustomerAfterInsertWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Customer',
    webhook_docevent: 'after_insert',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getCustomerOnUpdateWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Customer',
    webhook_docevent: 'on_update',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getCustomerOnTrashWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Customer',
    webhook_docevent: 'on_trash',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getItemAfterInsertWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Item',
    webhook_docevent: 'after_insert',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getItemOnUpdateWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Item',
    webhook_docevent: 'on_update',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getItemOnTrashWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Item',
    webhook_docevent: 'on_trash',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function deliveryNoteNoAfterInsertWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Delivery Note',
    webhook_docevent: 'after_insert',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function deliveryNoteOnUpdateWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Delivery Note',
    webhook_docevent: 'on_update',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function deliveryNoteOnTrashWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Delivery Note',
    webhook_docevent: 'on_trash',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function purchaseInvoiceOnSubmitWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Purchase Invoice',
    webhook_docevent: 'on_submit',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function salesInvoiceOnSubmitWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Sales Invoice',
    webhook_docevent: 'on_submit',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function salesInvoiceOnCancelWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Sales Invoice',
    webhook_docevent: 'on_cancel',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function purchaseOrderOnSubmitWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Purchase Order',
    webhook_docevent: 'on_submit',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function purchaseInvoiceOnCancelWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Purchase Invoice',
    webhook_docevent: 'on_cancel',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function purchaseReceiptOnCancelWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Purchase Receipt',
    webhook_docevent: 'on_cancel',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function dataImportLegacyAfterInsertWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Data Import Legacy',
    webhook_docevent: 'on_update',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function itemBundleAfterUpdateWebhookData(
  webhookURL: string,
  webhookApiKey: string,
) {
  return {
    webhook_doctype: 'Product Bundle',
    webhook_docevent: 'on_update',
    request_url: webhookURL,
    request_structure: 'Form URL-Encoded',
    doctype: 'Webhook',
    webhook_headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
      {
        key: 'x-frappe-api-key',
        value: webhookApiKey,
      },
    ],
    webhook_data: getWebhookDataFields(),
  };
}

export function getWebhookDataFields() {
  return [
    { fieldname: 'name', key: 'name' },
    { fieldname: 'doctype', key: 'doctype' },
  ];
}
