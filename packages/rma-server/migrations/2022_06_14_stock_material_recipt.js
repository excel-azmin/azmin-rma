function execute() {
  const count = db.stock_entry
    .find({ stock_entry_type: 'Material Receipt' })
    .count();
  let x = db.stock_entry.find({ stock_entry_type: 'Material Receipt' });
  for (i = 0; i < count; i++) {
    this.updateStockEntry(i);
  }
}

function updateStockEntry(skip) {
  const invoice = db.stock_entry
    .find({ stock_entry_type: 'Material Receipt' })
    .skip(skip)
    .limit(1);
  db.stock_entry.updateOne(
    {
      uuid: invoice[0].uuid,
    },
    {
      $set: {
        stock_id: 'PAQ' + '-' + '2022' + '-' + skip,
      },
    },
  );
}

execute();
