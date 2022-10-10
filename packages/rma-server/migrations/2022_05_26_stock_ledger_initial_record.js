function execute() {
  const server_settings = db.server_settings.findOne();

  let date = new Date(
    new Date().toLocaleString('en-US', { timeZone: server_settings.timeZone }),
  );

  stockLedgers = db.stock_ledger.find().toArray();

  for (let index = 0; index < stockLedgers.length; index++) {
    const element = stockLedgers[index];
    db.stock_ledger.updateOne(
      { _id: element._id },
      {
        $set: {
          name: UUID(),
          modified: date,
          modified_by: server_settings.serviceAccountUser,
          batch_no: '',
          posting_date: date,
          posting_time: date,
          voucher_type: 'Material Receipt',
          voucher_no: UUID(),
          voucher_detail_no: '',
          incoming_rate: 0,
          outgoing_rate: 0,
          company: 'Excel Technologies Ltd.',
          fiscal_year: '2022',
        },
      },
    );
  }
}

execute();
