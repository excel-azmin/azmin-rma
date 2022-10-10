function execute() {
  const count = db.stock_entry
    .find({ stock_entry_type: 'Material Transfer' })
    .count();
  let x = db.stock_entry.find({ stock_entry_type: 'Material Transfer' });
  for (i = 0; i < count; i++) {
    this.updateStockEntry(i);
  }
}

function updateStockEntry(skip) {
  const invoice = db.stock_entry
    .find({ stock_entry_type: 'Material Transfer' })
    .skip(skip)
    .limit(1);
  db.stock_entry.updateOne(
    {
      uuid: invoice[0].uuid,
    },
    {
      $set: {
        stock_id: 'TROUT' + '-' + '2022' + '-' + skip,
      },
    },
  );
}

execute();
