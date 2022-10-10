function execute() {
  const count = db.stock_entry.find({ status: 'Draft' }).count();
  let x = db.stock_entry.find({ status: 'Draft' });
  for (i = 0; i < count; i++) {
    this.updateStockEntry(i);
  }
}

function updateStockEntry(skip) {
  const invoice = db.stock_entry.find({ status: 'Draft' }).skip(skip).limit(1);
  db.stock_entry.updateOne(
    {
      uuid: invoice[0].uuid,
    },
    {
      $set: {
        stock_id: invoice[0].uuid,
      },
    },
  );
}

execute();
