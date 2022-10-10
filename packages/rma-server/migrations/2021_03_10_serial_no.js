const DEFAULT_CUSTOMER = '{{cur_frm.doc.name}}'; // change it to "Castle Craft".

function execute() {
  const aggregatedData = db.serial_no.aggregate([
    {
      $match: {
        sales_invoice_name: {
          $regex:
            '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}',
        },
        customer: {
          $exists: false,
        },
      },
    },
    {
      $group: {
        _id: '$sales_invoice_name',
        serials: {
          $push: '$serial_no',
        },
      },
    },
  ]);

  for (i = 0; i < aggregatedData.length; i++) {
    this.updateStockEntry(aggregatedData[i]);
  }
}

// here data = { _id: "stock entry uuid" , serial_no : ["array","of","serials"]}
function updateStockEntry(data) {
  const stockEntry = db.stock_entry.findOne({ uuid: data._id });
  if (!stockEntry) {
    return;
  }
  db.serial_no.updateMany(
    {
      serial_no: {
        $in: data.serials,
      },
    },
    {
      $set: {
        customer: stockEntry.customer || DEFAULT_CUSTOMER,
      },
    },
  );
}

execute();
