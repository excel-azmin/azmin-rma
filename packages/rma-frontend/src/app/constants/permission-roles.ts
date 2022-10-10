import { PermissionStateInterface } from '../api/permission/permission.service';

export const PermissionRoles = {
  sales_invoice: {
    read: [
      'Branch Sales Creator',
      'Branch Sales Approver',
      'Branch Sales Manager',
      'Branch Sales Return User',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    create: [
      'Branch Sales Creator',
      'Branch Sales Approver',
      'Branch Sales Manager',
      'Branch Sales Return User',
      'General Admin',
    ],
    update: [
      'Branch Sales Creator',
      'Branch Sales Approver',
      'Branch Sales Manager',
      'Branch Sales Return User',
      'General Admin',
    ],
    submit: [
      'Branch Sales Approver',
      'Branch Sales Manager',
      'Branch Sales Return User',
      'General Admin',
    ],
    delete: ['General Admin'],
  },

  sales_return: {
    read: [
      'Branch Sales Creator',
      'Branch Sales Approver',
      'Branch Sales Manager',
      'Branch Sales Return User',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    create: ['Branch Sales Return User', 'General Admin'],
    update: ['Branch Sales Return User', 'General Admin'],
    delete: ['General Admin'],
  },

  credit_note: {
    read: [
      'Branch Sales Creator',
      'Branch Sales Approver',
      'Branch Sales Manager',
      'Branch Sales Return User',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
  },

  campaign_return: {
    read: [
      'Branch Sales Creator',
      'Branch Sales Approver',
      'Branch Sales Manager',
      'Branch Sales Return User',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    create: ['General Admin'],
  },

  delivery_note: {
    read: [
      'Branch Sales Manager',
      'Branch Sales Return User',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    create: [
      'Branch Sales Manager',
      'Branch Sales Return User',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    update: [
      'Branch Sales Manager',
      'Branch Sales Return User',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    submit: [
      'Branch Sales Manager',
      'Branch Sales Return User',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    delete: ['General Admin'],
  },

  purchase_invoice: {
    read: ['Branch Purchase User', 'Branch Purchase Manager', 'General Admin'],
    create: ['Branch Purchase Manager', 'General Admin'],
    update: ['Branch Purchase Manager', 'General Admin'],
    submit: ['Branch Purchase Manager', 'General Admin'],
    delete: [],
  },

  purchase_receipt: {
    read: ['Branch Purchase User', 'Branch Purchase Manager', 'General Admin'],
    create: ['Branch Purchase Manager', 'General Admin'],
    update: ['Branch Purchase Manager', 'General Admin'],
    submit: ['Branch Purchase Manager', 'General Admin'],
    delete: [],
  },

  /**
   * We need to split permissions for stock entry types
   * Material Transfer Acceptance should be allowed to specific role
   * Material Receipt, Issue, RnD has different roles permission
   */
  // Material Transfer
  stock_entry: {
    read: [
      'Branch Sales Manager',
      'Branch Stock Viewer',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'Branch Stock Receipt Viewer',
      'Branch Stock Receipt Creator',
      'Branch Stock Receipt Approver',
      'Branch Stock Issue Viewer',
      'Branch Stock Issue Creator',
      'Branch Stock Issue Approver',
      'Branch Stock RnD Viewer',
      'Branch Stock RnD Creator',
      'Branch Stock RnD Approver',
      'Branch Sales Creator',
      'Branch Sales Approver',
      'Branch Sales Return User',
      'Item Price Manager',
      'General Admin',
    ],
    create: [
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    update: [
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    submit: [
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    // This accept action needs to be added
    accept: [
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    delete: ['General Admin'],
  },

  // Material Receipt
  stock_entry_receipt: {
    read: [
      'Branch Stock Receipt Viewer',
      'Branch Stock Receipt Creator',
      'Branch Stock Receipt Approver',
      'General Admin',
    ],
    create: [
      'Branch Stock Receipt Creator',
      'Branch Stock Receipt Approver',
      'General Admin',
    ],
    update: [
      'Branch Stock Receipt Creator',
      'Branch Stock Receipt Approver',
      'General Admin',
    ],
    submit: ['Branch Stock Receipt Approver', 'General Admin'],
    delete: ['General Admin'],
  },

  // Material Issue
  stock_entry_issue: {
    read: [
      'Branch Stock Issue Viewer',
      'Branch Stock Issue Creator',
      'Branch Stock Issue Approver',
      'General Admin',
    ],
    create: [
      'Branch Stock Issue Creator',
      'Branch Stock Issue Approver',
      'General Admin',
    ],
    update: [
      'Branch Stock Issue Creator',
      'Branch Stock Issue Approver',
      'General Admin',
    ],
    submit: ['Branch Stock Issue Approver', 'General Admin'],
    delete: ['General Admin'],
  },

  // Material RnD
  stock_entry_rnd: {
    read: [
      'Branch Stock RnD Viewer',
      'Branch Stock RnD Creator',
      'Branch Stock RnD Approver',
      'General Admin',
    ],
    create: [
      'Branch Stock RnD Creator',
      'Branch Stock RnD Approver',
      'General Admin',
    ],
    update: [
      'Branch Stock RnD Creator',
      'Branch Stock RnD Approver',
      'General Admin',
    ],
    submit: ['Branch Stock RnD Approver', 'General Admin'],
    delete: ['General Admin'],
  },

  // Is this Stock Availability??
  stock_history: {
    read: [
      'Branch Sales Creator',
      'Branch Sales Approver',
      'Branch Sales Manager',
      'Branch Sales Return User',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'Item Price Manager',
      'Branch Stock Receipt Approver',
      'Branch Stock Receipt Creator',
      'Branch Stock Issue Creator',
      'Branch Stock Issue Approver',
      'Branch Stock RnD Creator',
      'Branch Stock RnD Approver',
      'General Admin',
    ],
  },

  customer_profile: {
    read: [
      'Branch Sales Creator',
      'Branch Sales Approver',
      'Branch Sales Manager',
      'Branch Sales Return User',
      'Branch Stock Manager',
      'Credit Limit Manager',
      'General Admin',
    ],
  },

  credit_limit: {
    create: ['Credit Limit Manager', 'General Admin'],
    read: ['Credit Limit Manager', 'General Admin'],
    update: ['Credit Limit Manager', 'General Admin'],
    delete: ['Credit Limit Manager', 'General Admin'],
  },

  item_price: {
    create: ['Item Price Manager', 'General Admin'],
    read: [
      'Item Price Manager',
      'Item Price Viewer',
      'Branch Sales Creator',
      'General Admin',
    ],
    update: ['Item Price Manager', 'General Admin'],
    delete: ['Item Price Manager', 'General Admin'],
  },
  erpnext: {
    read: [
      'Branch Sales Manager',
      'Branch Stock Manager',
      'Branch Sales Return User',
      'General Admin',
    ],
  },
  jobs: {
    read: ['General Admin'],
    update: ['General Admin'],
  },

  settings: {
    read: [],
    update: [],
  },
  // warranty starts here
  warranty_claim: {
    read: [
      'RMA Claim Creator',
      'RMA Claim Manager',
      'RMA Verdict Manager',
      'RMA Stock Creator',
      'RMA Stock Manager',
      'RMA Invoice Creator',
      'RMA Invoice Manager',
      'RMA Purchase Claim Manager',
      'General Admin',
    ],
    create: ['RMA Claim Creator', 'RMA Claim Manager', 'General Admin'],
    update: ['RMA Claim Creator', 'RMA Claim Manager', 'General Admin'],
    submit: ['RMA Claim Creator', 'RMA Claim Manager', 'General Admin'],
    delete: ['RMA Invoice Manager', 'General Admin'],
  },

  claim_verdict: {
    read: [
      'RMA Claim Creator',
      'RMA Claim Manager',
      'RMA Verdict Manager',
      'RMA Stock Creator',
      'RMA Stock Manager',
      'RMA Invoice Creator',
      'RMA Invoice Manager',
      'RMA Purchase Claim Manager',
      'General Admin',
    ],
    create: [
      'RMA Claim Manager',
      'RMA Verdict Manager',
      'RMA Stock Creator',
      'RMA Stock Manager',
      'RMA Invoice Creator',
      'RMA Invoice Manager',
      'RMA Purchase Claim Manager',
      'General Admin',
    ],
    delete: [
      'RMA Verdict Manager',
      'RMA Stock Creator',
      'RMA Stock Manager',
      'RMA Invoice Creator',
      'RMA Invoice Manager',
      'RMA Purchase Claim Manager',
      'General Admin',
    ],
  },

  rma_stock_entry: {
    create: [
      'RMA Stock Manager',
      'RMA Invoice Manager',
      'RMA Purchase Claim Manager',
      'General Admin',
    ],
    cancel: [
      'RMA Stock Manager',
      'RMA Invoice Manager',
      'RMA Purchase Claim Manager',
      'General Admin',
    ],
  },

  service_invoice: {
    read: [
      'RMA Claim Creator',
      'RMA Claim Manager',
      'RMA Verdict Manager',
      'RMA Stock Creator',
      'RMA Stock Manager',
      'RMA Invoice Creator',
      'RMA Invoice Manager',
      'RMA Purchase Claim Manager',
      'General Admin',
    ],
    create: ['RMA Invoice Creator', 'RMA Invoice Manager', 'General Admin'],
    update: ['RMA Invoice Creator', 'RMA Invoice Manager', 'General Admin'],
    submit: ['RMA Invoice Manager', 'General Admin'],
    cancel: ['RMA Invoice Manager', 'General Admin'],
  },
  // the problem list should be accesible to this roles only
  problems: {
    read: [
      'RMA Claim Creator',
      'RMA Claim Manager',
      'RMA Verdict Manager',
      'RMA Stock Creator',
      'RMA Stock Manager',
      'RMA Invoice Creator',
      'RMA Invoice Manager',
      'RMA Purchase Claim Manager',
      'General Admin',
    ],
    create: ['RMA Invoice Creator', 'RMA Invoice Manager', 'General Admin'],
    update: ['RMA Invoice Creator', 'RMA Invoice Manager', 'General Admin'],
    submit: ['RMA Invoice Manager', 'General Admin'],
    cancel: ['RMA Invoice Manager', 'General Admin'],
  },
  purchase_claim: {
    create: ['RMA Purchase Claim Manager', 'General Admin'],
    update: ['RMA Purchase Claim Manager', 'General Admin'],
    submit: ['RMA Purchase Claim Manager', 'General Admin'],
    cancel: ['RMA Purchase Claim Manager', 'General Admin'],
  },
  // considering this as serial search feature, single serial search should be available to all roles
  // but for serial dump = download csv of serials selecting item,warehouse should be restricted
  status_history: {
    read: [],
    create: [],
    update: [],
    delete: [],
  },
  serial_dump: {
    read: [
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'Branch Purchase User',
      'Branch Purchase Manager',
      'Branch Stock Receipt Creator',
      'Branch Stock Receipt Approver',
      'Branch Stock Issue Approver',
      'Branch Stock RnD Creator',
      'Branch Stock RnD Approver',
      'General Admin',
      'RMA Stock Creator',
      'RMA Stock Manager',
      'RMA Invoice Manager',
    ],
    create: [],
    update: [],
    delete: [],
  },
};
// warranty ends here

export const PERMISSION_STATE: PermissionStateInterface = {
  sales_invoice: {
    create: false,
    read: false,
    update: false,
    delete: false,
    submit: false,
    active: false,
  },

  delivery_note: {
    create: false,
    read: false,
    update: false,
    delete: false,
    active: false,
  },

  item_price: {
    create: false,
    read: false,
    update: false,
    active: false,
  },

  sales_return: {
    create: false,
    read: false,
    update: false,
    delete: false,
    active: false,
  },

  credit_limit: {
    create: false,
    read: false,
    update: false,
    delete: false,
    active: false,
  },

  credit_note: {
    read: false,
    active: false,
  },

  purchase_invoice: {
    read: false,
    active: false,
  },

  purchase_receipt: {
    create: false,
    read: false,
    active: false,
  },

  warranty_claim: {
    create: false,
    read: false,
    update: false,
    delete: false,
    active: false,
  },

  service_invoice: {
    create: false,
    read: false,
    active: false,
  },

  status_history: {
    create: false,
    read: false,
    update: false,
    delete: false,
    active: false,
  },

  stock_history: {
    create: false,
    read: false,
    active: false,
  },

  stock_entry: {
    create: false,
    read: false,
    update: false,
    accept: false,
    delete: false,
    submit: false,
    active: false,
  },

  jobs: {
    read: false,
    update: false,
    active: false,
  },

  customer_profile: {
    read: false,
    active: false,
  },

  settings: {
    read: false,
    update: false,
    active: false,
  },
  campaign_return: {
    create: false,
    read: false,
  },
  stock_entry_receipt: {
    read: false,
    create: false,
    update: false,
    submit: false,
    delete: false,
  },

  // Material Issue
  stock_entry_issue: {
    read: false,
    create: false,
    update: false,
    submit: false,
    delete: false,
  },

  // Material RnD
  stock_entry_rnd: {
    read: false,
    create: false,
    update: false,
    submit: false,
    delete: false,
  },
};

export const settingPermissions = {
  backdated_permissions: false,
  backdated_permissions_for_days: 0,
};
