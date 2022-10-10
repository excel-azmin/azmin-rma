function execute() {
  const count = db.stock_entry
    .find({
      'names.0': {
        $regex: 'PAQ',
      },
    })
    .count();
  const counter1 = db.stock_entry
    .find({
      $and: [
        { stock_entry_type: 'Material Receipt' },
        {
          'names.0': {
            $not: {
              $regex: 'PAQ',
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
        { stock_entry_type: 'Material Receipt' },
        {
          'names.0': {
            $regex: 'PAQ',
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
        { stock_entry_type: 'Material Receipt' },
        {
          'names.0': {
            $not: {
              $regex: 'PAQ',
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
        stock_id: 'PAQ' + '-' + '2022' + '-' + entryWithoutName,
      },
    },
  );
}

execute();
