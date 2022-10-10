function execute() {
  const count = db.stock_entry
    .find({
      'names.0': {
        $regex: 'PCM',
      },
    })
    .count();
  const counter1 = db.stock_entry
    .find({
      $and: [
        { stock_entry_type: 'Material Issue' },
        {
          'names.0': {
            $not: {
              $regex: 'PCM',
            },
          },
        },
      ],
    })
    .count();
  let z = 0;
  for (i = 0; i < count; i++) {
    this.updateStockEntrywithNames(i);
    z = i;
  }
  z = z + 1;
  for (f = 0; f < counter1; f++) {
    this.updateStockEntrywithoutNames(f, z);
  }
}

function updateStockEntrywithNames(skip) {
  const invoice = db.stock_entry
    .find({
      $and: [
        { stock_entry_type: 'Material Issue' },
        {
          'names.0': {
            $regex: 'PCM',
          },
        },
      ],
    })
    .skip(skip)
    .limit(1);
  db.stock_entry.updateOne(
    {
      uuid: invoice[0].uuid,
    },
    {
      $set: {
        stock_id: invoice[0].names[0],
      },
    },
  );
}

function updateStockEntrywithoutNames(skip, z) {
  const invoice = db.stock_entry
    .find({
      $and: [
        { stock_entry_type: 'Material Issue' },
        {
          'names.0': {
            $not: {
              $regex: 'PCM',
            },
          },
        },
      ],
    })
    .skip(skip)
    .limit(1);
  let entryWithoutName = skip + z;
  db.stock_entry.updateOne(
    {
      uuid: invoice[0].uuid,
    },
    {
      $set: {
        stock_id: 'PCM' + '-' + '2022' + '-' + entryWithoutName,
      },
    },
  );
}

execute();
