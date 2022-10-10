function execute() {
  const count = db.sales_invoice.count();
  let x = db.sales_invoice.find();
  for (i = 0; i < count; i++) {
    this.updateSalesInvoice(i);
  }
}

function updateSalesInvoice(skip) {
  const invoice = db.sales_invoice.find().skip(skip).limit(1);
  db.sales_invoice.updateOne(
    {
      uuid: invoice[0].uuid,
    },
    {
      $set: {
        'timeStamp.created_on': new Date(
          `${invoice[0].posting_date} ${invoice[0].posting_time}`,
        ),
      },
    },
  );
}

execute();
